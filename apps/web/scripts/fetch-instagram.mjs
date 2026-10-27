// Build-time Instagram sync for the static export.
//
// Fetches the profile and latest posts from the Instagram API (with Instagram
// Login), downloads each post's image into public/instagram/ (Instagram CDN URLs
// are signed and expire, so a static page can't hotlink them), and writes
// src/data/instagram.json for the page to read at build time.
//
// When running in GitHub Actions with GH_SECRETS_TOKEN set, the long-lived
// access token is refreshed and written back to the INSTAGRAM_ACCESS_TOKEN
// repository secret (via `gh secret set`), so the scheduled workflow keeps it
// from expiring (60-day lifetime).
//
// Never fails the build: on any error it keeps the previous data (or writes an
// empty feed), and the page renders without the grid.

import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GRAPH_URL = 'https://graph.instagram.com';
const API_VERSION = 'v22.0';
const MEDIA_LIMIT = 12;
const TOKEN_VARIABLE = 'INSTAGRAM_ACCESS_TOKEN';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(webRoot, 'src/data/instagram.json');
const imageDir = path.join(webRoot, 'public/instagram');

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function graphGet(endpoint, params, token) {
  const query = new URLSearchParams({ ...params, access_token: token });
  const res = await fetch(`${GRAPH_URL}/${API_VERSION}/${endpoint}?${query}`);
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

function saveTokenSecret(token) {
  const { GH_SECRETS_TOKEN, GITHUB_REPOSITORY } = process.env;
  // The value goes over stdin so it never appears in the process list.
  const result = spawnSync('gh', ['secret', 'set', TOKEN_VARIABLE, '--repo', GITHUB_REPOSITORY], {
    input: token,
    env: { ...process.env, GH_TOKEN: GH_SECRETS_TOKEN },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    console.warn(`[instagram] could not save refreshed token to GitHub secrets: ${result.stderr || result.error}`);
  } else {
    console.log('[instagram] access token refreshed and saved to GitHub secrets');
  }
}

async function refreshToken(token) {
  const { GITHUB_ACTIONS, GITHUB_REPOSITORY, GH_SECRETS_TOKEN } = process.env;
  // Without a place to persist it, refreshing would just strand the new token.
  if (GITHUB_ACTIONS !== 'true' || !GITHUB_REPOSITORY || !GH_SECRETS_TOKEN) return token;

  try {
    const res = await fetch(
      `${GRAPH_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`,
    );
    if (!res.ok) {
      // Instagram rejects refreshes of tokens younger than 24h; that's fine.
      console.warn(`[instagram] token refresh skipped: ${res.status}`);
      return token;
    }
    const { access_token } = await res.json();
    if (!access_token) return token;

    // Keep the new token out of the workflow logs.
    console.log(`::add-mask::${access_token}`);
    saveTokenSecret(access_token);
    return access_token;
  } catch (error) {
    console.warn('[instagram] token refresh error', error);
    return token;
  }
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image download failed: ${res.status}`);
  await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
}

async function sync(token) {
  const profile = await graphGet('me', { fields: 'username,name,biography' }, token);
  const media = await graphGet(
    'me/media',
    { fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp', limit: String(MEDIA_LIMIT) },
    token,
  );

  const tmpDir = `${imageDir}.tmp`;
  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });

  const posts = [];
  for (const item of media.data ?? []) {
    // Videos expose a still via thumbnail_url; images and carousels (cover) via media_url.
    const source = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
    if (!source) continue;
    const filename = `${item.id}.jpg`;
    try {
      await download(source, path.join(tmpDir, filename));
    } catch (error) {
      console.warn(`[instagram] skipping post ${item.id}:`, error.message);
      continue;
    }
    posts.push({
      id: item.id,
      caption: item.caption ?? null,
      mediaType: item.media_type,
      image: `/instagram/${filename}`,
      permalink: item.permalink,
      timestamp: item.timestamp,
    });
  }

  await fs.rm(imageDir, { recursive: true, force: true });
  await fs.rename(tmpDir, imageDir);

  return {
    fetchedAt: new Date().toISOString(),
    profile: { username: profile.username, name: profile.name ?? null, biography: profile.biography ?? null },
    posts,
  };
}

async function main() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  const token = process.env[TOKEN_VARIABLE];

  if (!token) {
    console.warn(`[instagram] ${TOKEN_VARIABLE} not set; skipping sync`);
  } else {
    try {
      const feed = await sync(await refreshToken(token));
      await fs.writeFile(dataFile, JSON.stringify(feed, null, 2));
      console.log(`[instagram] synced ${feed.posts.length} posts`);
      return;
    } catch (error) {
      console.error('[instagram] sync failed:', error.message);
    }
  }

  if (!(await exists(dataFile))) {
    await fs.writeFile(dataFile, JSON.stringify({ fetchedAt: null, profile: null, posts: [] }, null, 2));
  }
}

main();

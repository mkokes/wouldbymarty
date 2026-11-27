// Build-time Instagram sync for the static site.
//
// Fetches the profile, the latest posts and the hero reel from either:
//   - Instagram API with Unified Login (graph.facebook.com, EAA... Business
//     Integration System User token), or
//   - Instagram API with Instagram Login (graph.instagram.com, IG... token).
//
// Stores optimized copies of the media in public/instagram/ (Instagram CDN URLs
// are signed and expire, so a static page can't hotlink them), and writes
// src/data/instagram.json for the app.
//
// Never fails the build: on any error it keeps the previous data (or writes an
// empty feed), and the page renders without Instagram content.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const INSTAGRAM_GRAPH_URL = 'https://graph.instagram.com';
const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com';
const API_VERSION = 'v22.0';
// One featured post plus a 12-tile grid, with room to skip the hero if it's recent.
const MEDIA_LIMIT = 14;
// The post shown in the hero. Reels play as a muted looping video.
const HERO_SHORTCODE = 'Dcc28iuulEv';
const HERO_SEARCH_PAGES = 10;
const MAX_VIDEO_BYTES = 30 * 1024 * 1024;
const POST_WIDTHS = [480, 960];
const POSTER_WIDTHS = [960, 1920];
const AVATAR_WIDTHS = [160, 320];
const TOKEN_VARIABLE = 'INSTAGRAM_ACCESS_TOKEN';
const MEDIA_FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(webRoot, 'src/data/instagram.json');
const imageDir = path.join(webRoot, 'public/instagram');
const tmpDir = `${imageDir}.tmp`;

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${new URL(url).pathname} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

function isInstagramLoginToken(token) {
  return token.startsWith('IG');
}

function graphUrl(baseUrl, endpoint, params, token) {
  const query = new URLSearchParams({ ...params, access_token: token });
  return `${baseUrl}/${API_VERSION}/${endpoint}?${query}`;
}

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Writes WebP renditions at each width (never upscaling) plus a tiny blurred
 * placeholder, and returns what the app needs to render a responsive <img>.
 */
async function optimizeImage(buffer, name, widths) {
  const { width: sourceWidth, height: sourceHeight } = await sharp(buffer).metadata();
  const targets = [...new Set(widths.map((w) => Math.min(w, sourceWidth)))];

  const variants = [];
  for (const width of targets) {
    const file = `${name}-${width}.webp`;
    await sharp(buffer).resize({ width }).webp({ quality: 74 }).toFile(path.join(tmpDir, file));
    variants.push({ width, src: `/instagram/${file}` });
  }

  const placeholder = await sharp(buffer).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  const largest = variants.at(-1);
  return {
    src: largest.src,
    srcSet: variants.map((v) => `${v.src} ${v.width}w`).join(', '),
    width: largest.width,
    height: Math.round((sourceHeight / sourceWidth) * largest.width),
    placeholder: `data:image/webp;base64,${placeholder.toString('base64')}`,
  };
}

function stillUrl(item) {
  // Videos expose a still via thumbnail_url; images and carousels (cover) via media_url.
  return item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
}

function shortcode(permalink) {
  return permalink?.match(/\/(?:p|reels?|tv)\/([^/?#]+)/)?.[1] ?? null;
}

async function findHero(firstPage) {
  let page = firstPage;
  for (let i = 0; i < HERO_SEARCH_PAGES && page; i++) {
    const match = page.data?.find((item) => shortcode(item.permalink) === HERO_SHORTCODE);
    if (match) return match;
    page = page.paging?.next ? await getJson(page.paging.next) : null;
  }
  console.warn(`[instagram] hero post ${HERO_SHORTCODE} not found; using the latest post`);
  return null;
}

async function buildHero(item) {
  const poster = await optimizeImage(await download(stillUrl(item)), `hero-${item.id}`, POSTER_WIDTHS);
  let video = null;
  if (item.media_type === 'VIDEO' && item.media_url) {
    try {
      const buffer = await download(item.media_url);
      if (buffer.length <= MAX_VIDEO_BYTES) {
        const file = `hero-${item.id}.mp4`;
        await fs.writeFile(path.join(tmpDir, file), buffer);
        video = `/instagram/${file}`;
      } else {
        console.warn(`[instagram] hero video is ${buffer.length} bytes; using the still only`);
      }
    } catch (error) {
      console.warn('[instagram] hero video skipped:', error.message);
    }
  }
  return { id: item.id, caption: item.caption ?? null, permalink: item.permalink, poster, video };
}

async function resolveTarget(token) {
  if (isInstagramLoginToken(token)) {
    return { baseUrl: INSTAGRAM_GRAPH_URL, accountId: 'me' };
  }
  const accounts = await getJson(
    graphUrl(FACEBOOK_GRAPH_URL, 'me/assigned_instagram_accounts', { fields: 'id' }, token),
  );
  const accountId = accounts.data?.[0]?.id;
  if (!accountId) {
    throw new Error('No assigned Instagram account returned by /me/assigned_instagram_accounts');
  }
  return { baseUrl: FACEBOOK_GRAPH_URL, accountId };
}

async function sync(token) {
  const { baseUrl, accountId } = await resolveTarget(token);
  const profile = await getJson(
    graphUrl(baseUrl, accountId, { fields: 'username,name,biography,profile_picture_url' }, token),
  );
  const firstPage = await getJson(
    graphUrl(baseUrl, `${accountId}/media`, { fields: MEDIA_FIELDS, limit: String(MEDIA_LIMIT) }, token),
  );

  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });

  const posts = [];
  for (const item of firstPage.data ?? []) {
    const source = stillUrl(item);
    if (!source) continue;
    try {
      posts.push({
        id: item.id,
        caption: item.caption ?? null,
        mediaType: item.media_type,
        image: await optimizeImage(await download(source), item.id, POST_WIDTHS),
        permalink: item.permalink,
        timestamp: item.timestamp,
      });
    } catch (error) {
      console.warn(`[instagram] skipping post ${item.id}:`, error.message);
    }
  }

  const heroItem = (await findHero(firstPage)) ?? firstPage.data?.[0];
  const hero = heroItem ? await buildHero(heroItem) : null;

  let avatar = null;
  if (profile.profile_picture_url) {
    try {
      avatar = await optimizeImage(await download(profile.profile_picture_url), 'avatar', AVATAR_WIDTHS);
    } catch (error) {
      console.warn('[instagram] avatar skipped:', error.message);
    }
  }

  await fs.rm(imageDir, { recursive: true, force: true });
  await fs.rename(tmpDir, imageDir);

  return {
    fetchedAt: new Date().toISOString(),
    profile: {
      username: profile.username,
      name: profile.name ?? null,
      biography: profile.biography ?? null,
      avatar,
    },
    hero,
    posts,
  };
}

async function main() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  const token = process.env[TOKEN_VARIABLE]?.trim();

  if (!token) {
    console.warn(`[instagram] ${TOKEN_VARIABLE} not set; skipping sync`);
  } else {
    try {
      const feed = await sync(token);
      await fs.writeFile(dataFile, JSON.stringify(feed, null, 2));
      console.log(`[instagram] synced ${feed.posts.length} posts${feed.hero?.video ? ' and the hero video' : ''}`);
      return;
    } catch (error) {
      console.error('[instagram] sync failed:', error.message);
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  }

  if (!(await exists(dataFile))) {
    await fs.writeFile(dataFile, JSON.stringify({ fetchedAt: null, profile: null, hero: null, posts: [] }, null, 2));
  }
}

main();

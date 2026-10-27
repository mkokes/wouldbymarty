// The feed is produced by scripts/fetch-instagram.mjs (the `predev`/`prebuild`
// step) and bundled at build time. A glob import resolves to an empty object
// when the file doesn't exist, so the app still builds and tests run without it.
const feedModules = import.meta.glob<InstagramFeed>('../data/instagram.json', { eager: true, import: 'default' });

export type InstagramMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

export interface InstagramProfile {
  username: string;
  name: string | null;
  biography: string | null;
}

export interface InstagramPost {
  id: string;
  caption: string | null;
  mediaType: InstagramMediaType;
  image: string;
  permalink: string;
  timestamp: string;
}

export interface InstagramFeed {
  fetchedAt: string | null;
  profile: InstagramProfile | null;
  posts: InstagramPost[];
}

export const EMPTY_FEED: InstagramFeed = { fetchedAt: null, profile: null, posts: [] };

export function normalizeFeed(feed: Partial<InstagramFeed> | undefined): InstagramFeed {
  return { ...EMPTY_FEED, ...feed, posts: feed?.posts ?? [] };
}

export function getInstagramFeed(): InstagramFeed {
  return normalizeFeed(Object.values(feedModules)[0]);
}

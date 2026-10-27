// The feed is produced by scripts/fetch-instagram.mjs (the `predev`/`prebuild`
// step) and bundled at build time. A glob import resolves to an empty object
// when the file doesn't exist, so the app still builds and tests run without it.
const feedModules = import.meta.glob<InstagramFeed>('../data/instagram.json', { eager: true, import: 'default' });

export type InstagramMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

export interface ResponsiveImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  placeholder: string | null;
}

export interface InstagramProfile {
  username: string;
  name: string | null;
  biography: string | null;
  avatar: ResponsiveImage | null;
}

export interface InstagramPost {
  id: string;
  caption: string | null;
  mediaType: InstagramMediaType;
  image: ResponsiveImage;
  permalink: string;
  timestamp: string;
}

export interface InstagramHero {
  id: string;
  caption: string | null;
  permalink: string;
  poster: ResponsiveImage;
  video: string | null;
}

export interface InstagramFeed {
  fetchedAt: string | null;
  profile: InstagramProfile | null;
  hero: InstagramHero | null;
  posts: InstagramPost[];
}

export const EMPTY_FEED: InstagramFeed = { fetchedAt: null, profile: null, hero: null, posts: [] };

export const GRID_SIZE = 12;

export function normalizeFeed(feed: Partial<InstagramFeed> | undefined): InstagramFeed {
  return { ...EMPTY_FEED, ...feed, posts: feed?.posts ?? [] };
}

export function getInstagramFeed(): InstagramFeed {
  return normalizeFeed(Object.values(feedModules)[0]);
}

/**
 * Splits posts into the featured post and the grid, leaving out the hero so it isn't shown twice.
 * The grid is trimmed to whole rows of three so the last row never has a lone tile.
 */
export function arrangePosts(feed: InstagramFeed): { featured: InstagramPost | null; grid: InstagramPost[] } {
  const [featured = null, ...rest] = feed.posts.filter((post) => post.id !== feed.hero?.id);
  const grid = rest.slice(0, GRID_SIZE);
  return { featured, grid: grid.length > 3 ? grid.slice(0, grid.length - (grid.length % 3)) : grid };
}

/** Removes the run of hashtags Instagram captions usually end with. */
export function cleanCaption(caption: string | null): string {
  if (!caption) return '';
  return caption.replace(/(?:\s*#[\p{L}\p{N}_]+)+\s*$/u, '').trim();
}

/** First line of the cleaned caption, truncated for tile overlays and alt text. */
export function excerpt(caption: string | null, maxLength = 120): string {
  const firstLine = cleanCaption(caption).split('\n')[0].trim();
  return firstLine.length > maxLength ? `${firstLine.slice(0, maxLength).trimEnd()}…` : firstLine;
}

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Fixed locale and time zone so the pre-rendered HTML matches what the browser hydrates. */
export function formatPostDate(timestamp: string): string {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? '' : dateFormat.format(date);
}

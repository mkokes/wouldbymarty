import { describe, expect, it } from 'vitest';
import { feed, post } from '../test/fixtures';
import { arrangePosts, cleanCaption, EMPTY_FEED, excerpt, formatPostDate, GRID_SIZE, normalizeFeed } from './instagram';

describe('normalizeFeed', () => {
  it('returns an empty feed when there is no data', () => {
    expect(normalizeFeed(undefined)).toEqual(EMPTY_FEED);
  });

  it('fills in missing fields from older data files', () => {
    const profile = { username: 'wouldbymarty', name: null, biography: null, avatar: null };
    expect(normalizeFeed({ profile })).toEqual({ ...EMPTY_FEED, profile });
  });
});

describe('arrangePosts', () => {
  it('features the newest non-hero post and puts the rest in the grid', () => {
    const { featured, grid } = arrangePosts(feed);
    expect(featured?.id).toBe('latest');
    expect(grid.map((p) => p.id)).toEqual(['older']);
  });

  it('caps the grid size', () => {
    const posts = Array.from({ length: 20 }, (_, i) => post(String(i)));
    const { grid } = arrangePosts({ ...EMPTY_FEED, posts });
    expect(grid).toHaveLength(GRID_SIZE);
  });

  it('trims the grid to whole rows of three', () => {
    const posts = Array.from({ length: 12 }, (_, i) => post(String(i)));
    const { grid } = arrangePosts({ ...EMPTY_FEED, posts });
    expect(grid).toHaveLength(9);
  });

  it('handles an empty feed', () => {
    expect(arrangePosts(EMPTY_FEED)).toEqual({ featured: null, grid: [] });
  });
});

describe('cleanCaption', () => {
  it('strips trailing hashtags but keeps inline ones', () => {
    expect(cleanCaption('Elm top with a #jatoba stripe #woodworking #elm')).toBe('Elm top with a #jatoba stripe');
  });

  it('strips a trailing hashtag block on its own line', () => {
    expect(cleanCaption('Side table\n\n#woodworking #diy')).toBe('Side table');
  });

  it('returns an empty string for a missing caption', () => {
    expect(cleanCaption(null)).toBe('');
  });
});

describe('excerpt', () => {
  it('keeps only the first line of the cleaned caption', () => {
    expect(excerpt('First line #tag\nSecond line #woodworking')).toBe('First line #tag');
  });

  it('truncates long captions with an ellipsis', () => {
    const result = excerpt('a'.repeat(200));
    expect(result).toHaveLength(121);
    expect(result.endsWith('…')).toBe(true);
  });
});

describe('formatPostDate', () => {
  it('formats Instagram timestamps as month and year in UTC', () => {
    expect(formatPostDate('2026-10-01T02:00:00+0000')).toBe('October 2026');
  });

  it('returns an empty string for invalid dates', () => {
    expect(formatPostDate('nope')).toBe('');
  });
});

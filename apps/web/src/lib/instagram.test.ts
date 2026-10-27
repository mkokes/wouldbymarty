import { describe, expect, it } from 'vitest';
import { EMPTY_FEED, normalizeFeed } from './instagram';

describe('normalizeFeed', () => {
  it('returns an empty feed when there is no data', () => {
    expect(normalizeFeed(undefined)).toEqual(EMPTY_FEED);
  });

  it('fills in missing posts', () => {
    const profile = { username: 'wouldbymarty', name: null, biography: null };
    expect(normalizeFeed({ profile })).toEqual({ ...EMPTY_FEED, profile });
  });
});

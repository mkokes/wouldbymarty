import { describe, expect, it } from 'vitest';
import { excerpt } from './InstagramGrid';

describe('excerpt', () => {
  it('returns an empty string for a missing caption', () => {
    expect(excerpt(null)).toBe('');
  });

  it('keeps only the first line', () => {
    expect(excerpt('First line\nSecond line')).toBe('First line');
  });

  it('truncates long captions with an ellipsis', () => {
    const result = excerpt('a'.repeat(200));
    expect(result).toHaveLength(121);
    expect(result.endsWith('…')).toBe(true);
  });
});

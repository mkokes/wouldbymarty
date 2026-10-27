import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { EMPTY_FEED, type InstagramFeed } from './lib/instagram';
import { FALLBACK_BIO, INSTAGRAM_URL } from './lib/site';

const feed: InstagramFeed = {
  fetchedAt: '2026-10-26T00:00:00Z',
  profile: { username: 'wouldbymarty', name: null, biography: 'Bio from Instagram' },
  posts: [
    {
      id: '1',
      caption: 'Walnut cutting board\nwith a second line',
      mediaType: 'CAROUSEL_ALBUM',
      image: '/instagram/1.jpg',
      permalink: 'https://www.instagram.com/p/one/',
      timestamp: '2026-10-01T00:00:00Z',
    },
  ],
};

describe('App', () => {
  it('shows the fallback bio and no grid when the feed is empty', () => {
    render(<App feed={EMPTY_FEED} />);

    expect(screen.getByText(FALLBACK_BIO)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Latest from the shop' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Follow @wouldbymarty/ })).toHaveAttribute('href', INSTAGRAM_URL);
  });

  it('renders the Instagram bio and posts', () => {
    render(<App feed={feed} />);

    expect(screen.getByText('Bio from Instagram')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Latest from the shop' })).toBeInTheDocument();

    const image = screen.getByRole('img', { name: 'Walnut cutting board' });
    expect(image).toHaveAttribute('src', '/instagram/1.jpg');
    expect(image.closest('a')).toHaveAttribute('href', 'https://www.instagram.com/p/one/');
    expect(screen.getByLabelText('Multiple photos')).toBeInTheDocument();
  });
});

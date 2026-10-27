import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { EMPTY_FEED } from './lib/instagram';
import { ABOUT_HEADING, FALLBACK_BIO, INSTAGRAM_URL } from './lib/site';
import { feed } from './test/fixtures';

describe('App', () => {
  it('shows the fallback bio, plain hero and About section when the feed is empty', () => {
    const { container } = render(<App feed={EMPTY_FEED} />);

    expect(screen.getByText(FALLBACK_BIO)).toBeInTheDocument();
    expect(container.querySelector('.hero--plain')).toBeInTheDocument();
    expect(container.querySelector('video')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Latest from the shop' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Work' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: ABOUT_HEADING })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Follow @wouldbymarty/ })).toHaveAttribute('href', INSTAGRAM_URL);
  });

  it('features the latest post and leaves the hero out of the grid', () => {
    render(<App feed={feed} />);

    expect(screen.getByText('Bio from Instagram')).toBeInTheDocument();
    const featured = screen.getByRole('article');
    // First caption line becomes the headline; the rest is body text without the trailing hashtags.
    expect(within(featured).getByRole('heading', { name: 'Walnut cutting board' })).toBeInTheDocument();
    expect(featured.querySelector('.featured__caption')).toHaveTextContent(/^Oiled and ready$/);
    expect(within(featured).getByText('October 2026')).toBeInTheDocument();

    const grid = screen.getByRole('list');
    const tiles = within(grid).getAllByRole('link');
    expect(tiles).toHaveLength(1);
    expect(tiles[0]).toHaveAttribute('href', 'https://www.instagram.com/p/older/');
    expect(within(grid).getByRole('img', { name: 'Laptop stand with some storage' })).toBeInTheDocument();
    expect(within(grid).getByLabelText('Video')).toBeInTheDocument();
  });

  it('autoplays the hero video and lets visitors pause it', async () => {
    const { container } = render(<App feed={feed} />);
    const video = container.querySelector('video')!;

    expect(video).toHaveAttribute('src', '/instagram/hero.mp4');
    expect(video.muted).toBe(true);
    const pause = await screen.findByRole('button', { name: 'Pause background video' });

    await userEvent.click(pause);
    expect(screen.getByRole('button', { name: 'Play background video' })).toBeInTheDocument();
  });

  it('switches and remembers the color theme', async () => {
    render(<App feed={EMPTY_FEED} />);
    const toggle = screen.getByRole('group', { name: 'Color theme' });
    expect(within(toggle).getByRole('button', { name: 'Match system theme' })).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(within(toggle).getByRole('button', { name: 'Dark theme' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('wbm-theme')).toBe('dark');
    expect(within(toggle).getByRole('button', { name: 'Dark theme' })).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(within(toggle).getByRole('button', { name: 'Match system theme' }));
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem('wbm-theme')).toBeNull();
  });
});

describe('FeaturedPost fallback', () => {
  it('shows a headline and prompt when the post has no caption', () => {
    render(<App feed={{ ...feed, posts: [{ ...feed.posts[0], caption: null }] }} />);
    const featured = screen.getByRole('article');

    expect(within(featured).getByRole('heading', { name: 'New in the shop' })).toBeInTheDocument();
    expect(within(featured).getByText(/Swipe through all the photos/)).toBeInTheDocument();
  });
});

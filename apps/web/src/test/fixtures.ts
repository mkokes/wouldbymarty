import type { InstagramFeed, InstagramPost, ResponsiveImage } from '../lib/instagram';

export function image(name: string): ResponsiveImage {
  return {
    src: `/instagram/${name}-960.webp`,
    srcSet: `/instagram/${name}-480.webp 480w, /instagram/${name}-960.webp 960w`,
    width: 960,
    height: 960,
    placeholder: 'data:image/webp;base64,AAAA',
  };
}

export function post(id: string, overrides: Partial<InstagramPost> = {}): InstagramPost {
  return {
    id,
    caption: `Post ${id}`,
    mediaType: 'IMAGE',
    image: image(id),
    permalink: `https://www.instagram.com/p/${id}/`,
    timestamp: '2026-10-01T12:00:00+0000',
    ...overrides,
  };
}

export const feed: InstagramFeed = {
  fetchedAt: '2026-10-26T00:00:00Z',
  profile: { username: 'wouldbymarty', name: null, biography: 'Bio from Instagram', avatar: image('avatar') },
  hero: {
    id: 'hero',
    caption: 'A water bottle made from wooden wedges #woodworking',
    permalink: 'https://www.instagram.com/reel/hero/',
    poster: image('hero'),
    video: '/instagram/hero.mp4',
  },
  posts: [
    post('latest', {
      caption: 'Walnut cutting board\nOiled and ready #woodworking #walnut',
      mediaType: 'CAROUSEL_ALBUM',
    }),
    post('hero', { mediaType: 'VIDEO' }),
    post('older', { mediaType: 'VIDEO', caption: 'Laptop stand with some storage #woodworking' }),
  ],
};

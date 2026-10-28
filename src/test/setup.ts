import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom doesn't implement media playback or matchMedia.
const playing = new WeakSet<HTMLMediaElement>();
Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
  configurable: true,
  get(this: HTMLMediaElement) {
    return !playing.has(this);
  },
});
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: function (this: HTMLMediaElement) {
    playing.add(this);
    this.dispatchEvent(new Event('play'));
    return Promise.resolve();
  },
});
Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  value: function (this: HTMLMediaElement) {
    playing.delete(this);
    this.dispatchEvent(new Event('pause'));
  },
});
Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }),
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

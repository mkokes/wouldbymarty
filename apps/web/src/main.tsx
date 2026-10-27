import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { getInstagramFeed } from './lib/instagram';
import './styles.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App feed={getInstagramFeed()} />
  </StrictMode>
);

// Production builds are pre-rendered (scripts/prerender.mjs); the dev server serves an empty root.
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

// Skip in dev so the service worker cache doesn't mask code changes.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((error) => {
    console.error('Service worker registration failed', error);
  });
}

import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { getInstagramFeed } from './lib/instagram';

// Used by scripts/prerender.mjs to bake the page into dist/index.html at build time.
export function render() {
  return renderToString(
    <StrictMode>
      <App feed={getInstagramFeed()} />
    </StrictMode>,
  );
}

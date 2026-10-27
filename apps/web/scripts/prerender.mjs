// Pre-renders the app into dist/index.html after the client build, so the page's
// content is in the HTML for search engines, link previews and first paint.
// The client then hydrates it (see src/main.tsx).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const PLACEHOLDER = '<!--app-html-->';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ssrOutDir = path.join(webRoot, 'dist-ssr');
const indexFile = path.join(webRoot, 'dist/index.html');

await build({
  root: webRoot,
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: ssrOutDir,
    emptyOutDir: true,
    copyPublicDir: false,
  },
});

try {
  const { render } = await import(pathToFileURL(path.join(ssrOutDir, 'entry-server.js')).href);
  const template = await fs.readFile(indexFile, 'utf8');
  if (!template.includes(PLACEHOLDER)) {
    throw new Error(`${PLACEHOLDER} not found in dist/index.html`);
  }
  await fs.writeFile(indexFile, template.replace(PLACEHOLDER, render()));
  console.log('[prerender] wrote dist/index.html');
} finally {
  await fs.rm(ssrOutDir, { recursive: true, force: true });
}

import { act, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { render } from './entry-server';
import { INSTAGRAM_URL } from './lib/site';
import { feed } from './test/fixtures';

describe('render', () => {
  it('renders the page to static HTML', () => {
    const html = render();

    expect(html).toContain('<span class="wordmark__title">Would?</span>');
    expect(html).toContain(`href="${INSTAGRAM_URL}"`);
  });

  it('hydrates the pre-rendered HTML without mismatches, even with a saved theme', async () => {
    const app = (
      <StrictMode>
        <App feed={feed} />
      </StrictMode>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(app);
    document.body.appendChild(container);
    localStorage.setItem('wbm-theme', 'dark');
    const onRecoverableError = vi.fn<(error: unknown) => void>();

    const root = await act(async () => hydrateRoot(container, app, { onRecoverableError }));

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.querySelector('[aria-label="Dark theme"]')).toHaveAttribute('aria-pressed', 'true');
    act(() => root.unmount());
    container.remove();
  });
});

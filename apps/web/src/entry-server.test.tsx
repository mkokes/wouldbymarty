import { act, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { render } from './entry-server';
import { getInstagramFeed } from './lib/instagram';
import { INSTAGRAM_URL } from './lib/site';

describe('render', () => {
  it('renders the page to static HTML', () => {
    const html = render();

    expect(html).toContain('<span class="wordmark__title">Would?</span>');
    expect(html).toContain(`href="${INSTAGRAM_URL}"`);
  });

  it('hydrates the pre-rendered HTML without mismatches', async () => {
    const container = document.createElement('div');
    container.innerHTML = render();
    document.body.appendChild(container);
    const onRecoverableError = vi.fn<(error: unknown) => void>();

    const root = await act(async () =>
      hydrateRoot(
        container,
        <StrictMode>
          <App feed={getInstagramFeed()} />
        </StrictMode>,
        { onRecoverableError },
      ),
    );

    expect(onRecoverableError).not.toHaveBeenCalled();
    act(() => root.unmount());
    container.remove();
  });
});

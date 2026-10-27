import { InstagramGrid } from './components/InstagramGrid';
import type { InstagramFeed } from './lib/instagram';
import { FALLBACK_BIO, INSTAGRAM_HANDLE, INSTAGRAM_URL, SITE_TAGLINE } from './lib/site';

const YEAR = new Date().getFullYear();

export function App({ feed }: { feed: InstagramFeed }) {
  const { profile, posts } = feed;

  return (
    <>
      <header className="site-header">
        <a href="/" className="wordmark" aria-label="Would? By Marty home">
          <span className="wordmark__title">Would?</span>
          <span className="wordmark__byline">By Marty</span>
        </a>
        <a className="site-header__link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          @{INSTAGRAM_HANDLE}
        </a>
      </header>

      <main>
        <div className="container">
          <section className="hero">
            <p className="hero__tagline">{SITE_TAGLINE}</p>
            <p className="hero__bio">{profile?.biography || FALLBACK_BIO}</p>
            <a className="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Follow @{INSTAGRAM_HANDLE} on Instagram
            </a>
          </section>

          {posts.length > 0 && (
            <section className="feed" aria-labelledby="feed-heading">
              <h2 id="feed-heading" className="feed__heading">
                Latest from the shop
              </h2>
              <InstagramGrid posts={posts} />
              <div className="feed__more">
                <a className="btn btn-secondary" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  See more on Instagram
                </a>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="site-footer">
        <span suppressHydrationWarning>© {YEAR} Would? By Marty</span>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </footer>
    </>
  );
}

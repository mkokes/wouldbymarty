import { useEffect } from 'react';
import { About } from './components/About';
import { FeaturedPost } from './components/FeaturedPost';
import { Hero } from './components/Hero';
import { InstagramGrid } from './components/InstagramGrid';
import { ThemeToggle } from './components/ThemeToggle';
import { arrangePosts, type InstagramFeed } from './lib/instagram';
import { initReveal } from './lib/reveal';
import { FALLBACK_BIO, INSTAGRAM_HANDLE, INSTAGRAM_URL } from './lib/site';

const YEAR = new Date().getFullYear();

export function App({ feed }: { feed: InstagramFeed }) {
  const { profile, hero } = feed;
  const { featured, grid } = arrangePosts(feed);

  // After hydration, so the classes it adds don't count as hydration mismatches.
  useEffect(() => {
    initReveal();
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="site-nav" aria-label="Main">
          {featured && <a href="#work">Work</a>}
          <a href="#about">About</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </nav>
        <ThemeToggle />
      </header>

      <main>
        <Hero hero={hero} bio={profile?.biography || FALLBACK_BIO} />

        {featured && (
          <section id="work" className="work container" aria-labelledby="work-heading">
            <h2 id="work-heading" className="section-heading" data-reveal>
              Latest from the shop
            </h2>
            <FeaturedPost post={featured} />
            {grid.length > 0 && (
              <>
                <h3 className="subsection-heading" data-reveal>
                  More from the bench
                </h3>
                <InstagramGrid posts={grid} />
              </>
            )}
            <div className="work__more" data-reveal>
              <a className="btn btn-secondary" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                See everything on Instagram
              </a>
            </div>
          </section>
        )}

        <div className="container">
          <About />
        </div>
      </main>

      <footer className="site-footer">
        <span className="site-footer__mark">Would?</span>
        <span suppressHydrationWarning>
          © {YEAR} Would? By Marty · @{INSTAGRAM_HANDLE}
        </span>
      </footer>
    </>
  );
}

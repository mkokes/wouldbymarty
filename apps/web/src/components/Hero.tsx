import { useEffect, useRef, useState } from 'react';
import { excerpt, type InstagramHero } from '../lib/instagram';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, SITE_TAGLINE } from '../lib/site';
import { Picture } from './Picture';

function shouldAutoplay() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !reducedMotion && !saveData;
}

export function Hero({ hero, bio }: { hero: InstagramHero | null; bio: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Autoplay is decided on the client so reduced-motion and data-saver visitors only get the still.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldAutoplay()) return;
    video.play().catch(() => {
      // Autoplay can still be blocked (e.g. low-power mode); the poster stays.
    });
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const featuredText = excerpt(hero?.caption ?? null, 80);

  return (
    <section className={`hero ${hero ? '' : 'hero--plain'}`}>
      {hero && (
        <div className="hero__media" aria-hidden="true">
          <Picture image={hero.poster} alt="" sizes="100vw" className="hero__poster" eager />
          {hero.video && (
            <video
              ref={videoRef}
              className={`hero__video ${playing ? 'is-playing' : ''}`}
              src={hero.video}
              poster={hero.poster.src}
              muted
              loop
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          )}
        </div>
      )}
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__content">
        <h1 className="wordmark wordmark--hero">
          <span className="wordmark__title">Would?</span>
          <span className="wordmark__byline">By Marty</span>
        </h1>
        <p className="hero__tagline">{SITE_TAGLINE}</p>
        <p className="hero__bio">{bio}</p>
        <div className="hero__actions">
          <a className="btn btn-primary" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Follow @{INSTAGRAM_HANDLE}
          </a>
          <a className="btn btn-ghost" href="#work">
            See the work
          </a>
        </div>
      </div>

      {hero && (
        <div className="hero__footer">
          {featuredText ? (
            <a className="hero__credit" href={hero.permalink} target="_blank" rel="noopener noreferrer">
              Featured: {featuredText}
            </a>
          ) : (
            <span />
          )}
          {hero.video && (
            <button
              type="button"
              className="hero__playback"
              onClick={togglePlayback}
              aria-label={playing ? 'Pause background video' : 'Play background video'}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

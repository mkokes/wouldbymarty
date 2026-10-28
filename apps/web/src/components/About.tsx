import { ABOUT_HEADING, ABOUT_PARAGRAPHS, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site';

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-heading" data-reveal>
      <span className="about__photo">
        <img
          src="/images/marty-260.webp"
          srcSet="/images/marty-260.webp 260w, /images/marty-520.webp 520w"
          sizes="(max-width: 800px) 240px, 260px"
          alt="Marty in a navy cap and dark-rimmed glasses"
          width={520}
          height={693}
          loading="lazy"
          decoding="async"
        />
      </span>
      <div className="about__body">
        <h2 id="about-heading" className="section-heading">
          {ABOUT_HEADING}
        </h2>
        {ABOUT_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <a className="text-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Say hi on Instagram @{INSTAGRAM_HANDLE} <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

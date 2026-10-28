import { ABOUT_HEADING, ABOUT_PARAGRAPHS, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site';

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-heading" data-reveal>
      <img
        className="about__photo"
        src="/images/marty.jpg"
        alt="Marty in a navy cap and dark-rimmed glasses"
        width={843}
        height={1124}
        loading="lazy"
        decoding="async"
      />
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

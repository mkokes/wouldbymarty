import type { InstagramProfile } from '../lib/instagram';
import { ABOUT_HEADING, ABOUT_PARAGRAPHS, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site';
import { Picture } from './Picture';

export function About({ profile }: { profile: InstagramProfile | null }) {
  return (
    <section id="about" className="about" aria-labelledby="about-heading" data-reveal>
      {profile?.avatar && <Picture image={profile.avatar} alt="Marty" sizes="160px" className="about__avatar" />}
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

import { cleanCaption, excerpt, formatPostDate, type InstagramPost } from '../lib/instagram';
import { Picture } from './Picture';

const FALLBACK_TITLE = 'New in the shop';
const FALLBACK_TEXT: Record<InstagramPost['mediaType'], string> = {
  IMAGE: 'The latest build from the bench. See the full post on Instagram.',
  CAROUSEL_ALBUM: 'The latest build from the bench. Swipe through all the photos on Instagram.',
  VIDEO: 'The latest build from the bench. Watch the full video on Instagram.',
};

export function FeaturedPost({ post }: { post: InstagramPost }) {
  const [firstLine = '', ...rest] = cleanCaption(post.caption).split('\n');
  const title = firstLine.trim() || FALLBACK_TITLE;
  const text = rest.join('\n').trim() || (firstLine ? '' : FALLBACK_TEXT[post.mediaType]);
  const date = formatPostDate(post.timestamp);

  return (
    <article className="featured" data-reveal>
      <a className="featured__media" href={post.permalink} target="_blank" rel="noopener noreferrer">
        <Picture
          image={post.image}
          alt={excerpt(post.caption) || 'Latest Instagram post from @wouldbymarty'}
          sizes="(max-width: 800px) 100vw, 560px"
        />
      </a>
      <div className="featured__body">
        <p className="eyebrow">
          Fresh off the bench
          {date && (
            <>
              {' · '}
              <time dateTime={post.timestamp}>{date}</time>
            </>
          )}
        </p>
        <h3 className="featured__title">{title}</h3>
        {text && <p className="featured__caption">{text}</p>}
        <a className="btn btn-primary" href={post.permalink} target="_blank" rel="noopener noreferrer">
          View on Instagram
        </a>
      </div>
    </article>
  );
}

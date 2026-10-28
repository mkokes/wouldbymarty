import { excerpt, type InstagramPost } from '../lib/instagram';
import { Picture } from './Picture';

function MediaBadge({ type }: { type: InstagramPost['mediaType'] }) {
  if (type === 'IMAGE') return null;
  return (
    <span className="ig-tile__badge" aria-label={type === 'VIDEO' ? 'Video' : 'Multiple photos'}>
      {type === 'VIDEO' ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M4 8h12v12H4zM8 4h12v12h-2V6H8z" />
        </svg>
      )}
    </span>
  );
}

export function InstagramGrid({ posts }: { posts: InstagramPost[] }) {
  return (
    <ul className="ig-grid">
      {posts.map((post) => {
        const text = excerpt(post.caption);
        return (
          <li key={post.id} data-reveal>
            <a className="ig-tile" href={post.permalink} target="_blank" rel="noopener noreferrer">
              <Picture
                image={post.image}
                alt={text || 'Instagram post from @wouldbymarty'}
                sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 360px"
              />
              <MediaBadge type={post.mediaType} />
              {text && <span className="ig-tile__caption">{text}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

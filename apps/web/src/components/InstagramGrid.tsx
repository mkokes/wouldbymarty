import type { InstagramPost } from '../lib/instagram';

const CAPTION_LENGTH = 120;

export function excerpt(caption: string | null) {
  if (!caption) return '';
  const firstLine = caption.split('\n')[0];
  return firstLine.length > CAPTION_LENGTH ? `${firstLine.slice(0, CAPTION_LENGTH).trimEnd()}…` : firstLine;
}

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
      {posts.map((post, index) => {
        const text = excerpt(post.caption);
        return (
          <li key={post.id}>
            <a className="ig-tile" href={post.permalink} target="_blank" rel="noopener noreferrer">
              <img
                src={post.image}
                alt={text || 'Instagram post from @wouldbymarty'}
                loading={index < 3 ? 'eager' : 'lazy'}
                decoding="async"
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

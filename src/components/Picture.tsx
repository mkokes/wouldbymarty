import { useEffect, useRef, useState } from 'react';
import type { ResponsiveImage } from '../lib/instagram';

interface PictureProps {
  image: ResponsiveImage;
  alt: string;
  sizes: string;
  className?: string;
  eager?: boolean;
}

/** Responsive <img> that fades in over a blurred placeholder. */
export function Picture({ image, alt, sizes, className = '', eager = false }: PictureProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // The image may finish loading before hydration attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <span
      className={`picture ${loaded ? 'is-loaded' : ''} ${className}`}
      style={
        image.placeholder ? ({ '--placeholder': `url("${image.placeholder}")` } as React.CSSProperties) : undefined
      }
    >
      <img
        ref={ref}
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </span>
  );
}

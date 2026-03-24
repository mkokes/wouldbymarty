'use client';

import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div style={{ 
        aspectRatio: '1',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '8rem',
        opacity: 0.3,
      }}>
        🪵
      </div>
    );
  }

  return (
    <>
      <div style={{ 
        aspectRatio: '1',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '1rem',
      }}>
        <img 
          src={images[selectedImage]} 
          alt={`${name} ${selectedImage + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: `2px solid ${selectedImage === idx ? 'var(--color-accent)' : 'var(--color-border)'}`,
                padding: 0,
                cursor: 'pointer',
                backgroundColor: 'transparent',
              }}
            >
              <img 
                src={img} 
                alt={`${name} ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

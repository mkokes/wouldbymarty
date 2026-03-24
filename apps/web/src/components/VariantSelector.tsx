'use client';

export type WoodType = 'Walnut' | 'Oak' | 'Maple' | 'Cherry' | 'Ash';
export type Finish = 'Matte' | 'Glossy' | 'Natural Oil' | 'Lacquer';

interface VariantSelectorProps {
  woodType?: string;
  finish?: string;
}

export function VariantSelector({ woodType, finish }: VariantSelectorProps) {
  if (!woodType && !finish) return null;

  return (
    <div style={{ 
      display: 'flex', 
      gap: '1rem', 
      flexWrap: 'wrap',
      marginBottom: '2rem',
    }}>
      {woodType && (
        <div className="card" style={{ padding: '0.75rem 1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Wood Type</span>
          <div style={{ fontWeight: '500' }}>{woodType}</div>
        </div>
      )}
      {finish && (
        <div className="card" style={{ padding: '0.75rem 1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Finish</span>
          <div style={{ fontWeight: '500' }}>{finish}</div>
        </div>
      )}
    </div>
  );
}

export function InventoryStatus({ inventory }: { inventory: number }) {
  const inStock = inventory > 0;
  
  return (
    <div style={{ 
      fontSize: '0.875rem',
      color: inStock ? 'var(--color-text-secondary)' : '#AE2012',
    }}>
      {inStock 
        ? `${inventory} available in stock`
        : 'Out of stock'
      }
    </div>
  );
}

export function DimensionsDisplay({ dimensions }: { dimensions?: string }) {
  if (!dimensions) return null;

  return (
    <div className="card" style={{ padding: '0.75rem 1rem' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Dimensions</span>
      <div style={{ fontWeight: '500' }}>{dimensions}</div>
    </div>
  );
}

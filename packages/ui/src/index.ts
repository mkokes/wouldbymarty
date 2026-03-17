export function Button({ children, onClick, variant = 'primary', ...props }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  [key: string]: any;
}) {
  const baseStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
    fontSize: '1rem',
    transition: 'transform 0.1s',
  };

  const variants = {
    primary: { background: '#333', color: '#fff' },
    secondary: { background: '#e0e0e0', color: '#333' },
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant] }}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Input({ label, ...props }: { label?: string; [key: string]: any }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          fontSize: '1rem',
        }}
        {...props}
      />
    </div>
  );
}

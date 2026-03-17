'use client';

import { useEffect, useState, Suspense } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function startMSW() {
      if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
        setReady(true);
      } else {
        setReady(true);
      }
    }
    startMSW();
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

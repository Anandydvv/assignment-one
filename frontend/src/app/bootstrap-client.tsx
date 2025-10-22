'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  // Load Bootstrap JS only in the browser to avoid SSR "document" errors
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js').catch(() => {
      // no-op: avoid breaking if import fails during hydration
    });
  }, []);
  return null;
}

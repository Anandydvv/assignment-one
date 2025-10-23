// Frontend Next.js (App Router) instrumentation
// Runs at start-up on the server (and edge if applicable)
// Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  try {
    // Only patch on Node.js runtime
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      const origFetch = globalThis.fetch;
      globalThis.fetch = (async (input: any, init?: any) => {
        const start = Date.now();
        const method = (init?.method || 'GET').toUpperCase();
        const url = typeof input === 'string' ? input : input?.url || 'unknown';
        try {
          const res = await origFetch(input, init);
          const dur = Date.now() - start;
          // Lightweight log for observability; swap to your logger/OTEL here
          // Avoid logging large bodies or credentials
          console.info(`[instr/server] fetch ${method} ${url} -> ${res.status} in ${dur}ms`);
          return res;
        } catch (err) {
          const dur = Date.now() - start;
          console.error(`[instr/server] fetch ${method} ${url} failed in ${dur}ms`, err);
          throw err;
        }
      }) as typeof fetch;

      // Basic process-level guards
      process.on('uncaughtException', (e) => {
        console.error('[instr/server] uncaughtException', e);
      });
      process.on('unhandledRejection', (e) => {
        console.error('[instr/server] unhandledRejection', e);
      });

      console.log('[instr/server] instrumentation registered');
    }
  } catch (e) {
    console.error('[instr] register() failed', e);
  }
}


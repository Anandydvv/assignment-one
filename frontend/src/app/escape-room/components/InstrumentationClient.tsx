"use client";
import { useEffect } from "react";

function safeObserve(type: string, cb: PerformanceObserverCallback) {
  try {
    const po = new PerformanceObserver(cb);
    // @ts-expect-error: type/buffered supported in modern browsers
    po.observe({ type, buffered: true });
    return po;
  } catch {
    return null;
  }
}

export default function InstrumentationClient() {
  useEffect(() => {
    console.log("[instr/client] escape-room InstrumentationClient loaded");

    // TTFB from Navigation Timing (first document)
    try {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav) console.log(`[metrics/client] TTFB ${nav.responseStart.toFixed(1)} ms`);
    } catch {}

    // LCP
    let lcp = 0;
    const lcpObs = safeObserve("largest-contentful-paint", (list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as any;
      const value = last?.renderTime || last?.loadTime || last?.startTime || 0;
      lcp = value;
      console.log(`[metrics/client] LCP ${lcp.toFixed(1)} ms`);
    });

    // CLS
    let cls = 0;
    const clsObs = safeObserve("layout-shift", (list) => {
      for (const entry of list.getEntries() as any) {
        if (!entry.hadRecentInput) cls += entry.value;
      }
      console.log(`[metrics/client] CLS ${cls.toFixed(4)}`);
    });

    // Patch fetch to log timings originating from escape-room pages
    try {
      const orig = window.fetch;
      window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const start = performance.now();
        const method = (init?.method || "GET").toUpperCase();
        const url = typeof input === "string" ? input : (input as Request).url;
        try {
          const res = await orig(input as any, init);
          const dur = performance.now() - start;
          console.info(`[instr/client][escape-room] fetch ${method} ${url} -> ${res.status} in ${dur.toFixed(1)}ms`);
          return res;
        } catch (err) {
          const dur = performance.now() - start;
          console.error(`[instr/client][escape-room] fetch ${method} ${url} failed in ${dur.toFixed(1)}ms`, err);
          throw err;
        }
      };
    } catch {}

    // Cleanup
    return () => {
      try { lcpObs?.disconnect(); } catch {}
      try { clsObs?.disconnect(); } catch {}
    };
  }, []);

  return null;
}

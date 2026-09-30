"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Reports Core Web Vitals (LCP, INP, CLS, FCP, TTFB) to our own /api/web-vitals
 * route via sendBeacon — no third-party script, no cookies, no PII. Disabled
 * entirely unless NEXT_PUBLIC_ENABLE_WEB_VITALS is set, so a fork of this repo
 * doesn't report metrics anywhere by default.
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS !== "true") return;

    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      navigationType: metric.navigationType,
      path: window.location.pathname,
    });

    const url = "/api/web-vitals";
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: "POST", keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  });

  return null;
}

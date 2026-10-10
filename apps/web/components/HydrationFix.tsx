"use client";

import { useEffect } from 'react';

/**
 * This component runs on the client only and removes any attributes
 * injected by browser extensions (e.g. `bis_skin_checked`) that would
 * cause a hydration mismatch between the server‑rendered markup and the
 * client DOM.
 */
export default function HydrationFix() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document
        .querySelectorAll('[bis_skin_checked]')
        .forEach((el) => el.removeAttribute('bis_skin_checked'));
    }
  }, []);

  // This component renders nothing – it only runs the effect.
  return null;
}

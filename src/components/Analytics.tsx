"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/**
 * Fires a GA4 `page_view` event whenever the App Router pathname changes.
 * Next.js does not auto-fire page_view on client-side navigation; this
 * component closes that gap so analytics matches actual user flow.
 */
export function AnalyticsPageView() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") return;
    track("page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);
  return null;
}

/**
 * Declarative GA4 event for use inside server components.
 * Renders nothing; fires the event once on mount.
 */
export function TrackEvent({
  name,
  params,
}: {
  name: string;
  params?: Record<string, any>;
}) {
  useEffect(() => {
    track(name, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);
  return null;
}

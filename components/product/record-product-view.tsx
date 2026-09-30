"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/context/recently-viewed-context";

export function RecordProductView({ slug }: { slug: string }) {
  const { record } = useRecentlyViewed();

  useEffect(() => {
    record(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return null;
}

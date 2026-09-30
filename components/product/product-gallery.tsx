"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-parchment-200 dark:bg-ink-100">
        <Image
          src={active.url}
          alt={active.alt}
          fill
          sizes="(min-width: 1024px) 44vw, 92vw"
          priority
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div
          role="tablist"
          aria-label={`${productName} images`}
          className="mt-3 grid grid-cols-4 gap-3"
        >
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm bg-parchment-200 ring-1 ring-transparent transition-all dark:bg-ink-100",
                i === activeIndex && "ring-2 ring-brass-400"
              )}
            >
              <Image src={image.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

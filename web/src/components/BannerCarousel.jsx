import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@convex/_generated/api";
import { cn } from "../lib/utils";

const INTERVAL_MS = 5000;

/** Auto-rotating banner carousel driven by the admin's visible web banners. Renders nothing when there are none. */
export default function BannerCarousel({ className }) {
  const banners = useQuery(api.banners.listActive, { platform: "web" });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners?.length ?? 0;

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

  // A banner hidden/deleted by the admin can shrink the list under the current index.
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  if (!count) return null;

  const go = (next) => setIndex((next + count) % count);

  return (
    <section
      className={cn("relative max-w-5xl mx-auto mb-4 md:mb-6 overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-card shadow-sm", className)}
      aria-roledescription="carousel"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((b, i) => {
          const slide = (
            <div className="relative aspect-[16/6] w-full bg-muted">
              {b.imageUrl && (
                <img src={b.imageUrl} alt={b.title} className="absolute inset-0 h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
              )}
              {(b.title || b.subtitle) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 text-white">
                  <p className="text-sm sm:text-lg font-black leading-tight">{b.title}</p>
                  {b.subtitle && <p className="text-[11px] sm:text-sm opacity-90 mt-0.5">{b.subtitle}</p>}
                </div>
              )}
            </div>
          );
          return (
            <div
              key={b._id}
              className="w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
            >
              {b.linkUrl ? (
                <a href={b.linkUrl} target="_blank" rel="noopener noreferrer" tabIndex={i === index ? 0 : -1}>{slide}</a>
              ) : slide}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous banner"
            className="absolute left-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next banner"
            className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 right-3 flex gap-1.5">
            {banners.map((b, i) => (
              <button key={b._id} type="button" onClick={() => go(i)} aria-label={`Show banner ${i + 1}`} aria-current={i === index}
                className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-white" : "w-1.5 bg-white/50")} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

"use client";
import { useEffect, useState } from "react";
import { cx } from "@/lib/href";

/**
 * A still that comes alive: the poster shows at once, and on larger screens
 * a silent loop fades in over it once it can play. Phones, data-saver mode
 * and reduced-motion visitors keep the still.
 */
export function LoopVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setOn(window.matchMedia("(min-width: 768px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !saver);
  }, []);
  return (
    <span className="relative block size-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" fetchPriority="high" className={className} />
      {on && (
        <video
          src={src} autoPlay muted loop playsInline preload="auto" onCanPlay={() => setReady(true)}
          className={cx(className, "absolute inset-0 transition-opacity duration-[1200ms]")} style={ready ? undefined : { opacity: 0 }}
        />
      )}
    </span>
  );
}

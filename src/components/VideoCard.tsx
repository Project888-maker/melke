"use client";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Icon } from "./Icon";

/** Poster that swaps to the real video when the visitor presses play. */
export function VideoCard({ poster, src, label, caption }: { poster: string; src: string; label: string; caption: string }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-navy shadow-card">
        {playing && !failed ? (
          <video ref={ref} src={src} controls autoPlay playsInline poster={poster} onError={() => setFailed(true)} className="size-full bg-black object-contain" />
        ) : (
          <button type="button" onClick={() => { setFailed(false); setPlaying(true); }} aria-label={label} className="group absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt="" loading="lazy" className="size-full object-cover transition-transform duration-[1200ms] ease-out-soft group-hover:scale-105" />
            <span className="absolute inset-0 bg-navy/25 transition-colors group-hover:bg-navy/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span aria-hidden className="absolute inset-0 rounded-full bg-cyan animate-pulse-ring" />
              <motion.span whileHover={{ scale: 1.08 }} className="relative grid size-20 place-items-center rounded-full border-2 border-cyan bg-navy/60 text-cyan backdrop-blur sm:size-24">
                <Icon name="play" className="ml-1 size-9" strokeWidth={2} />
              </motion.span>
            </span>
            {failed && <span className="absolute inset-x-0 bottom-4 text-center text-sm text-white/80">Видео временно недоступно</span>}
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

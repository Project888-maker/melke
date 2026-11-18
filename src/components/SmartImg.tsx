"use client";
import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/href";

/** Image that fades in when loaded and shows a neutral placeholder if it fails. */
export function SmartImg({
  src, alt, className, imgClassName, label, eager = false, fit = "cover",
}: { src?: string; alt: string; className?: string; imgClassName?: string; label?: string; eager?: boolean; fit?: "cover" | "contain" }) {
  const [state, setState] = useState<"loading" | "ok" | "error">(src ? "loading" : "error");
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el?.complete) setState(el.naturalWidth > 0 ? "ok" : "error");
  }, [src]);
  return (
    <span className={cx("relative block overflow-hidden bg-[#e4ebf1]", className)}>
      {state !== "ok" && (
        <span className="absolute inset-0 grid place-items-center text-[#93a3b3]">
          <span className="flex flex-col items-center gap-2 text-xs">
            <svg viewBox="0 0 48 40" className="h-9 w-11" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
              <rect x="3" y="3" width="42" height="34" rx="5" />
              <circle cx="33" cy="14" r="4" fill="currentColor" stroke="none" />
              <path d="M6 32l12-13 9 9 6-5 9 9" strokeLinejoin="round" />
            </svg>
            {label}
          </span>
        </span>
      )}
      {src && state !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setState("ok")}
          onError={() => setState("error")}
          className={cx(
            "absolute inset-0 size-full transition-[opacity,transform,filter] duration-700 ease-out-soft",
            fit === "cover" ? "object-cover" : "object-contain",
            state === "ok" ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105",
            imgClassName,
          )}
        />
      )}
    </span>
  );
}

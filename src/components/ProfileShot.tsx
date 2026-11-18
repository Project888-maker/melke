import { cx } from "@/lib/href";

/**
 * A profile cutout on the site's own backdrop. The cutouts are cropped flat on
 * the top, right and bottom, so the picture is sized to run past those edges
 * and only the free-standing cross-section floats inside the frame.
 */
export function ProfileShot({
  src, alt, zoom = "h-[124%]", className, priority = false,
}: { src: string; alt: string; zoom?: string; className?: string; priority?: boolean }) {
  return (
    <span className={cx("absolute inset-0 overflow-hidden bg-linear-to-br from-white via-[#eef5f9] to-[#cfe3ee]", className)}>
      <span aria-hidden className="absolute -left-[12%] top-1/2 size-[72%] -translate-y-1/2 rounded-full bg-cyan/30 blur-3xl" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#b9d3e0]/50 to-transparent" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src} alt={alt} loading={priority ? undefined : "lazy"} fetchPriority={priority ? "high" : undefined}
        className={cx("absolute right-0 top-1/2 w-auto max-w-none origin-right -translate-y-1/2 drop-shadow-[-22px_26px_30px_rgba(13,27,39,0.28)] transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.06]", zoom)}
      />
    </span>
  );
}

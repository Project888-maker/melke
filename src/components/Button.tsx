import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "./Icon";
import { cx } from "@/lib/href";

export type Variant = "primary" | "outline" | "ghost" | "dark";
export type Size = "md" | "lg" | "sm";

export function btn(variant: Variant = "primary", size: Size = "md", block = false) {
  return cx(
    "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl font-medium whitespace-nowrap select-none",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out-soft active:scale-[0.98]",
    size === "lg" ? "h-14 px-8 text-[15px]" : size === "sm" ? "h-10 px-4 text-sm" : "h-12 px-6 text-[15px]",
    block && "w-full",
    variant === "primary" &&
      "bg-linear-to-r from-[#0fd6f5] to-[#49e6ff] text-ink shadow-[0_10px_28px_-12px_rgb(0_190_225/0.75)] hover:shadow-[0_18px_38px_-12px_rgb(0_190_225/0.85)] hover:-translate-y-0.5",
    variant === "outline" &&
      "border border-cyan/60 bg-white text-ink hover:border-cyan hover:bg-cyan/8 hover:-translate-y-0.5",
    variant === "ghost" && "text-ink hover:bg-ink/5",
    variant === "dark" && "bg-ink text-white hover:bg-navy-2 hover:-translate-y-0.5",
  );
}

export function BtnInner({ children, arrow = true, variant = "primary" }: { children: ReactNode; arrow?: boolean; variant?: Variant }) {
  return (
    <>
      {variant === "primary" && (
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/45 blur-md animate-shine" />
      )}
      <span className="relative">{children}</span>
      {arrow && (
        <Icon name="arrow" className="relative size-[18px] transition-transform duration-300 ease-out-soft group-hover/btn:translate-x-1" />
      )}
    </>
  );
}

export function ButtonLink({
  variant = "primary", size = "md", block, arrow = true, children, className, ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; block?: boolean; arrow?: boolean }) {
  return (
    <Link {...rest} className={cx(btn(variant, size, block), className)}>
      <BtnInner arrow={arrow} variant={variant}>{children}</BtnInner>
    </Link>
  );
}

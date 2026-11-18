"use client";
import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Locale, UI } from "@/lib/i18n";
import type { CaseStudy } from "@/content/types";
import { btn, BtnInner } from "./Button";
import { SmartImg } from "./SmartImg";
import { Icon } from "./Icon";
import { cx, href } from "@/lib/href";

export function CaseCard({ lang, ui, c }: { lang: Locale; ui: UI; c: CaseStudy }) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-line bg-white p-3 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:border-cyan/50 hover:shadow-lift">
      <Link href={href(lang, `proekty/${c.slug}`)} className="relative block" aria-label={c.title}>
        <SmartImg src={c.teaser} alt={c.title} label={ui.photo} className="aspect-[16/10] w-full rounded-2xl" imgClassName="group-hover:scale-[1.06]" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[13px] font-medium backdrop-blur">{c.year}</span>
      </Link>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <h3 className="text-[21px] font-bold leading-tight tracking-tight">{c.title}</h3>
        {c.place && <p className="mt-1 flex items-center gap-1.5 text-[15px] text-muted"><Icon name="pin" className="size-4" />{c.place}</p>}
        <span className="flex-1" />
        <Link href={href(lang, `proekty/${c.slug}`)} className={cx(btn("primary", "md"), "mt-4 self-start")}><BtnInner>{ui.cta.viewCase}</BtnInner></Link>
      </div>
    </article>
  );
}

export function ProjectsGrid({ lang, ui, cases, tags }: { lang: Locale; ui: UI; cases: CaseStudy[]; tags: readonly string[] }) {
  const [tag, setTag] = useState(tags[0]);
  const shown = useMemo(() => (tag === tags[0] ? cases : cases.filter((c) => c.tags.includes(tag))), [tag, cases, tags]);
  return (
    <section className="container-x pb-16">
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <button key={t} type="button" onClick={() => setTag(t)} aria-pressed={tag === t} className={cx("relative h-11 rounded-full border px-5 text-[15px] font-medium transition-colors", tag === t ? "border-transparent" : "border-line bg-white hover:border-cyan/60")}>
            {tag === t && <motion.span layoutId="tag-pill" className="absolute inset-0 rounded-full bg-linear-to-r from-[#0fd6f5] to-[#49e6ff]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((c, i) => (
            <motion.div key={c.slug} layout initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.55, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}>
              <CaseCard lang={lang} ui={ui} c={c} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

export function Gallery({ photos, title, ui }: { photos: string[]; title: string; ui: UI }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [index, close, step]);

  return (
    <>
      <div className={cx("grid gap-3", photos.length === 1 ? "" : "sm:grid-cols-2", photos.length > 2 && "lg:grid-cols-3")}>
        {photos.map((p, i) => (
          <motion.button
            key={p} type="button" onClick={() => setIndex(i)}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: (i % 3) * 0.07 }}
            className={cx("group relative block overflow-hidden rounded-2xl", photos.length > 2 && i === 0 && "sm:col-span-2 sm:row-span-2")}
            aria-label={`${title}, ${i + 1}`}
          >
            <SmartImg src={p} alt={`${title}, ${i + 1}`} label={ui.photo} className={cx("w-full", photos.length === 1 ? "aspect-[16/9]" : "aspect-[4/3] h-full")} imgClassName="group-hover:scale-[1.05]" />
            <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-white/90 opacity-0 backdrop-blur transition group-hover:opacity-100"><Icon name="resize" className="size-4" /></span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {index !== null && (
          <motion.div className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/92 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} role="dialog" aria-modal="true" aria-label={title}>
            <AnimatePresence mode="wait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img key={index} src={photos[index]} alt={`${title}, ${index + 1}`} onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="max-h-[86dvh] max-w-full rounded-xl object-contain shadow-2xl" />
            </AnimatePresence>
            <button type="button" onClick={close} aria-label={ui.form.close} className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><Icon name="x" /></button>
            {photos.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous" className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-cyan hover:text-ink"><Icon name="left" /></button>
                <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next" className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-cyan hover:text-ink"><Icon name="right" /></button>
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">{index + 1} / {photos.length}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

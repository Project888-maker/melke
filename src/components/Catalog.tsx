"use client";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import type { Locale, UI } from "@/lib/i18n";
import type { WindowSystem } from "@/content/types";
import { btn, BtnInner } from "./Button";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { cx, href } from "@/lib/href";

const tone = { peach: "bg-peach", pink: "bg-pink", lime: "bg-lime", cyan: "bg-cyan-soft" } as const;
const catIcon: Record<string, string> = { all: "layout", warm: "flame", universal: "gem", compact: "scan" };

type Props = {
  lang: Locale; ui: UI; systems: WindowSystem[];
  categories: readonly { key: string; label: string }[];
  rows: { key: string; label: string }[];
  t: { cardTitle: string; cardPrefix: string; widthLabel: string; compare: { title: string; lead: string; note: string; row: string } };
};

export function Catalog({ lang, ui, systems, categories, rows, t }: Props) {
  const [cat, setCat] = useState("all");
  const [picked, setPicked] = useState<string[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
  const shown = useMemo(() => (cat === "all" ? systems : systems.filter((s) => s.category === cat)), [cat, systems]);
  const columns = picked.length >= 2 ? systems.filter((s) => picked.includes(s.slug)) : systems;

  const toggle = (slug: string) => {
    setPicked((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      if (next.length >= 2) setTimeout(() => tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
      return next;
    });
  };

  return (
    <>
      <section className="container-x pt-6">
        <LayoutGroup id="cats">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" role="tablist">
            {categories.map((c) => {
              const active = cat === c.key;
              return (
                <button
                  key={c.key} type="button" role="tab" aria-selected={active} onClick={() => setCat(c.key)}
                  className={cx("relative flex h-[60px] items-center gap-3 rounded-2xl border px-5 text-left text-[15px] font-medium transition-colors duration-300", active ? "border-transparent text-ink" : "border-line bg-white hover:border-cyan/60")}
                >
                  {active && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#0fd6f5] to-[#49e6ff] shadow-[0_14px_30px_-14px_rgb(0_190_225/0.8)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <Icon name={catIcon[c.key] ?? "layout"} className="relative size-[22px]" />
                  <span className="relative">{c.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </section>

      <section className="container-x py-8">
        <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((s, i) => {
              const inCompare = picked.includes(s.slug);
              return (
                <motion.article
                  key={s.slug} layout
                  initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className={cx("group relative flex flex-col rounded-3xl border bg-white p-3 transition-[box-shadow,border-color] duration-500 hover:shadow-lift", inCompare ? "border-cyan shadow-lift" : "border-line")}
                >
                  <Link href={href(lang, `okna/${s.slug}`)} className="relative block aspect-[5/4] overflow-hidden rounded-2xl bg-[#eef3f7]" aria-label={s.name}>
                    <span className={cx("absolute left-3 top-3 z-10 rounded-full px-3.5 py-1.5 text-[13px] font-medium", tone[s.badge.tone])}>{s.badge.text}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.img} alt={s.name} loading="lazy" className="absolute inset-0 size-full object-cover object-[50%_42%] transition-transform duration-700 ease-out-soft group-hover:scale-[1.07]" />
                  </Link>
                  <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                    <h3 className="text-[26px] font-bold leading-none tracking-tight">{t.cardTitle}</h3>
                    <p className="mt-2 text-lg text-muted">{t.cardPrefix} {s.name}</p>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{s.short}</p>
                    <dl className="mt-5 grid grid-cols-2 divide-x divide-line">
                      <div className="pr-4">
                        <dd className="text-xl font-bold tracking-tight">{s.width}</dd>
                        <dt className="mt-0.5 text-[13px] text-muted">{t.widthLabel}</dt>
                      </div>
                      <div className="pl-4">
                        <dd className="text-xl font-bold tracking-tight">{s.chambers}</dd>
                        <dt className="mt-0.5 text-[13px] text-muted">{s.chambersLabel}</dt>
                      </div>
                    </dl>
                    <Link href={href(lang, `okna/${s.slug}`)} className={cx(btn("primary", "md", true), "mt-5")}><BtnInner>{ui.more}</BtnInner></Link>
                    <button type="button" onClick={() => toggle(s.slug)} aria-pressed={inCompare} className={cx(btn("outline", "md", true), "mt-2.5", inCompare && "border-cyan bg-cyan/12")}>
                      <Icon name={inCompare ? "check" : "chart"} className="size-[18px]" />
                      {inCompare ? ui.inCompare : ui.compare}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      <section id="compare" ref={tableRef} className="container-x scroll-mt-28 py-12 sm:py-16">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <h2 className="h-display text-[32px] sm:text-[44px]">{t.compare.title}</h2>
            <p className="mt-3 text-lg text-muted sm:text-xl">{t.compare.lead}</p>
          </div>
          <p className="max-w-sm text-[15px] text-muted">{t.compare.note}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[640px] border-collapse text-[15px]">
            <thead>
              <tr>
                <th className="bg-mist px-6 py-4 text-left font-semibold">{t.compare.row}</th>
                <AnimatePresence mode="popLayout">
                  {columns.map((s) => (
                    <motion.th key={s.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cx("px-6 py-4 text-center font-semibold", tone[s.badge.tone])}>
                      <Link href={href(lang, `okna/${s.slug}`)} className="underline-offset-4 hover:underline">{s.name}</Link>
                    </motion.th>
                  ))}
                </AnimatePresence>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-t border-line transition-colors hover:bg-mist/60">
                  <th scope="row" className="px-6 py-4 text-left font-normal">{r.label}</th>
                  {columns.map((s) => (
                    <td key={s.slug} className="px-6 py-4 text-center font-medium">{s.compare[r.key] ?? "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        {picked.length > 0 && (
          <button type="button" onClick={() => setPicked([])} className="mt-4 inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink">
            <Icon name="restart" className="size-4" />
            {ui.cta.allSystems}
          </button>
        )}
      </section>
    </>
  );
}

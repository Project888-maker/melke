import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale, UI } from "@/lib/i18n";
import type { Content } from "@/content";
import type { Solution } from "@/content/types";
import { Icon } from "./Icon";
import { Reveal, Stagger, StaggerItem, Parallax } from "./Reveal";
import { SmartImg } from "./SmartImg";
import { ButtonLink } from "./Button";
import { cx, href } from "@/lib/href";
import { LoopVideo } from "./LoopVideo";

export type Crumb = { label: string; path?: string };

export function Breadcrumbs({ lang, items, dark = false }: { lang: Locale; items: Crumb[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={cx("text-[13px]", dark ? "text-white/60" : "text-muted")}>
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2.5">
            {i > 0 && <span aria-hidden className="opacity-50">/</span>}
            {c.path !== undefined && i < items.length - 1 ? (
              <Link href={href(lang, c.path)} className={cx("transition", dark ? "hover:text-cyan" : "hover:text-ink")}>{c.label}</Link>
            ) : (
              <span className={dark ? "text-white" : "font-medium text-ink"} aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Dark cinematic hero used on catalogue-level pages. */
export function NightHero({
  lang, crumbs, title, lead, note, image, video, children, tall = false,
}: { lang: Locale; crumbs: Crumb[]; title: ReactNode; lead?: string; note?: string; image?: string; video?: string; children?: ReactNode; tall?: boolean }) {
  return (
    <section className="night relative isolate overflow-hidden text-white">
      {image && (
        <Parallax className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[82%]">
          {video ? (
            <LoopVideo src={video} poster={image} className="mask-fade-l size-full object-cover object-[78%_14%] opacity-45 sm:opacity-70 lg:opacity-100" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={image} alt="" fetchPriority="high" className="mask-fade-l size-full object-cover object-[78%_14%] opacity-45 sm:opacity-70 lg:opacity-100" />
          )}
        </Parallax>
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-[#0a1722] via-[#0a1722]/80 to-transparent lg:via-[#0a1722]/40" />
      <div className={cx("container-x", tall ? "pb-16 pt-8 sm:pb-24 sm:pt-10" : "pb-12 pt-8 sm:pb-16 sm:pt-9")}>
        <Reveal y={10}><Breadcrumbs lang={lang} items={crumbs} dark /></Reveal>
        <div className={cx("max-w-2xl", tall ? "mt-10 sm:mt-16" : "mt-8 sm:mt-10")}>
          <Reveal delay={0.05}><h1 className="h-display text-[44px] sm:text-6xl lg:text-[68px]">{title}</h1></Reveal>
          {lead && <Reveal delay={0.15}><p className="mt-5 max-w-xl text-xl leading-snug text-white/85 sm:text-2xl">{lead}</p></Reveal>}
          {note && <Reveal delay={0.22}><p className="mt-3 text-white/60">{note}</p></Reveal>}
          {children && <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">{children}</Reveal>}
        </div>
      </div>
    </section>
  );
}

/** Light page header for inner pages. */
export function PageHead({ lang, crumbs, title, lead, children }: { lang: Locale; crumbs: Crumb[]; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="container-x pb-8 pt-8 sm:pt-10">
      <Reveal y={10}><Breadcrumbs lang={lang} items={crumbs} /></Reveal>
      <Reveal delay={0.05}><h1 className="h-display mt-6 text-[42px] sm:text-6xl">{title}</h1></Reveal>
      {lead && <Reveal delay={0.12}><p className="mt-4 max-w-2xl text-xl text-muted sm:text-2xl">{lead}</p></Reveal>}
      {children && <Reveal delay={0.18} className="mt-6">{children}</Reveal>}
    </section>
  );
}

export function SectionTitle({ title, lead, aside, className }: { title: string; lead?: string; aside?: ReactNode; className?: string }) {
  return (
    <Reveal className={cx("flex flex-wrap items-end justify-between gap-x-10 gap-y-4", className)}>
      <div className="max-w-2xl">
        <h2 className="h-display text-[32px] sm:text-[44px]">{title}</h2>
        {lead && <p className="mt-3 text-lg text-muted sm:text-xl">{lead}</p>}
      </div>
      {aside && <div className="max-w-sm text-[15px] text-muted">{aside}</div>}
    </Reveal>
  );
}

/** Cyan call-to-action band with Draft. */
export function CtaBand({ title, text, image, children }: { title: string; text?: string; image: string; children: ReactNode }) {
  return (
    <section className="cyan-band relative overflow-hidden">
      <div className="container-x relative grid items-center gap-6 py-10 sm:grid-cols-[220px_1fr_auto] sm:py-12 lg:grid-cols-[300px_1fr_auto]">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[230px] pt-2 sm:block lg:w-[300px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" loading="lazy" className="mascot size-full object-cover object-top" />
        </div>
        <span className="hidden sm:block" />
        <Reveal>
          <h2 className="h-display text-[28px] sm:text-4xl">{title}</h2>
          {text && <p className="mt-3 max-w-xl text-lg text-ink/70">{text}</p>}
        </Reveal>
        <Reveal delay={0.1} className="flex flex-wrap gap-3">{children}</Reveal>
      </div>
    </section>
  );
}

export function Steps({ data }: { data: Content["pages"]["steps"] }) {
  return (
    <section id="steps" className="scroll-mt-24 container-x py-16 sm:py-20">
      <SectionTitle title={data.title} aside={data.lead} />
      <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.items.map((s, i) => (
          <StaggerItem key={s.title} className="group relative rounded-2xl border border-line bg-white p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:border-cyan/50 hover:shadow-lift">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-linear-to-br from-[#0fd6f5] to-[#7eeafc] text-[15px] font-bold">{String(i + 1).padStart(2, "0")}</span>
              <Icon name={s.icon} className="size-9 text-ink/80 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.4} />
            </div>
            <h3 className="mt-5 text-lg font-semibold leading-tight">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
            {i < data.items.length - 1 && <Icon name="arrow" className="absolute -right-3.5 top-9 z-10 hidden size-5 text-cyan-deep lg:block" />}
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function DraftBand({ data }: { data: Content["pages"]["draft"] }) {
  return (
    <section id="draft" className="cyan-band relative scroll-mt-24 overflow-hidden">
      <div className="container-x relative grid gap-6 py-10 sm:grid-cols-[230px_1fr] sm:py-12 lg:grid-cols-[320px_1fr]">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[240px] pt-2 sm:block lg:w-[320px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.img} alt="" loading="lazy" className="mascot size-full object-cover object-top" />
        </div>
        <span className="hidden sm:block" />
        <div>
          <Reveal>
            <h2 className="h-display text-[30px] sm:text-4xl">{data.title}</h2>
            <p className="mt-2 text-lg text-ink/70">{data.lead}</p>
          </Reveal>
          <Stagger className="mt-6 grid gap-3 md:grid-cols-3">
            {data.items.map((it) => (
              <StaggerItem key={it.title} className="rounded-2xl bg-white/85 p-5 backdrop-blur transition-transform duration-500 ease-out-soft hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <Icon name={it.icon} className="size-6 text-cyan-deep" />
                  <h3 className="font-semibold leading-tight">{it.title}</h3>
                </div>
                <p className="mt-2.5 text-[15px] leading-snug text-muted">{it.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

export function Partners({ data }: { data: Content["pages"]["partners"] }) {
  return (
    <section id="partners" className="scroll-mt-24 container-x py-16 sm:py-20">
      <SectionTitle title={data.title} aside={data.lead} />
      <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3" gap={0.05}>
        {data.items.map((p) => (
          <StaggerItem key={p} className="grid h-16 place-items-center rounded-2xl border border-line bg-white text-lg font-medium transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1 hover:border-cyan/60 hover:shadow-card">
            {p}
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function StatStrip({ items, title }: { items: { value: string; label: string }[]; title?: string }) {
  return (
    <Reveal className="container-x">
      <div className={cx("grid gap-y-5 rounded-2xl border border-line bg-white px-6 py-6 shadow-card sm:px-8", title ? "sm:grid-cols-[auto_repeat(3,1fr)]" : items.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3")}>
        {title && <div className="flex items-center pr-8 text-[15px] font-semibold leading-tight">{title}</div>}
        {items.map((s, i) => (
          <div key={s.label} className={cx("px-2 text-center", (i > 0 || title) && "sm:border-l sm:border-line")}>
            <div className="text-2xl font-bold tracking-tight sm:text-[28px]">{s.value}</div>
            <div className="mt-1 text-sm text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/** Long-form sections for solution and accessory pages. */
export function Article({ item }: { item: Solution }) {
  return (
    <div className="container-x grid gap-5 py-12 sm:py-16">
      {item.sections.map((s, i) => (
        <Reveal key={i} as="section" className={cx("grid items-start gap-6 rounded-3xl border border-line bg-white p-6 sm:p-10", s.img && "lg:grid-cols-[1fr_minmax(0,420px)]")}>
          <div className={cx(s.img && i % 2 === 1 && "lg:order-2")}>
            {s.title && <h2 className="h-display text-2xl sm:text-[32px]">{s.title}</h2>}
            {s.text?.map((p, j) => <p key={j} className={cx("max-w-3xl text-[17px] leading-relaxed text-ink/80", (s.title || j > 0) && "mt-4")}>{p}</p>)}
            {s.list && (
              <ul className={cx("grid gap-2.5", (s.title || s.text) && "mt-5", !s.img && s.list.length > 4 && "sm:grid-cols-2")}>
                {s.list.map((l) => (
                  <li key={l} className="flex gap-3 text-[16px] leading-snug">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-cyan/18 text-cyan-deep"><Icon name="check" className="size-3.5" strokeWidth={3} /></span>
                    {l}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {s.img && <SmartImg src={s.img} alt={s.imgAlt ?? s.title ?? ""} className="aspect-[4/3] w-full rounded-2xl" fit="cover" />}
        </Reveal>
      ))}
    </div>
  );
}

export function LinkCard({ lang, path, title, text, kicker, image, ui }: { lang: Locale; path: string; title: string; text: string; kicker?: string; image?: string; ui: UI }) {
  return (
    <Link href={href(lang, path)} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:border-cyan/50 hover:shadow-lift">
      <SmartImg src={image} alt={title} className="aspect-[16/10] w-full" imgClassName="group-hover:scale-[1.05]" />
      <div className="flex flex-1 flex-col p-6">
        {kicker && <span className="text-[13px] font-medium uppercase tracking-wider text-cyan-deep">{kicker}</span>}
        <h3 className="mt-1.5 text-[22px] font-bold leading-tight tracking-tight">{title}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{text}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-medium">
          {ui.more}
          <Icon name="arrow" className="size-[18px] text-cyan-deep transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}

export { ButtonLink };

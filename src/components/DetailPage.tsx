import type { Locale, UI } from "@/lib/i18n";
import type { Content } from "@/content";
import type { Solution } from "@/content/types";
import { Article, Breadcrumbs, CtaBand, LinkCard, SectionTitle, StatStrip, type Crumb } from "./Sections";
import { Reveal, Stagger, StaggerItem, Parallax } from "./Reveal";
import { RequestButton } from "./RequestProvider";
import { SmartImg } from "./SmartImg";

/** Shared layout for solution and accessory detail pages. */
export function DetailPage({
  lang, ui, c, item, crumbs, base, siblings,
}: { lang: Locale; ui: UI; c: Content; item: Solution; crumbs: Crumb[]; base: string; siblings: Solution[] }) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-linear-to-b from-white to-mist">
        <div aria-hidden className="absolute -right-40 -top-40 -z-10 size-[620px] rounded-full bg-cyan/20 blur-3xl" />
        <div className={`container-x grid items-center gap-8 pb-10 pt-8 ${item.img ? "lg:grid-cols-[1fr_minmax(0,520px)]" : ""}`}>
          <div>
            <Reveal y={10}><Breadcrumbs lang={lang} items={crumbs} /></Reveal>
            <Reveal delay={0.06}><p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-deep">{item.kicker}</p></Reveal>
            <Reveal delay={0.1}><h1 className="h-display mt-3 text-[44px] sm:text-6xl lg:text-[68px]">{item.title}</h1></Reveal>
            <Reveal delay={0.18}><p className="mt-5 max-w-xl text-xl leading-snug text-muted sm:text-2xl">{item.lead}</p></Reveal>
            <Reveal delay={0.26} className="mt-8 flex flex-wrap gap-3">
              <RequestButton kind="calc" size="lg" topic={item.title}>{ui.cta.calc}</RequestButton>
              <RequestButton kind="measure" size="lg" variant="outline" topic={item.title}>{ui.cta.measure}</RequestButton>
            </Reveal>
          </div>
          {item.img && (
            <Parallax>
              <SmartImg src={item.img} alt={item.title} eager className="aspect-[4/3] w-full rounded-3xl shadow-card ring-1 ring-line" />
            </Parallax>
          )}
        </div>
        {item.specs && <div className="pb-12"><StatStrip items={item.specs} /></div>}
      </section>
      <Article item={item} />
      {siblings.length > 0 && (
        <section className="container-x pb-16 sm:pb-20">
          <SectionTitle title={ui.nav.solutions === crumbs[1]?.label ? ui.nav.solutions : crumbs[1]?.label ?? ""} />
          <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.slice(0, 3).map((s) => (
              <StaggerItem key={s.slug}><LinkCard lang={lang} ui={ui} path={`${base}/${s.slug}`} title={s.title} kicker={s.kicker} text={s.lead} image={s.img} /></StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
      <CtaBand title={c.pages.solutions.cta.title} text={c.pages.solutions.cta.text} image={c.pages.draft.img}>
        <RequestButton kind="consult" size="lg" topic={item.title}>{ui.cta.discuss}</RequestButton>
      </CtaBand>
    </>
  );
}

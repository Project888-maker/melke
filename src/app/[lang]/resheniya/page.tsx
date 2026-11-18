import type { Metadata } from "next";
import { load, alternates } from "@/lib/page";
import { CtaBand, LinkCard, NightHero, SectionTitle } from "@/components/Sections";
import { Stagger, StaggerItem } from "@/components/Reveal";
import { RequestButton } from "@/components/RequestProvider";
import { ButtonLink } from "@/components/Button";
import { href } from "@/lib/href";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { c } = await load(params);
  return { ...c.pages.solutions.meta, alternates: alternates("resheniya") };
}

export default async function Solutions({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, ui, c } = await load(params);
  const p = c.pages.solutions;
  return (
    <>
      <NightHero lang={lang} crumbs={[{ label: ui.home, path: "" }, { label: ui.nav.solutions }]} title={p.hero.title} lead={p.hero.lead} image={c.pages.home.hero.img}>
        <RequestButton kind="consult" size="lg">{ui.cta.pick}</RequestButton>
        <ButtonLink href={href(lang, "okna")} variant="outline" size="lg" className="border-white/25! bg-white/8! text-white! hover:bg-white/15!">{ui.nav.windows}</ButtonLink>
      </NightHero>
      {c.solutionGroups.map((g) => {
        const items = c.solutions.filter((s) => s.group === g.key);
        if (!items.length) return null;
        return (
          <section key={g.key} id={g.key} className="container-x scroll-mt-28 pt-14 sm:pt-20 last-of-type:pb-20">
            <SectionTitle title={g.label} />
            <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <StaggerItem key={s.slug}><LinkCard lang={lang} ui={ui} path={`resheniya/${s.slug}`} title={s.title} kicker={s.kicker} text={s.lead} image={s.img} /></StaggerItem>
              ))}
            </Stagger>
          </section>
        );
      })}
      <div className="h-16 sm:h-20" />
      <CtaBand title={p.cta.title} text={p.cta.text} image={c.pages.draft.img}>
        <RequestButton kind="consult" size="lg">{ui.cta.discuss}</RequestButton>
      </CtaBand>
    </>
  );
}

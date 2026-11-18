import type { Metadata } from "next";
import { load, alternates } from "@/lib/page";
import { Catalog } from "@/components/Catalog";
import { CtaBand, NightHero } from "@/components/Sections";
import { DraftButton } from "@/components/RequestProvider";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { c } = await load(params);
  return { ...c.pages.windows.meta, alternates: alternates("okna") };
}

export default async function Windows({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, ui, c } = await load(params);
  const w = c.pages.windows;
  return (
    <>
      <NightHero
        lang={lang}
        crumbs={[{ label: ui.home, path: "" }, { label: ui.nav.windows }]}
        title={<>{w.hero.title} <span className="bg-linear-to-r from-[#19d9f7] to-[#9defff] bg-clip-text text-transparent">{w.hero.accent}</span></>}
        lead={w.hero.lead}
        note={w.hero.note}
        image={w.hero.img}
      />
      <Catalog lang={lang} ui={ui} systems={c.systems} categories={c.categories} rows={c.compareRows} t={{ cardTitle: w.cardTitle, cardPrefix: w.cardPrefix, widthLabel: w.widthLabel, compare: w.compare }} />
      <CtaBand title={w.cta.title} text={w.cta.text} image={c.pages.draft.img}>
        <DraftButton size="lg">{ui.cta.choose}</DraftButton>
      </CtaBand>
    </>
  );
}

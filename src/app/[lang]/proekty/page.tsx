import type { Metadata } from "next";
import { load, alternates } from "@/lib/page";
import { CtaBand, PageHead, Partners } from "@/components/Sections";
import { ProjectsGrid } from "@/components/Projects";
import { RequestButton } from "@/components/RequestProvider";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { c } = await load(params);
  return { ...c.pages.projects.meta, alternates: alternates("proekty") };
}

export default async function Projects({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, ui, c } = await load(params);
  const p = c.pages.projects;
  return (
    <>
      <PageHead lang={lang} crumbs={[{ label: ui.home, path: "" }, { label: p.title }]} title={p.title} lead={p.lead}>
        <span className="inline-flex h-10 items-center rounded-full bg-linear-to-r from-[#0fd6f5] to-[#49e6ff] px-5 text-[15px] font-medium">{p.count(c.cases.length)}</span>
      </PageHead>
      <ProjectsGrid lang={lang} ui={ui} cases={c.cases} tags={c.caseTags} />
      <div className="bg-white"><Partners data={c.pages.partners} /></div>
      <CtaBand title={p.cta.title} text={p.cta.text} image={c.pages.draft.img}>
        <RequestButton kind="consult" size="lg">{ui.cta.discuss}</RequestButton>
      </CtaBand>
    </>
  );
}

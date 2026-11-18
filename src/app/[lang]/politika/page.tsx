import type { Metadata } from "next";
import { load, alternates } from "@/lib/page";
import { PageHead } from "@/components/Sections";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { c } = await load(params);
  return { title: c.pages.privacy.title, alternates: alternates("politika") };
}

export default async function Privacy({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, ui, c } = await load(params);
  const p = c.pages.privacy;
  return (
    <>
      <PageHead lang={lang} crumbs={[{ label: ui.home, path: "" }, { label: p.title }]} title={p.title} />
      <section className="container-x pb-20">
        <div className="max-w-3xl space-y-4 rounded-3xl border border-line bg-white p-7 text-[17px] leading-relaxed sm:p-10">
          {p.text.map((t, i) => <p key={i}>{t}</p>)}
        </div>
      </section>
    </>
  );
}

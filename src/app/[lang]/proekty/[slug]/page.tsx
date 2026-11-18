import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { load, alternates } from "@/lib/page";
import { getContent } from "@/content";
import { locales } from "@/lib/i18n";
import { href } from "@/lib/href";
import { CtaBand, PageHead } from "@/components/Sections";
import { Gallery } from "@/components/Projects";
import { Reveal } from "@/components/Reveal";
import { RequestButton } from "@/components/RequestProvider";
import { SmartImg } from "@/components/SmartImg";
import { Icon } from "@/components/Icon";

type P = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => getContent(lang).cases.map((s) => ({ lang, slug: s.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const { c } = await load(params);
  const s = c.cases.find((x) => x.slug === slug);
  return s ? { title: s.title, description: s.text?.[0] ?? `${s.title}, ${s.year}`, alternates: alternates(`proekty/${slug}`) } : {};
}

export default async function CasePage({ params }: P) {
  const { slug } = await params;
  const { lang, ui, c } = await load(params);
  const i = c.cases.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const cs = c.cases[i];
  const next = c.cases[(i + 1) % c.cases.length];
  const p = c.pages.projects;
  return (
    <>
      <PageHead lang={lang} crumbs={[{ label: ui.home, path: "" }, { label: p.title, path: "proekty" }, { label: cs.title }]} title={cs.title}>
        <ul className="flex flex-wrap gap-2 text-[15px]">
          <li className="inline-flex h-10 items-center gap-2 rounded-full bg-linear-to-r from-[#0fd6f5] to-[#49e6ff] px-4 font-medium"><Icon name="clock" className="size-4" />{cs.year}</li>
          {cs.place && <li className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4"><Icon name="pin" className="size-4 text-cyan-deep" />{cs.place}</li>}
          {cs.tags.map((t) => <li key={t} className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4">{t}</li>)}
        </ul>
      </PageHead>

      <section className="container-x pb-10">
        <Gallery photos={cs.photos} title={cs.title} ui={ui} />
      </section>

      {(cs.text || cs.specs) && (
        <section className="container-x grid gap-5 pb-14 lg:grid-cols-[1fr_minmax(0,420px)]">
          {cs.text && (
            <Reveal className="rounded-3xl border border-line bg-white p-7 sm:p-10">
              <h2 className="h-display text-2xl sm:text-[32px]">{p.about}</h2>
              {cs.text.map((t, j) => <p key={j} className="mt-4 text-[17px] leading-relaxed text-ink/80">{t}</p>)}
            </Reveal>
          )}
          {cs.specs && (
            <Reveal delay={0.08} className="rounded-3xl border border-line bg-white p-7 sm:p-10">
              <h2 className="h-display text-2xl sm:text-[32px]">{p.specs}</h2>
              <ul className="mt-5 grid gap-2.5">
                {cs.specs.map((s) => (
                  <li key={s} className="flex gap-3 leading-snug">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-cyan/18 text-cyan-deep"><Icon name="check" className="size-3.5" strokeWidth={3} /></span>
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </section>
      )}

      <section className="container-x pb-16">
        <Link href={href(lang, `proekty/${next.slug}`)} className="group flex items-center gap-5 rounded-3xl border border-line bg-white p-4 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1 hover:border-cyan/50 hover:shadow-lift sm:gap-7">
          <SmartImg src={next.teaser} alt="" className="aspect-[16/10] w-32 shrink-0 rounded-2xl sm:w-56" imgClassName="group-hover:scale-105" />
          <span className="flex-1">
            <span className="text-sm font-medium uppercase tracking-wider text-cyan-deep">{p.next}</span>
            <span className="mt-1 block text-xl font-bold tracking-tight sm:text-3xl">{next.title}</span>
          </span>
          <span className="mr-2 grid size-12 shrink-0 place-items-center rounded-full bg-cyan/15 text-cyan-deep transition-all duration-500 group-hover:bg-cyan group-hover:text-ink sm:mr-4 sm:size-14"><Icon name="arrow" /></span>
        </Link>
      </section>

      <CtaBand title={p.cta.title} text={p.cta.text} image={c.pages.draft.img}>
        <RequestButton kind="consult" size="lg" topic={cs.title}>{ui.cta.discuss}</RequestButton>
      </CtaBand>
    </>
  );
}

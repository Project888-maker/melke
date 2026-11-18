import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { load, alternates } from "@/lib/page";
import { getContent } from "@/content";
import { locales } from "@/lib/i18n";
import { href } from "@/lib/href";
import { CtaBand, PageHead } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { RequestButton } from "@/components/RequestProvider";
import { ButtonLink } from "@/components/Button";
import { SmartImg } from "@/components/SmartImg";
import { Icon } from "@/components/Icon";

type P = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => getContent(lang).news.map((s) => ({ lang, slug: s.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const { c } = await load(params);
  const n = c.news.find((x) => x.slug === slug);
  return n ? { title: n.title, description: n.lead, alternates: alternates(`novosti/${slug}`) } : {};
}

export default async function NewsItemPage({ params }: P) {
  const { slug } = await params;
  const { lang, ui, c } = await load(params);
  const n = c.news.find((x) => x.slug === slug);
  if (!n) notFound();
  const p = c.pages.news;
  return (
    <>
      <PageHead lang={lang} crumbs={[{ label: ui.home, path: "" }, { label: p.title, path: "novosti" }, { label: n.title }]} title={n.title} lead={n.lead}>
        <time dateTime={n.date} className="inline-flex h-10 items-center rounded-full bg-linear-to-r from-[#0fd6f5] to-[#49e6ff] px-5 text-[15px] font-medium">
          {new Date(n.date).toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" })}
        </time>
      </PageHead>
      <article className="container-x grid max-w-[920px]! gap-5 pb-14">
        {n.img && <Reveal><SmartImg src={n.img} alt={n.title} eager className="aspect-[16/9] w-full rounded-3xl" /></Reveal>}
        {n.blocks.map((b, i) => (
          <Reveal key={i} as="section" className="rounded-3xl border border-line bg-white p-7 sm:p-10">
            {b.title && <h2 className="h-display text-2xl sm:text-[30px]">{b.title}</h2>}
            {b.text?.map((t, j) => <p key={j} className={`text-[17px] leading-relaxed text-ink/80 ${b.title || j > 0 ? "mt-4" : ""}`}>{t}</p>)}
            {b.list && (
              <ul className="mt-5 grid gap-2.5">
                {b.list.map((l) => (
                  <li key={l} className="flex gap-3 leading-snug"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-cyan/18 text-cyan-deep"><Icon name="check" className="size-3.5" strokeWidth={3} /></span>{l}</li>
                ))}
              </ul>
            )}
            {b.img && <SmartImg src={b.img} alt={b.title ?? n.title} className="mt-6 aspect-[16/9] w-full rounded-2xl" />}
            {b.link && <a href={b.link.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-medium underline decoration-cyan decoration-2 underline-offset-4">{b.link.label}<Icon name="arrow" className="size-4 -rotate-45 text-cyan-deep" /></a>}
          </Reveal>
        ))}
        <div><ButtonLink href={href(lang, "novosti")} variant="outline" arrow={false}><Icon name="left" className="size-[18px]" />{p.back}</ButtonLink></div>
      </article>
      <CtaBand title={c.pages.solutions.cta.title} text={c.pages.solutions.cta.text} image={c.pages.draft.img}>
        <RequestButton kind="consult" size="lg">{ui.cta.discuss}</RequestButton>
      </CtaBand>
    </>
  );
}

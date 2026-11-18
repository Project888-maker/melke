import type { Metadata } from "next";
import Link from "next/link";
import { load, alternates } from "@/lib/page";
import { href } from "@/lib/href";
import { PageHead } from "@/components/Sections";
import { Stagger, StaggerItem } from "@/components/Reveal";
import { SmartImg } from "@/components/SmartImg";
import { Icon } from "@/components/Icon";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { c } = await load(params);
  return { ...c.pages.news.meta, alternates: alternates("novosti") };
}

export default async function News({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, ui, c } = await load(params);
  const p = c.pages.news;
  return (
    <>
      <PageHead lang={lang} crumbs={[{ label: ui.home, path: "" }, { label: p.title }]} title={p.title} lead={p.lead} />
      <section className="container-x pb-20">
        <Stagger className="grid gap-5 md:grid-cols-2">
          {c.news.map((n) => (
            <StaggerItem key={n.slug}>
              <Link href={href(lang, `novosti/${n.slug}`)} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:border-cyan/50 hover:shadow-lift">
                <SmartImg src={n.img} alt={n.title} className="aspect-[16/9] w-full" imgClassName="group-hover:scale-105" />
                <div className="flex flex-1 flex-col p-7">
                  <time dateTime={n.date} className="text-sm font-medium text-cyan-deep">{new Date(n.date).toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" })}</time>
                  <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight">{n.title}</h2>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{n.lead}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-medium">{ui.more}<Icon name="arrow" className="size-[18px] text-cyan-deep transition-transform duration-300 group-hover:translate-x-1.5" /></span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}

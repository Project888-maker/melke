import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { load, alternates } from "@/lib/page";
import { getContent } from "@/content";
import { locales } from "@/lib/i18n";
import { href } from "@/lib/href";
import { Breadcrumbs, CtaBand, SectionTitle, StatStrip } from "@/components/Sections";
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/Reveal";
import { RequestButton } from "@/components/RequestProvider";
import { ButtonLink } from "@/components/Button";
import { SmartImg } from "@/components/SmartImg";
import { Icon } from "@/components/Icon";

type P = { params: Promise<{ lang: string; slug: string }> };
const tone = { peach: "bg-peach", pink: "bg-pink", lime: "bg-lime", cyan: "bg-cyan-soft" } as const;

export function generateStaticParams() {
  return locales.flatMap((lang) => getContent(lang).systems.map((s) => ({ lang, slug: s.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const { c } = await load(params);
  const s = c.systems.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: `${c.pages.windows.product.title} ${s.heroTitle}`, description: `${s.short} ${s.width}, ${s.chambers}.`, alternates: alternates(`okna/${slug}`) };
}

export default async function SystemPage({ params }: P) {
  const { slug } = await params;
  const { lang, ui, c } = await load(params);
  const s = c.systems.find((x) => x.slug === slug);
  if (!s) notFound();
  const w = c.pages.windows;
  const others = c.systems.filter((x) => x.slug !== s.slug);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-linear-to-b from-white to-mist">
        <div aria-hidden className="absolute -right-40 -top-40 -z-10 size-[620px] rounded-full bg-cyan/20 blur-3xl" />
        <div className="container-x grid items-center gap-8 pb-10 pt-8 lg:grid-cols-[1fr_minmax(0,560px)] lg:pb-14">
          <div>
            <Reveal y={10}><Breadcrumbs lang={lang} items={[{ label: ui.home, path: "" }, { label: ui.nav.windows, path: "okna" }, { label: s.name.replace("Melke ", "") }]} /></Reveal>
            <Reveal delay={0.05}><span className={`mt-8 inline-block rounded-full px-4 py-1.5 text-sm font-medium ${tone[s.badge.tone]}`}>{s.badge.text}</span></Reveal>
            <Reveal delay={0.1}><h1 className="h-display mt-4 text-[52px] sm:text-7xl">{w.product.title}</h1></Reveal>
            <Reveal delay={0.16}><p className="h-display mt-2 text-[26px] sm:text-4xl">{s.heroTitle}</p></Reveal>
            <Reveal delay={0.22}><p className="mt-4 text-2xl font-semibold tracking-tight sm:text-[28px]">{s.heroLead}</p></Reveal>
            <Reveal delay={0.28}><p className="mt-3 max-w-md text-lg text-muted">{s.heroNote}</p></Reveal>
            <Reveal delay={0.36} className="mt-8 flex flex-wrap gap-3">
              <RequestButton kind="calc" size="lg" system={s.name} topic={s.name}>{ui.cta.calc}</RequestButton>
              <ButtonLink href={href(lang, "okna#compare")} variant="outline" size="lg" arrow={false}><Icon name="chart" className="size-[18px]" />{ui.compare}</ButtonLink>
            </Reveal>
          </div>
          <Parallax className="relative mx-auto aspect-square w-full max-w-[560px]">
            <span aria-hidden className="absolute inset-[12%] rounded-full bg-linear-to-br from-cyan/35 to-transparent blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.heroImg} alt={s.name} className="relative size-full animate-float object-contain drop-shadow-[0_40px_50px_rgb(13_27_39/0.18)]" />
          </Parallax>
        </div>
        <div className="pb-12"><StatStrip items={s.stats} title={w.product.specs} /></div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <SectionTitle title={s.sectionTitle} lead={s.sectionLead} />
        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,460px)_1fr]">
          <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-linear-to-b from-[#eef4f8] to-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt={s.name} loading="lazy" className="aspect-square w-full object-contain transition-transform duration-700 ease-out-soft hover:scale-105" />
          </Reveal>
          <Stagger className="grid gap-4">
            {s.features.map((f) => (
              <StaggerItem key={f.title} className="group flex items-center gap-5 rounded-3xl border border-line bg-white p-4 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1 hover:border-cyan/50 hover:shadow-lift sm:gap-7 sm:p-5">
                <SmartImg src={f.img} alt={f.title} className="aspect-[4/3] w-28 shrink-0 rounded-2xl sm:w-44" imgClassName="group-hover:scale-110" />
                <div>
                  <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{f.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted sm:text-[17px]">{f.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {s.about.length > 0 && (
        <section className="bg-white">
          <div className="container-x grid gap-8 py-14 sm:py-20 lg:grid-cols-[320px_1fr]">
            <Reveal><h2 className="h-display text-[32px] sm:text-[40px]">{w.product.aboutTitle}</h2></Reveal>
            <div className="max-w-3xl space-y-5">
              {s.about.map((t, i) => (<Reveal key={i} delay={i * 0.07}><p className={i === 0 ? "text-xl leading-relaxed sm:text-2xl" : "text-[17px] leading-relaxed text-ink/75"}>{t}</p></Reveal>))}
            </div>
          </div>
        </section>
      )}

      <section className="relative isolate overflow-hidden">
        <Parallax className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[58%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.interiorImg} alt="" loading="lazy" className="mask-fade-l size-full object-cover opacity-25 lg:opacity-100" />
        </Parallax>
        <div className="container-x py-16 sm:py-24">
          <div className="max-w-xl">
            <Reveal><h2 className="h-display text-[32px] sm:text-[44px]">{s.interiorTitle}</h2></Reveal>
            <Reveal delay={0.08}><p className="mt-4 text-lg leading-relaxed text-ink/70">{s.interiorText}</p></Reveal>
            <Stagger className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {s.colors.map((col) => (
                <StaggerItem key={col.name} className="group">
                  <span className="block aspect-[4/3] rounded-2xl shadow-card ring-1 ring-ink/5 transition-transform duration-500 ease-out-soft group-hover:-translate-y-1.5 group-hover:shadow-lift" style={{ background: col.swatch }} />
                  <span className="mt-3 block font-semibold">{col.name}</span>
                  <span className="block text-[13px] leading-snug text-muted">{col.desc}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-5 text-[13px] text-muted">{s.colorsNote}</p>
          </div>
        </div>
      </section>

      <section className="container-x pb-16 sm:pb-20">
        <SectionTitle title={w.product.otherTitle} />
        <Stagger className="mt-8 grid gap-5 md:grid-cols-2">
          {others.map((o) => (
            <StaggerItem key={o.slug}>
              <Link href={href(lang, `okna/${o.slug}`)} className="group flex items-center gap-6 rounded-3xl border border-line bg-white p-4 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:border-cyan/50 hover:shadow-lift">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.img} alt="" loading="lazy" className="aspect-square w-32 shrink-0 rounded-2xl bg-mist object-contain transition-transform duration-700 group-hover:scale-105 sm:w-40" />
                <span className="flex-1">
                  <span className={`inline-block rounded-full px-3 py-1 text-[13px] font-medium ${tone[o.badge.tone]}`}>{o.badge.text}</span>
                  <span className="mt-2 block text-2xl font-bold tracking-tight">{o.name}</span>
                  <span className="mt-1 block text-[15px] text-muted">{o.width}, {o.chambers}</span>
                </span>
                <Icon name="arrow" className="mr-3 size-6 text-cyan-deep transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand title={s.ctaTitle} text={s.ctaText} image={c.pages.draft.img}>
        <RequestButton kind="measure" size="lg" system={s.name} topic={s.name}>{ui.cta.measure}</RequestButton>
      </CtaBand>
    </>
  );
}

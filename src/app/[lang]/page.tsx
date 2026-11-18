import Link from "next/link";
import type { Metadata } from "next";
import { load, alternates } from "@/lib/page";
import { href } from "@/lib/href";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { RequestButton, DraftButton } from "@/components/RequestProvider";
import { ButtonLink, btn, BtnInner } from "@/components/Button";
import { CtaBand, DraftBand, LinkCard, Partners, SectionTitle, Steps } from "@/components/Sections";
import { CaseCard } from "@/components/Projects";
import { Icon } from "@/components/Icon";
import { HeroScene } from "@/components/HeroScene";
import { ProfileShot } from "@/components/ProfileShot";

export const metadata: Metadata = { alternates: alternates() };

const tone = { peach: "bg-peach", pink: "bg-pink", lime: "bg-lime", cyan: "bg-cyan-soft" } as const;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, ui, c } = await load(params);
  const p = c.pages.home;
  const w = c.pages.windows;
  return (
    <>
      <section className="night relative isolate overflow-hidden text-white">
        <HeroScene image={p.hero.img} figure={p.hero.figure} video="/video/hero-night-house.mp4" />
        <div className="container-x pb-28 pt-14 sm:pb-36 sm:pt-20 lg:pt-24">
          <Reveal y={12}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm backdrop-blur">
              <span className="relative flex size-2"><span className="absolute inline-flex size-full rounded-full bg-cyan animate-pulse-ring" /><span className="relative inline-flex size-2 rounded-full bg-cyan" /></span>
              {p.hero.kicker}
            </span>
          </Reveal>
          <h1 className="h-display mt-7 text-[46px] sm:text-7xl lg:text-[76px] xl:text-[80px]">
            {p.hero.title.map((line, i) => (
              <Reveal key={line} delay={0.08 + i * 0.1} y={36}>
                <span className={i > 0 ? "bg-linear-to-r from-[#19d9f7] to-[#9defff] bg-clip-text text-transparent" : ""}>{line}</span>
              </Reveal>
            ))}
          </h1>
          <Reveal delay={0.42}><p className="mt-7 max-w-xl text-xl leading-snug text-white/80 sm:text-2xl">{p.hero.lead}</p></Reveal>
          <Reveal delay={0.52} className="mt-9 flex flex-wrap gap-3">
            <RequestButton kind="calc" size="lg">{ui.cta.calc}</RequestButton>
            <Link href={href(lang, "okna")} className={`${btn("outline", "lg")} border-white/25! bg-white/8! text-white! backdrop-blur hover:bg-white/15!`}>
              <BtnInner variant="outline">{ui.nav.windows}</BtnInner>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="container-x relative z-10 -mt-16 sm:-mt-20">
        <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-card lg:grid-cols-4">
          {p.stats.map((s) => (
            <StaggerItem key={s.label} className="bg-white px-6 py-7 sm:px-8 sm:py-9">
              <div className="h-display text-[34px] sm:text-5xl">{s.value}</div>
              <div className="mt-2 text-[15px] leading-snug text-muted">{s.label}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="systems" className="scroll-mt-24 container-x py-16 sm:py-24">
        <SectionTitle title={p.systems.title} lead={p.systems.lead} aside={<ButtonLink href={href(lang, "okna#compare")} variant="outline">{ui.compare}</ButtonLink>} />
        <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
          {c.systems.map((s) => (
            <StaggerItem key={s.slug}>
              <Link href={href(lang, `okna/${s.slug}`)} className="group flex h-full flex-col rounded-3xl border border-line bg-white p-3 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-2 hover:border-cyan/50 hover:shadow-lift">
                <span className="relative block aspect-[5/4] overflow-hidden rounded-2xl bg-[#eef3f7]">
                  <span className={`absolute left-3 top-3 z-10 rounded-full px-3.5 py-1.5 text-[13px] font-medium ${tone[s.badge.tone]}`}>{s.badge.text}</span>
                  <ProfileShot src={s.cutout} alt={s.name} />
                </span>
                <span className="flex flex-1 flex-col px-3 pb-3 pt-5">
                  <span className="text-[26px] font-bold leading-none tracking-tight">{s.name}</span>
                  <span className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{s.short}</span>
                  <span className="mt-5 flex items-end justify-between">
                    <span><span className="block text-xl font-bold">{s.width}</span><span className="text-[13px] text-muted">{w.widthLabel}</span></span>
                    <span className="grid size-12 place-items-center rounded-full bg-cyan/15 text-cyan-deep transition-all duration-500 group-hover:bg-cyan group-hover:text-ink"><Icon name="arrow" className="transition-transform duration-500 group-hover:translate-x-0.5" /></span>
                  </span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="why" className="scroll-mt-24 bg-white">
        <div className="container-x py-16 sm:py-24">
          <SectionTitle title={p.why.title} lead={p.why.lead} />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {p.why.items.map((it) => (
              <StaggerItem key={it.title} className="group rounded-3xl bg-mist p-7 transition-[transform,background-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:bg-cyan/14">
                <span className="grid size-14 place-items-center rounded-2xl bg-white text-cyan-deep shadow-card transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110"><Icon name={it.icon} className="size-7" /></span>
                <h3 className="mt-6 text-xl font-bold tracking-tight">{it.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{it.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="solutions" className="scroll-mt-24 container-x py-16 sm:py-24">
        <SectionTitle title={p.solutions.title} lead={p.solutions.lead} aside={<ButtonLink href={href(lang, "resheniya")} variant="outline">{ui.nav.solutions}</ButtonLink>} />
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.solutions.slice(0, 6).map((s) => (
            <StaggerItem key={s.slug}><LinkCard lang={lang} ui={ui} path={`resheniya/${s.slug}`} title={s.title} kicker={s.kicker} text={s.lead} image={s.img} /></StaggerItem>
          ))}
        </Stagger>
      </section>

      <DraftBand data={c.pages.draft} />
      <Steps data={c.pages.steps} />

      <section id="projects" className="scroll-mt-24 bg-white">
        <div className="container-x py-16 sm:py-24">
          <SectionTitle title={p.projects.title} lead={p.projects.lead} aside={<ButtonLink href={href(lang, "proekty")} variant="outline">{ui.cta.allProjects}</ButtonLink>} />
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.cases.slice(0, 6).map((cs) => (<StaggerItem key={cs.slug}><CaseCard lang={lang} ui={ui} c={cs} /></StaggerItem>))}
          </Stagger>
        </div>
      </section>

      <section id="news" className="scroll-mt-24 container-x py-16 sm:py-24">
        <SectionTitle title={p.news.title} aside={<ButtonLink href={href(lang, "novosti")} variant="outline">{ui.nav.news}</ButtonLink>} />
        <Stagger className="mt-10 grid gap-5 md:grid-cols-2">
          {c.news.slice(0, 2).map((n) => (
            <StaggerItem key={n.slug}>
              <Link href={href(lang, `novosti/${n.slug}`)} className="group flex h-full flex-col rounded-3xl border border-line bg-white p-8 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:border-cyan/50 hover:shadow-lift">
                <time dateTime={n.date} className="text-sm font-medium text-cyan-deep">{new Date(n.date).toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" })}</time>
                <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight">{n.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{n.lead}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-medium">{ui.more}<Icon name="arrow" className="size-[18px] text-cyan-deep transition-transform duration-300 group-hover:translate-x-1.5" /></span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Partners data={c.pages.partners} />
      <CtaBand title={w.cta.title} text={w.cta.text} image={c.pages.draft.img}>
        <DraftButton size="lg">{ui.cta.choose}</DraftButton>
      </CtaBand>
    </>
  );
}

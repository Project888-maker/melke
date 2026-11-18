import type { Metadata } from "next";
import { load, alternates } from "@/lib/page";
import { old } from "@/lib/media";
import { href } from "@/lib/href";
import { DraftBand, NightHero, Partners, SectionTitle, Steps } from "@/components/Sections";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { RequestButton } from "@/components/RequestProvider";
import { ButtonLink } from "@/components/Button";
import { SmartImg } from "@/components/SmartImg";
import { VideoCard } from "@/components/VideoCard";
import { Icon } from "@/components/Icon";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { c } = await load(params);
  return { ...c.pages.about.meta, alternates: alternates("o-kompanii") };
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, ui, c } = await load(params);
  const a = c.pages.about;
  return (
    <>
      <NightHero
        lang={lang} tall
        crumbs={[{ label: ui.home, path: "" }, { label: ui.nav.about }]}
        title={a.hero.title.map((line, i) => (
          <span key={line} className={i > 0 ? "block bg-linear-to-r from-[#19d9f7] to-[#9defff] bg-clip-text text-transparent" : "block"}>{line}</span>
        ))}
        lead={a.hero.lead}
        image={a.hero.img}
      />

      <section className="container-x py-14 sm:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <Reveal><h2 className="h-display text-[34px] sm:text-5xl">{a.idea.title}</h2></Reveal>
            <Reveal delay={0.08}><p className="mt-4 max-w-md text-xl text-muted">{a.idea.lead}</p></Reveal>
          </div>
          <Reveal delay={0.1}><SmartImg src={a.idea.img} alt="" className="aspect-[7/2] w-full rounded-3xl" /></Reveal>
        </div>
        <Stagger className="mt-8 grid gap-4 md:grid-cols-3">
          {a.idea.items.map((it) => (
            <StaggerItem key={it.title} className="group flex gap-5 rounded-3xl border border-line bg-white p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:border-cyan/50 hover:shadow-lift">
              <Icon name={it.icon} className="size-11 shrink-0 text-cyan-deep transition-transform duration-500 group-hover:scale-110" strokeWidth={1.4} />
              <div>
                <h3 className="text-xl font-bold leading-tight tracking-tight">{it.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{it.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="bg-white">
        <div className="container-x grid gap-8 py-14 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <Reveal><h2 className="h-display text-[32px] sm:text-[44px]">{a.story.title}</h2></Reveal>
            <Stagger className="mt-8 grid grid-cols-2 gap-4">
              {c.pages.home.stats.slice(0, 2).map((s) => (
                <StaggerItem key={s.label} className="rounded-3xl bg-mist p-6">
                  <div className="h-display bg-linear-to-r from-[#00b6d6] to-[#19d9f7] bg-clip-text text-5xl text-transparent sm:text-6xl">{s.value}</div>
                  <div className="mt-2 text-[15px] text-muted">{s.label}</div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div className="space-y-5 lg:pt-3">
            {a.story.text.map((t, i) => (<Reveal key={i} delay={i * 0.08}><p className={i === 0 ? "text-xl leading-relaxed sm:text-2xl" : "text-[17px] leading-relaxed text-ink/75"}>{t}</p></Reveal>))}
          </div>
        </div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <SectionTitle title={a.video.title} />
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,640px)_1fr]">
          <Reveal><VideoCard poster={a.video.poster} src={old(a.video.src)} label={a.video.title} caption={a.video.caption} /></Reveal>
          <Reveal delay={0.1}>
            <h3 className="h-display text-[26px] sm:text-[34px]">{a.video.sub}</h3>
            <p className="mt-4 text-xl text-muted">{a.video.text}</p>
          </Reveal>
        </div>
      </section>

      <div className="bg-white"><Steps data={c.pages.steps} /></div>
      <DraftBand data={c.pages.draft} />
      <Partners data={c.pages.partners} />

      <section className="border-t border-line bg-white">
        <div className="container-x grid items-center gap-6 py-10 lg:grid-cols-[auto_1fr_auto] lg:gap-12">
          <Reveal><h2 className="h-display max-w-xs text-[30px] sm:text-[38px]">{a.visit.title}</h2></Reveal>
          <Reveal delay={0.06}><p className="max-w-lg text-lg text-muted">{a.visit.text}</p></Reveal>
          <Reveal delay={0.12} className="flex flex-wrap gap-3">
            <ButtonLink href={href(lang, "kontakty")} size="lg">{ui.cta.office}</ButtonLink>
            <RequestButton kind="office" size="lg" variant="outline">{ui.cta.measure}</RequestButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}

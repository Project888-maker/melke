import type { Metadata } from "next";
import Link from "next/link";
import { load, alternates } from "@/lib/page";
import { href } from "@/lib/href";
import { Breadcrumbs, CtaBand, LinkCard, SectionTitle } from "@/components/Sections";
import { Reveal, Stagger, StaggerItem, Parallax } from "@/components/Reveal";
import { RequestButton } from "@/components/RequestProvider";
import { SmartImg } from "@/components/SmartImg";
import { Icon } from "@/components/Icon";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { c } = await load(params);
  return { ...c.pages.accessories.meta, alternates: alternates("aksessuary") };
}

export default async function Accessories({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, ui, c } = await load(params);
  const a = c.accessoriesPage;
  return (
    <>
      <section className="relative isolate overflow-hidden bg-white">
        <Parallax className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[60%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.hero.img} alt="" className="mask-fade-l size-full object-cover opacity-30 lg:opacity-100" />
        </Parallax>
        <div className="container-x pb-12 pt-8 sm:pb-16">
          <Reveal y={10}><Breadcrumbs lang={lang} items={[{ label: ui.home, path: "" }, { label: ui.nav.accessories }]} /></Reveal>
          <Reveal delay={0.06}><h1 className="h-display mt-8 text-[44px] sm:text-6xl lg:text-[68px]">{a.hero.title}</h1></Reveal>
          <Reveal delay={0.12}><p className="h-display mt-3 max-w-md text-[26px] sm:text-4xl">{a.hero.lead}</p></Reveal>
          <Reveal delay={0.18}><p className="mt-4 text-lg text-muted">{a.hero.text}</p></Reveal>
          <Reveal delay={0.26} className="mt-7"><RequestButton kind="consult" size="lg" topic={a.hero.title}>{ui.cta.pick}</RequestButton></Reveal>
        </div>
      </section>

      <div className="sticky top-[104px] z-30 border-y border-line bg-white/85 backdrop-blur-xl">
        <nav className="container-x flex gap-1 overflow-x-auto py-2.5 [scrollbar-width:none]" aria-label={ui.nav.accessories}>
          {c.accessoryChips.map((chip) => (
            <a key={chip.id} href={`#${chip.id}`} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[15px] transition hover:bg-cyan/15">
              <Icon name={chip.icon} className="size-[18px] text-cyan-deep" />
              {chip.label}
            </a>
          ))}
        </nav>
      </div>

      <section id="safety" className="scroll-mt-40">
        <div className="cyan-band">
          <div className="container-x py-10 sm:py-12">
            <Reveal><h2 className="h-display max-w-xl text-[30px] sm:text-[40px]">{a.safety.title}</h2></Reveal>
            <Reveal delay={0.08}><p className="mt-3 text-lg text-ink/70">{a.safety.lead}</p></Reveal>
          </div>
        </div>
        <div className="container-x py-8">
          <Stagger className="grid gap-5 md:grid-cols-3">
            {a.safety.items.map((it) => (
              <StaggerItem key={it.title} className="group overflow-hidden rounded-3xl border border-line bg-white transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1.5 hover:shadow-lift">
                <SmartImg src={it.img} alt={it.title} className="aspect-[16/10] w-full" imgClassName="group-hover:scale-105" />
                <div className="p-6">
                  <h3 className="text-xl font-bold tracking-tight">{it.title}</h3>
                  <p className="mt-1.5 text-[15px] text-muted">{it.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-cyan/12 px-6 py-4">
            <p className="flex items-center gap-3 text-[15px]"><Icon name="info" className="size-5 shrink-0 text-cyan-deep" />{a.safety.note}</p>
            <RequestButton kind="consult" topic={a.safety.cta}>{a.safety.cta}</RequestButton>
          </Reveal>
        </div>
      </section>

      <section id="sills" className="container-x scroll-mt-40 py-12 sm:py-16">
        <SectionTitle title={a.sills.title} lead={a.sills.lead} />
        <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
          {a.sills.items.map((it) => (
            <StaggerItem key={it.title} className="group overflow-hidden rounded-3xl border border-line bg-white transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1.5 hover:shadow-lift">
              <SmartImg src={it.img} alt={it.title} className="aspect-[16/10] w-full" imgClassName="group-hover:scale-105" />
              <h3 className="p-5 text-lg font-bold tracking-tight">{it.title}</h3>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-6 py-4">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
            {a.sills.points.map((pt, i) => (<li key={pt} className="flex items-center gap-2.5"><Icon name={["droplets", "palette", "resize"][i] ?? "check"} className="size-5 text-cyan-deep" />{pt}</li>))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link href={href(lang, `aksessuary/${a.sills.href}`)} className="inline-flex h-12 items-center gap-2 px-2 font-medium underline decoration-cyan decoration-2 underline-offset-4">{ui.more}</Link>
            <RequestButton kind="consult" topic={a.sills.title}>{a.sills.cta}</RequestButton>
          </div>
        </Reveal>
      </section>

      <section id="warm" className="scroll-mt-40 bg-white">
        <div className="container-x grid items-center gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-14">
          <Reveal><SmartImg src={a.warm.img} alt={a.warm.name} className="aspect-square w-full rounded-3xl bg-mist" fit="contain" /></Reveal>
          <div>
            <Reveal><h2 className="h-display text-[32px] sm:text-[44px]">{a.warm.title}</h2></Reveal>
            <Reveal delay={0.06}><p className="mt-3 text-xl text-cyan-deep">{a.warm.name}</p></Reveal>
            <Reveal delay={0.1}><p className="mt-4 text-2xl font-semibold tracking-tight">{a.warm.lead}</p></Reveal>
            <Reveal delay={0.14}><p className="mt-2 max-w-lg text-lg text-muted">{a.warm.text}</p></Reveal>
            <Stagger className="mt-7 space-y-4">
              {a.warm.points.map((pt, i) => (
                <StaggerItem key={pt} className="flex items-center gap-4 text-[17px]">
                  <span className="grid size-11 place-items-center rounded-xl bg-cyan/15 text-cyan-deep"><Icon name={["thermometer", "droplets", "settings"][i] ?? "check"} /></span>
                  {pt}
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.2} className="mt-8"><RequestButton kind="consult" size="lg" topic={a.warm.name}>{a.warm.cta}</RequestButton></Reveal>
            <p className="mt-4 text-[13px] text-muted">{a.warm.note}</p>
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <Stagger className="grid gap-5 md:grid-cols-3">
          {a.trio.map((it) => (
            <StaggerItem key={it.id}>
              <article id={it.id} className="group flex h-full scroll-mt-40 flex-col overflow-hidden rounded-3xl border border-line bg-white transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1.5 hover:shadow-lift">
                <SmartImg src={it.img} alt={it.title} className="aspect-[4/3] w-full" imgClassName="group-hover:scale-105" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[22px] font-bold tracking-tight">{it.title}</h3>
                  <p className="mt-1.5 flex-1 text-[15px] text-muted">{it.text}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <RequestButton kind="consult" topic={it.title}>{it.cta}</RequestButton>
                    {"href" in it && it.href && <Link href={href(lang, `aksessuary/${it.href}`)} className="font-medium underline decoration-cyan decoration-2 underline-offset-4">{ui.more}</Link>}
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="gates" className="night relative isolate scroll-mt-40 overflow-hidden text-white">
        <Parallax className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[58%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.gates.img} alt="" loading="lazy" className="mask-fade-l size-full object-cover opacity-35 lg:opacity-100" />
        </Parallax>
        <div className="container-x py-14 sm:py-20">
          <Reveal><span className="inline-block rounded-full border border-white/20 px-4 py-1.5 text-xs uppercase tracking-[0.14em]">{a.gates.kicker}</span></Reveal>
          <Reveal delay={0.06}><h2 className="h-display mt-5 max-w-md text-[34px] sm:text-5xl">{a.gates.title}</h2></Reveal>
          <Reveal delay={0.12}><p className="mt-4 text-xl text-white/85">{a.gates.lead}</p></Reveal>
          <Reveal delay={0.16}><p className="mt-1.5 text-white/60">{a.gates.text}</p></Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              {a.gates.points.map((pt, i) => (<li key={pt} className="flex items-center gap-2.5"><Icon name={i ? "settings" : "warehouse"} className="size-5 text-cyan" />{pt}</li>))}
            </ul>
          </Reveal>
          <Reveal delay={0.26} className="mt-8"><RequestButton kind="consult" size="lg" topic={a.gates.title}>{a.gates.cta}</RequestButton></Reveal>
        </div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <SectionTitle title={a.moreTitle} lead={a.moreLead} />
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.accessories.map((s) => (
            <StaggerItem key={s.slug}><LinkCard lang={lang} ui={ui} path={`aksessuary/${s.slug}`} title={s.title} kicker={s.kicker} text={s.lead} image={s.img} /></StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand title={a.cta.title} text={a.cta.text} image={c.pages.draft.img}>
        <RequestButton kind="measure" size="lg">{ui.cta.measure}</RequestButton>
      </CtaBand>
    </>
  );
}

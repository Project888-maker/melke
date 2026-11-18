import type { Metadata } from "next";
import { load, alternates } from "@/lib/page";
import { company } from "@/lib/i18n";
import { PageHead } from "@/components/Sections";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { RequestButton } from "@/components/RequestProvider";
import { btn, BtnInner } from "@/components/Button";
import { Icon } from "@/components/Icon";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { c } = await load(params);
  return { ...c.pages.contacts.meta, alternates: alternates("kontakty") };
}

const mapSrc = (lat: number, lon: number) =>
  `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${lon}%2C${lat}%2Cpm2lbm`;

export default async function Contacts({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, ui, c } = await load(params);
  const p = c.pages.contacts;
  const places = [
    { ...p.office, icon: "pin", map: company.officeMap, coords: company.officeCoords },
    { ...p.factory, icon: "factory", map: company.factoryMap, coords: company.factoryCoords },
  ];
  return (
    <>
      <PageHead lang={lang} crumbs={[{ label: ui.home, path: "" }, { label: p.title }]} title={p.title} lead={p.lead} />
      <section className="container-x grid gap-5 pb-8 lg:grid-cols-[1fr_minmax(0,520px)]">
        <div className="grid gap-5">
          <Stagger className="grid gap-5 sm:grid-cols-2">
            {places.map((pl) => (
              <StaggerItem key={pl.title} className="flex flex-col rounded-3xl border border-line bg-white p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-cyan/15 text-cyan-deep"><Icon name={pl.icon} /></span>
                <h2 className="mt-5 text-2xl font-bold tracking-tight">{pl.title}</h2>
                <p className="mt-2 text-[17px] leading-snug">{pl.address}</p>
                <p className="mt-2 flex flex-1 items-start gap-2 text-[15px] text-muted"><Icon name="clock" className="mt-0.5 size-4 shrink-0" />{pl.hours}</p>
                <a href={pl.map} target="_blank" rel="noopener noreferrer" className={`${btn("outline")} mt-6 self-start`}><BtnInner variant="outline">{ui.cta.route}</BtnInner></a>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="grid gap-6 rounded-3xl border border-line bg-white p-7 sm:grid-cols-2">
            <div>
              <h2 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-wider text-muted"><Icon name="phone" className="size-4 text-cyan-deep" />{ui.form.phone}</h2>
              <ul className="mt-3 space-y-1.5">
                {company.phones.map((ph) => (<li key={ph.href}><a href={ph.href} className="text-2xl font-bold tracking-tight transition hover:text-cyan-deep">{ph.label}</a></li>))}
              </ul>
            </div>
            <div className="space-y-5">
              <div>
                <h2 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-wider text-muted"><Icon name="mail" className="size-4 text-cyan-deep" />Email</h2>
                <a href={`mailto:${company.email}`} className="mt-2 block text-xl font-semibold transition hover:text-cyan-deep">{company.email}</a>
              </div>
              <div>
                <h2 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-wider text-muted"><Icon name="send" className="size-4 text-cyan-deep" />{p.messengers}</h2>
                <a href={company.telegram} target="_blank" rel="noopener noreferrer" className="mt-2 block text-xl font-semibold transition hover:text-cyan-deep">t.me/eurotexnogrup</a>
              </div>
            </div>
          </Reveal>
          <Reveal className="rounded-3xl border border-line bg-white p-7">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{p.company.title}</h2>
            <dl className="mt-3 grid gap-x-10 gap-y-2 text-[17px] sm:grid-cols-3">
              <div><dt className="text-[13px] text-muted">{ui.brand}</dt><dd className="font-medium">{p.company.name}</dd></div>
              <div><dt className="text-[13px] text-muted">{lang === "ru" ? "ИНН" : "INN"}</dt><dd className="font-medium">{company.inn}</dd></div>
              <div><dt className="text-[13px] text-muted">{lang === "ru" ? "ОГРН" : "OGRN"}</dt><dd className="font-medium">{company.ogrn}</dd></div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative self-start overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-card sm:p-9 lg:sticky lg:top-32">
          <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#0fd6f5] via-[#7eeafc] to-[#0fd6f5]" />
          <h2 className="h-display text-[28px] sm:text-[34px]">{p.formTitle}</h2>
          <p className="mt-2 text-muted">{p.formLead}</p>
          <div className="mt-6"><ContactForm /></div>
        </Reveal>
      </section>

      <section id="map" className="container-x scroll-mt-28 pb-16">
        <div className="grid gap-5 lg:grid-cols-2">
          {places.map((pl, i) => (
            <Reveal key={pl.title} delay={i * 0.08} className="overflow-hidden rounded-3xl border border-line bg-white">
              <div className="flex items-center justify-between gap-4 px-6 py-4">
                <h2 className="font-semibold">{pl.title}: <span className="font-normal text-muted">{pl.address.replace("Россия, ", "")}</span></h2>
                <a href={pl.map} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm font-medium underline decoration-cyan decoration-2 underline-offset-4">{p.onMap}</a>
              </div>
              <iframe title={`${pl.title}: ${pl.address}`} src={mapSrc(pl.coords[0], pl.coords[1])} loading="lazy" className="h-[340px] w-full border-0 bg-mist" allowFullScreen />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cyan-band">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 py-10">
          <h2 className="h-display max-w-xl text-[28px] sm:text-4xl">{c.pages.about.visit.title}</h2>
          <div className="flex flex-wrap gap-3">
            <RequestButton kind="office" size="lg" variant="dark">{ui.cta.office}</RequestButton>
            <RequestButton kind="measure" size="lg" variant="outline">{ui.cta.measure}</RequestButton>
          </div>
        </div>
      </section>
    </>
  );
}

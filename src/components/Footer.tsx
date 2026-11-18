import Link from "next/link";
import { company, type Locale, type UI } from "@/lib/i18n";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { href } from "@/lib/href";
import type { NavItem } from "./Header";

export function Footer({ lang, ui, nav, address, factory }: { lang: Locale; ui: UI; nav: NavItem[]; address: string; factory: string }) {
  return (
    <footer className="bg-navy text-white/75">
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.1fr_1.4fr_1.3fr] lg:py-14">
        <div>
          <Link href={href(lang)} aria-label={ui.brand}><Logo dark lang={lang} /></Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">{ui.footer.rights}</p>
          <div className="mt-6 flex gap-2.5">
            <a href={company.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="grid size-11 place-items-center rounded-full bg-white/8 text-white transition hover:-translate-y-0.5 hover:bg-cyan hover:text-ink">
              <Icon name="send" className="size-[18px]" />
            </a>
            <a href={`mailto:${company.email}`} aria-label="Email" className="grid size-11 place-items-center rounded-full bg-white/8 text-white transition hover:-translate-y-0.5 hover:bg-cyan hover:text-ink">
              <Icon name="mail" className="size-[18px]" />
            </a>
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          {nav.map((item) => (
            <div key={item.path}>
              <Link href={href(lang, item.path)} className="font-medium text-white transition hover:text-cyan">{item.label}</Link>
              {item.children && (
                <ul className="mt-2.5 space-y-1.5">
                  {item.children.slice(0, 6).map((c) => (
                    <li key={c.path}><Link href={href(lang, c.path)} className="text-sm text-white/55 transition hover:text-cyan">{c.label}</Link></li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        <div className="space-y-4 text-[15px] lg:border-l lg:border-white/12 lg:pl-10">
          <a href={company.officeMap} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition hover:text-white">
            <Icon name="pin" className="mt-0.5 size-5 shrink-0 text-cyan" />
            <span><span className="block text-xs uppercase tracking-wider text-white/45">{ui.footer.office} · {ui.footer.hours}</span>{address}</span>
          </a>
          <a href={company.factoryMap} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition hover:text-white">
            <Icon name="factory" className="mt-0.5 size-5 shrink-0 text-cyan" />
            <span><span className="block text-xs uppercase tracking-wider text-white/45">{ui.footer.factory} · {ui.footer.factoryHours}</span>{factory}</span>
          </a>
          <a href={`mailto:${company.email}`} className="flex gap-3 transition hover:text-white">
            <Icon name="mail" className="mt-0.5 size-5 shrink-0 text-cyan" />
            {company.email}
          </a>
          <div className="flex gap-3">
            <Icon name="phone" className="mt-0.5 size-5 shrink-0 text-cyan" />
            <ul className="space-y-1">
              {company.phones.map((p) => (
                <li key={p.href}><a href={p.href} className="font-medium text-white transition hover:text-cyan">{p.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-5 text-[13px] text-white/45">
          <span>© 2008–{new Date().getFullYear()} {lang === "ru" ? "ООО «Европейские Технологии»" : lang === "de" ? "OOO Europäische Technologien" : "OOO European Technologies"}</span>
          <Link href={href(lang, "politika")} className="transition hover:text-cyan">{ui.form.policy}</Link>
        </div>
      </div>
    </footer>
  );
}

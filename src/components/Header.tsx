"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { locales, localeNames, company, type Locale, type UI } from "@/lib/i18n";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { RequestButton } from "./RequestProvider";
import { cx, href } from "@/lib/href";

export type NavChild = { label: string; path: string; note?: string };
export type NavItem = { label: string; path: string; children?: NavChild[] };

export function Header({ lang, ui, nav }: { lang: Locale; ui: UI; nav: NavItem[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setMenu(false); setOpenDrop(null); setLangOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  const isActive = (path: string) => rest === `/${path}` || rest.startsWith(`/${path}/`);
  const setLangCookie = (l: string) => { document.cookie = `lang=${l};path=/;max-age=31536000;samesite=lax`; };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-navy text-white/80">
        <div className="container-x flex h-9 items-center justify-between text-[13px]">
          <span className="inline-flex items-center gap-2">
            <Icon name="pin" className="size-4 text-cyan" />
            {ui.region}
          </span>
          <div className="relative">
            <button
              type="button" onClick={() => setLangOpen((v) => !v)} aria-expanded={langOpen} aria-label={ui.language}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium uppercase tracking-wide text-white/90 transition hover:text-cyan"
            >
              <Icon name="globe" className="size-4" />
              {lang}
              <Icon name="chevron" className={cx("size-3.5 transition-transform", langOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-full z-10 mt-1.5 w-40 overflow-hidden rounded-xl bg-white p-1.5 text-ink shadow-card ring-1 ring-line"
                >
                  {locales.map((l) => (
                    <li key={l}>
                      <Link
                        href={`/${l}${rest}`} hrefLang={l} onClick={() => setLangCookie(l)}
                        className={cx("flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-mist", l === lang && "font-semibold")}
                      >
                        {localeNames[l]}
                        {l === lang && <Icon name="check" className="size-4 text-cyan-deep" />}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className={cx("border-b transition-[background-color,box-shadow,border-color] duration-300", scrolled ? "border-line bg-white/85 shadow-[0_10px_30px_-18px_rgb(13_27_39/0.35)] backdrop-blur-xl" : "border-transparent bg-white")}>
        <div className="container-x flex h-[68px] items-center justify-between gap-6">
          <Link href={href(lang)} aria-label={ui.brand} className="shrink-0 transition-opacity hover:opacity-80">
            <Logo lang={lang} />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <div
                key={item.path} className="relative"
                onMouseEnter={() => item.children && setOpenDrop(item.path)}
                onMouseLeave={() => setOpenDrop(null)}
              >
                <Link
                  href={href(lang, item.path)}
                  className={cx("relative inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg px-3 text-[15px] transition-colors hover:text-cyan-deep", isActive(item.path) && "font-medium")}
                  onFocus={() => item.children && setOpenDrop(item.path)}
                >
                  {item.label}
                  {item.children && <Icon name="chevron" className={cx("size-4 transition-transform duration-300", openDrop === item.path && "rotate-180")} />}
                  {isActive(item.path) && <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-cyan" />}
                </Link>
                <AnimatePresence>
                  {item.children && openDrop === item.path && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-0 top-full w-[320px] pt-2"
                    >
                      <ul className="overflow-hidden rounded-2xl bg-white p-2 shadow-card ring-1 ring-line">
                        {item.children.map((c) => (
                          <li key={c.path}>
                            <Link href={href(lang, c.path)} className="group flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 transition hover:bg-mist">
                              <span>
                                <span className="block text-[15px] font-medium">{c.label}</span>
                                {c.note && <span className="block text-[13px] text-muted">{c.note}</span>}
                              </span>
                              <Icon name="arrow" className="size-4 -translate-x-1 text-cyan-deep opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={company.phoneHref} className="hidden items-center gap-2 whitespace-nowrap text-[17px] font-semibold transition hover:text-cyan-deep sm:inline-flex">
              <Icon name="phone" className="size-5 text-cyan-deep" />
              {company.phone}
            </a>
            <a href={company.phoneHref} aria-label={ui.cta.call} className="grid size-11 place-items-center rounded-xl bg-cyan/15 text-cyan-deep sm:hidden">
              <Icon name="phone" />
            </a>
            <button type="button" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-label={menu ? ui.closeMenu : ui.openMenu} className="grid size-11 place-items-center rounded-xl border border-line lg:hidden">
              <Icon name={menu ? "x" : "menu"} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-104px)] overflow-y-auto bg-white lg:hidden"
          >
            <nav className="container-x flex flex-col py-4" aria-label="Mobile">
              {nav.map((item, i) => (
                <motion.div key={item.path} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }} className="border-b border-line py-1">
                  <Link href={href(lang, item.path)} className="flex items-center justify-between py-3 text-xl font-semibold tracking-tight">
                    {item.label}
                    <Icon name="arrow" className="size-5 text-cyan-deep" />
                  </Link>
                  {item.children && (
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pb-3">
                      {item.children.map((c) => (
                        <li key={c.path}><Link href={href(lang, c.path)} className="block py-1.5 text-[15px] text-muted">{c.label}</Link></li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
              <div className="mt-6 grid gap-3">
                <RequestButton kind="measure" size="lg" block>{ui.cta.measure}</RequestButton>
                <a href={company.phoneHref} className="flex h-14 items-center justify-center gap-2 rounded-xl border border-line text-lg font-semibold">
                  <Icon name="phone" className="text-cyan-deep" />
                  {company.phone}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

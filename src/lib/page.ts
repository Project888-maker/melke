import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { getUI, isLocale, locales, type Locale } from "./i18n";

/** Resolves the language of a request and loads its strings and content. */
export async function load(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { lang: lang as Locale, ui: getUI(lang), c: getContent(lang) };
}

export const langParams = () => locales.map((lang) => ({ lang }));

export function alternates(path = "") {
  const p = path ? `/${path}` : "";
  return {
    canonical: `/ru${p}`,
    languages: Object.fromEntries(locales.map((l) => [l, `/${l}${p}`])),
  };
}

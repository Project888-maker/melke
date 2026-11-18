import type { Locale } from "@/lib/i18n";
import { content as ru, type Content } from "./ru";
import { content as en } from "./en";
import { content as de } from "./de";

/** Page content per language. */
const byLocale = { ru, en, de } as unknown as Record<Locale, Content>;

export const getContent = (lang: Locale): Content => byLocale[lang] ?? ru;
export type { Content };

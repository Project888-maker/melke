import type { Locale } from "@/lib/i18n";
import { content as ru, type Content } from "./ru";

/**
 * Page content per language. English and German fall back to Russian
 * until their translations are added in src/content/en and src/content/de.
 */
const byLocale: Partial<Record<Locale, Content>> = { ru };

export const getContent = (lang: Locale): Content => byLocale[lang] ?? ru;
export type { Content };

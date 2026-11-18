import type { Locale } from "./i18n";
export const href = (lang: Locale | string, path = "") =>
  `/${lang}${path && !path.startsWith("/") ? "/" : ""}${path}`.replace(/\/$/, "") || `/${lang}`;
export const cx = (...v: (string | false | null | undefined)[]) => v.filter(Boolean).join(" ");

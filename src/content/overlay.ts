import type { Solution, CaseStudy, NewsItem } from "./types";

/**
 * Translations reuse the Russian entries for everything that is not text
 * (slugs, images, photo lists, years) and replace only the wording.
 */
export type SectionText = { title?: string; text?: string[]; list?: string[]; imgAlt?: string };
export type SolutionText = { title: string; kicker: string; lead: string; specs?: { value: string; label: string }[]; sections: SectionText[] };

export function overlaySolutions(ru: Solution[], t: Record<string, SolutionText>): Solution[] {
  return ru.map((s) => {
    const x = t[s.slug];
    if (!x) return s;
    return {
      ...s,
      title: x.title,
      kicker: x.kicker,
      lead: x.lead,
      specs: x.specs ?? s.specs,
      sections: s.sections.map((sec, i) => {
        const tr = x.sections[i] ?? {};
        return { img: sec.img, imgAlt: tr.imgAlt ?? sec.imgAlt, title: tr.title, text: tr.text, list: tr.list };
      }),
    };
  });
}

export type CaseText = { title: string; place?: string; text?: string[]; specs?: string[] };
export function overlayCases(ru: CaseStudy[], t: Record<string, CaseText>, tags: Record<string, string>): CaseStudy[] {
  return ru.map((c) => {
    const x = t[c.slug];
    const base = { ...c, tags: c.tags.map((tag) => tags[tag] ?? tag) };
    return x ? { ...base, title: x.title, place: x.place, text: x.text, specs: x.specs } : base;
  });
}

export type NewsText = { date: string; title: string; lead: string; blocks: { title?: string; text?: string[]; list?: string[]; linkLabel?: string }[] };
export function overlayNews(ru: NewsItem[], t: Record<string, NewsText>): NewsItem[] {
  return ru.map((n) => {
    const x = t[n.slug];
    if (!x) return n;
    return {
      ...n,
      date: x.date,
      title: x.title,
      lead: x.lead,
      blocks: n.blocks.map((b, i) => {
        const tr = x.blocks[i] ?? {};
        return { img: b.img, title: tr.title, text: tr.text, list: tr.list, link: b.link ? { href: b.link.href, label: tr.linkLabel ?? b.link.label } : undefined };
      }),
    };
  });
}

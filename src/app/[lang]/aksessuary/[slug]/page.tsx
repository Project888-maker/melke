import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { load, alternates } from "@/lib/page";
import { getContent } from "@/content";
import { locales } from "@/lib/i18n";
import { DetailPage } from "@/components/DetailPage";

type P = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => getContent(lang).accessories.map((s) => ({ lang, slug: s.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const { c } = await load(params);
  const s = c.accessories.find((x) => x.slug === slug);
  return s ? { title: s.title, description: s.lead, alternates: alternates(`aksessuary/${slug}`) } : {};
}

export default async function AccessoryPage({ params }: P) {
  const { slug } = await params;
  const { lang, ui, c } = await load(params);
  const item = c.accessories.find((x) => x.slug === slug);
  if (!item) notFound();
  return (
    <DetailPage
      lang={lang} ui={ui} c={c} item={item} base="aksessuary"
      crumbs={[{ label: ui.home, path: "" }, { label: ui.nav.accessories, path: "aksessuary" }, { label: item.title }]}
      siblings={c.accessories.filter((x) => x.slug !== slug)}
    />
  );
}

import type { Metadata, Viewport } from "next";
import { greeting } from "@/lib/assistant/brain";
import type { ReactNode } from "react";
import "@fontsource-variable/onest";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RequestProvider } from "@/components/RequestProvider";
import { DraftWidget } from "@/components/DraftWidget";
import { buildNav } from "@/lib/nav";
import { load, langParams } from "@/lib/page";

export const generateStaticParams = langParams;
export const viewport: Viewport = { themeColor: "#0d1b27", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { c, ui } = await load(params);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://eurotexno.ru"),
    title: { default: c.pages.home.meta.title, template: `%s — ${ui.brand}` },
    description: c.pages.home.meta.description,
    openGraph: { type: "website", siteName: ui.brand },
  };
}

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang, ui, c } = await load(params);
  const nav = buildNav(ui, c);
  const quiz = c.pages.quiz;
  return (
    <html lang={lang} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <RequestProvider ui={ui} lang={lang} systems={c.systems.map((s) => s.name)} objects={Object.values(quiz.objectLabels)}>
          <Header lang={lang} ui={ui} nav={nav} />
          <main className="flex-1">{children}</main>
          <Footer lang={lang} ui={ui} nav={nav} address={c.pages.contacts.office.address} factory={c.pages.contacts.factory.address} />
          <DraftWidget lang={lang} ui={ui} quiz={quiz} avatar="/img/draft-avatar.webp" greeting={greeting[lang]} />
        </RequestProvider>
      </body>
    </html>
  );
}

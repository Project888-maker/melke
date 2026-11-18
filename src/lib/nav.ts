import type { Content } from "@/content";
import type { UI } from "./i18n";
import type { NavItem } from "@/components/Header";

export function buildNav(ui: UI, c: Content): NavItem[] {
  return [
    { label: ui.nav.solutions, path: "resheniya", children: c.solutions.map((s) => ({ label: s.title, path: `resheniya/${s.slug}`, note: s.kicker })) },
    { label: ui.nav.windows, path: "okna", children: c.systems.map((s) => ({ label: s.name, path: `okna/${s.slug}`, note: `${s.width}, ${s.chambers}` })) },
    { label: ui.nav.accessories, path: "aksessuary", children: c.accessories.map((s) => ({ label: s.title, path: `aksessuary/${s.slug}`, note: s.kicker })) },
    { label: ui.nav.projects, path: "proekty" },
    { label: ui.nav.about, path: "o-kompanii" },
    { label: ui.nav.contacts, path: "kontakty" },
  ];
}

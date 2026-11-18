import type { WindowSystem } from "../types";
import { systems as ru } from "../ru/systems";

const colors = [
  { name: "Weiß", desc: "Klassisch und vielseitig", swatch: ru[0].colors[0].swatch },
  { name: "Anthrazit", desc: "Modern und ausdrucksstark", swatch: ru[0].colors[1].swatch },
  { name: "Holz", desc: "Natürliche Ästhetik", swatch: ru[0].colors[2].swatch },
];

export const compareRows: { key: string; label: string }[] = [
  { key: "width", label: "Bautiefe, mm" },
  { key: "frame", label: "Kammern im Rahmen" },
  { key: "sash", label: "Kammern im Flügel" },
  { key: "glass", label: "Verglasung, mm" },
  { key: "seals", label: "Dichtungsebenen" },
  { key: "use", label: "Am besten geeignet für" },
];

export const categories = [
  { key: "all", label: "Alle Systeme" },
  { key: "warm", label: "Mehr Wärme" },
  { key: "universal", label: "Universell" },
  { key: "compact", label: "Kompakt" },
] as const;

const ctaTitle = "Wir fertigen ET-Fenster für Ihre Aufgabe.";
const ctaText =
  "Wir stellen die optimale Ausstattung zusammen und helfen bei der Farbwahl. Kostenloses Aufmaß in Kaliningrad und im Gebiet.";
const colorsNote = "Die Verfügbarkeit der Farbe klären wir bei der Kalkulation.";

const text: Record<string, Partial<WindowSystem>> = {
  centum: {
    badge: { text: "Mehr Wärme", tone: "peach" },
    short: "Maximaler Komfort und Energieeffizienz für Ihr Zuhause.",
    width: "80 / 100 mm",
    chambers: "6 / 7 Kammern",
    chambersLabel: "Kammern in Rahmen / Flügel",
    heroTitle: "aus dem Profil Melke Centum",
    heroLead: "Wärme und Ruhe für das Haus auf dem Land.",
    heroNote: "Ein Premiumsystem für Häuser und Landhäuser.",
    stats: [
      { value: "80 / 100 mm", label: "Rahmen / Flügel" },
      { value: "6 / 7 Kammern", label: "Im Rahmen / im Flügel" },
      { value: "bis 50 mm", label: "Verglasung" },
    ],
    sectionTitle: "Wärme, die im Haus bleibt",
    sectionLead:
      "Melke Centum bietet herausragende Schall- und Wärmedämmung und beseitigt Wärmeverluste wirksam.",
    features: [
      { title: "Rahmen 80 mm, Flügel 100 mm", text: "Sechskammerrahmen und Siebenkammerflügel.", img: ru[0].features[0].img },
      { title: "Drei Dichtungsebenen", text: "Schutz vor Wind, Feuchtigkeit und Straßenlärm.", img: ru[0].features[1].img },
      { title: "Verglasung bis 50 mm", text: "Den Glasaufbau wählen wir passend zur Lage Ihres Hauses.", img: ru[0].features[2].img },
    ],
    about: [
      "Melke Centum ist ein Premiumsystem, das auf dem russischen Markt für Kunststofffenster einzigartig ist.",
      "Ein 80 mm tiefer Sechskammerrahmen, ein 100 mm tiefer Siebenkammerflügel, drei Dichtungsebenen und eine 50 mm starke Verglasung schützen das Haus bei jedem Wetter. Es ist die beste Lösung für die Verglasung von Landhäusern: Die Fenster beseitigen Wärmeverluste und fügen sich harmonisch in ein modernes Interieur ein.",
    ],
    interiorTitle: "Für das Haus. Für die Familie. Für lange Zeit.",
    interiorText:
      "ET-Fenster aus dem Profil Melke Centum halten die Wärme im Haus und unterstreichen seine Architektur. Melke Centum bewahrt die Wärme Ihrer Liebsten, auch wenn sie weit weg sind.",
    compare: { width: "80 / 100", frame: "6", sash: "7", glass: "bis 50", seals: "3", use: "Landhaus, Cottage" },
  },
  evolution: {
    badge: { text: "Bestseller", tone: "pink" },
    short: "Eine zuverlässige Lösung mit ausgezeichneten Kennwerten und modernem Design.",
    width: "70 mm",
    chambers: "5 Kammern",
    chambersLabel: "Kammern in Rahmen / Flügel",
    heroTitle: "aus dem Profil Melke Evolution",
    heroLead: "Komfort für jeden Tag.",
    heroNote: "Ein universelles System für Wohnung und Landhaus.",
    stats: [
      { value: "70 mm", label: "Bautiefe" },
      { value: "5 Kammern", label: "In Rahmen und Flügel" },
      { value: "Nach Ihrem Projekt", label: "Farbe und Ausstattung" },
    ],
    sectionTitle: "Worauf es bei Ihren Fenstern ankommt",
    sectionLead:
      "Das Profilsystem Melke Evolution und hochwertige Komponenten machen ET-Fenster jeden Tag angenehm in der Nutzung.",
    features: [
      { title: "Profil 70 mm", text: "Fünfkammeraufbau des Profils.", img: ru[1].features[0].img },
      { title: "Verglasung nach Bedarf", text: "Ausgewählt nach Lage des Hauses und Ihren Wünschen.", img: ru[1].features[1].img },
      { title: "Bequemes Öffnen", text: "Flügel, Griffe und Beschläge stimmen wir mit Ihnen ab.", img: ru[1].features[2].img },
    ],
    about: [
      "Ein Fünfkammerprofil mit 3 mm starken Außenwänden, eine Dichtung aus thermoplastischem Elastomer und eine Dreifachverglasung halten Wärme und Ruhe im Raum.",
      "Melke Evolution eignet sich für Wohnungen mit Zentralheizung (mit Zweifachverglasung) ebenso wie für Einfamilienhäuser. Eine 40 mm starke Dreifachverglasung hält im Winter die Wärme und schützt im Sommer vor Hitze.",
      "Die Cool-Colours-Technologie erhält Farbtiefe und Festigkeit des Materials über viele Jahre.",
    ],
    interiorTitle: "Für die Wohnung. Für das Haus. Für Sie.",
    interiorText:
      "ET-Fenster aus dem Profil Melke Evolution fügen sich harmonisch in jedes Interieur ein und sorgen für Komfort und Ruhe in der Stadtwohnung wie im Landhaus.",
    compare: { width: "70", frame: "5", sash: "5", glass: "bis 40", seals: "—", use: "Wohnung, Einfamilienhaus" },
  },
  "smart-ultra": {
    badge: { text: "Neues System", tone: "lime" },
    short: "Ein modernes System mit verbesserten Kennwerten für neue Projekte.",
    width: "65 mm",
    chambers: "4 Kammern",
    chambersLabel: "Kammern in Rahmen / Flügel",
    heroTitle: "aus dem Profil Melke Smart Ultra",
    heroLead: "Ein modernes System für Wohnung und Landhaus.",
    heroNote: "Wir fertigen ET-Fenster aus Melke-Profilen.",
    stats: [
      { value: "65 mm", label: "Bautiefe" },
      { value: "4 Kammern", label: "In Rahmen und Flügel" },
      { value: "28 / 36 mm", label: "Verglasung" },
    ],
    sectionTitle: "Bis ins Detail durchdacht",
    sectionLead:
      "Moderne Technik und hochwertige Komponenten sorgen dafür, dass ET-Fenster aus dem Profil Melke Smart Ultra über Jahre komfortabel und zuverlässig bleiben.",
    features: [
      { title: "Profil 65 mm", text: "Vierkammeraufbau des Profils.", img: ru[2].features[0].img },
      { title: "Auswahl der Verglasung", text: "Die Ausstattung stimmen wir auf Ihr Haus ab.", img: ru[2].features[1].img },
      { title: "Farbe passend zum Interieur", text: "Wir zeigen Ihnen die verfügbaren Oberflächen.", img: ru[2].features[2].img },
    ],
    about: [],
    interiorTitle: "Ihr Interieur. Ihr Charakter.",
    interiorText:
      "ET-Fenster aus dem Profil Melke Smart Ultra passen zu jedem Architekturstil. Wählen Sie die Farbe, die den Charakter Ihres Hauses unterstreicht.",
    compare: { width: "65", frame: "4", sash: "4", glass: "28 / 36", seals: "—", use: "Neue Projekte, Wohnung" },
  },
};

export const systems: WindowSystem[] = ru.map((s) => ({
  ...s,
  ...text[s.slug],
  colors: s.slug === "smart-ultra" ? [colors[0], colors[1], { ...colors[2], name: "Holzoptik" }] : colors,
  colorsNote,
  ctaTitle,
  ctaText,
}));

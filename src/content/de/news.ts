import { news as ru } from "../ru/news";
import { overlayNews } from "../overlay";

export const news = overlayNews(ru, {
  "centr-podderzhki-predprinimatelstva": {
    date: "2025-06-14",
    title: "Businessplan für den Ausbau der Produktion",
    lead: "Mit Unterstützung des Zentrums für Unternehmensförderung des Kaliningrader Gebiets hat das Unternehmen einen Businessplan für Ausbau und Modernisierung der Produktion erarbeitet.",
    blocks: [
      {
        text: [
          "Mit Unterstützung des Zentrums für Unternehmensförderung des Kaliningrader Gebiets hat Europäische Technologien einen Businessplan für den Ausbau und die Modernisierung der Produktion entwickelt.",
          "Wir danken den Mitarbeitern des Zentrums für die schnelle und professionelle Arbeit. Die Zusammenarbeit mit dem Zentrum möchten wir weiter ausbauen.",
        ],
        linkLabel: "Zentrum «Mein Business»",
      },
    ],
  },
  "seminar-tendencii-okonnyh-sistem": {
    date: "2025-04-23",
    title: "Seminar «Entwicklungstrends moderner Fenstersysteme»",
    lead: "Das Unternehmen veranstaltete in Kaliningrad ein Seminar für Fachleute der Fensterbranche.",
    blocks: [
      {
        text: [
          "Am 23. April 2025 veranstaltete Europäische Technologien im Konferenzsaal des Hotels Radisson in Kaliningrad ein Seminar für Fachleute der Fensterbranche. Im Mittelpunkt standen moderne Lösungen für Fenstersysteme, Aluminiumkonstruktionen und Verglasungstechnik.",
          "Vertreten waren führende Hersteller und Lieferanten von Profil- und Beschlaglösungen: Melke, Siegenia, RALUMA und GlassCom.",
        ],
      },
      {
        title: "COOL-COLORS-Beschichtung von Melke",
        text: ["Melke stellte seine weiterentwickelten PVC-Profile vor. Besonders hervorgehoben wurde die Beschichtung COOL COLORS: eine Technologie, mit der Profile ihr Aussehen länger behalten und Erwärmung und Ausbleichen durch Sonnenlicht besser widerstehen."],
      },
      {
        title: "Fensterbeschläge von Siegenia",
        text: ["Siegenia zeigte die neuesten Entwicklungen bei Fensterbeschlägen: Systeme, die Funktionalität, Sicherheit und Komfort verbinden."],
      },
      {
        title: "Pergolen und rahmenlose Verglasung von RALUMA",
        list: [
          "Pergolen und bioklimatische Dächer für Terrassen und Außenbereiche",
          "Rahmenlose Verglasung mit dem Effekt völliger Transparenz",
          "Trennwände und Öffnungssysteme: Lift, Slide und Faltanlage",
        ],
      },
      {
        title: "Isolierglas der neuen Generation von GlassCom",
        text: ["GlassCom präsentierte das Isolierglas EnergyLight, das gemeinsam mit dem Abstandhalter Chromatech entwickelt wurde. Die Kombination sorgt für Energieeffizienz, Lichtdurchlässigkeit und Langlebigkeit."],
      },
      {
        text: ["Das Seminar bot Gelegenheit zum Erfahrungsaustausch, zum Gespräch mit Fachleuten der Branche und zum Kennenlernen der neuesten Entwicklungen bei Kunststofffenstern, Beschlägen und Architekturverglasung."],
      },
    ],
  },
});

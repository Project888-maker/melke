import { solutions as ru } from "../ru/solutions";
import { overlaySolutions } from "../overlay";

export const solutionGroups = [
  { key: "profiles", label: "Profilsysteme" },
  { key: "doors", label: "Türen und Portale" },
  { key: "glazing", label: "Verglasung" },
] as const;

export const solutions = overlaySolutions(ru, {
  "melke-lite-60": {
    title: "Melke Lite 60",
    kicker: "Melke-Profil",
    lead: "Ein leichtes Dreikammerprofil für die wirtschaftliche Verglasung von Balkonen, Loggien, Terrassen und Gartenhäusern.",
    specs: [
      { value: "60 mm", label: "Bautiefe" },
      { value: "3 Kammern", label: "Profilaufbau" },
      { value: "Klasse A", label: "Luft- und Wasserdichtheit" },
    ],
    sections: [
      {
        title: "Stabil bei geringem Gewicht",
        text: [
          "Das leichte Dreikammerprofil Melke Lite 60 mit 60 mm Bautiefe wird im CO-EX-Verfahren (Coextrusion) hergestellt und ist besonders stabil.",
          "Die Fenster erreichen die höchste Klasse A für Luft- und Wasserdichtheit nach GOST 26602.2-99 und trotzen Kälte, Hitze, Wind und Lärm.",
        ],
      },
      { title: "Einsatzbereiche", list: ["Unbeheizte Balkone und Loggien", "Terrassen und Veranden", "Gartenhäuser"] },
      {
        title: "Über das Melke-Werk",
        imgAlt: "Melke-Werk in Frjasino",
        text: [
          "Das Melke-Werk befindet sich in Frjasino, 30 km von Moskau entfernt. Das Profil ist für energieeffiziente Fenster und Türen ausgelegt: Es verringert Wärmeverluste, sorgt für ein gesundes Raumklima und verbessert den Schallschutz.",
          "Laut sanitär-epidemiologischem Gutachten eignen sich Melke-Fenstersysteme für die Verglasung aller Gebäudekategorien, einschließlich medizinischer Einrichtungen, Schulen und Kindergärten.",
        ],
      },
    ],
  },
  aluplast: {
    title: "Aluplast-Profil",
    kicker: "Deutsches Profilsystem",
    lead: "Die Systeme IDEAL 4000 und IDEAL 8000 für die Verglasung von Häusern und Wohnungen.",
    specs: [
      { value: "70 / 85 mm", label: "Bautiefe" },
      { value: "5 / 6 Kammern", label: "IDEAL 4000 / 8000" },
      { value: "bis 48 dB", label: "Schallschutz IDEAL 8000" },
    ],
    sections: [
      {
        title: "Über den Hersteller",
        imgAlt: "Aluplast-Produktion",
        text: [
          "Aluplast ist ein führender Hersteller von PVC-Profilsystemen für Fenster und Türen. Das Familienunternehmen wurde im Dezember 1982 von Manfred J. Seitz in Ettlingen gegründet. Hauptsitz und Stammwerk befinden sich in Karlsruhe.",
          "Die Gruppe verfügt über 24 Produktions- und Vertriebsniederlassungen. 2016 wurde Aluplast als eines der innovativsten mittelständischen Unternehmen mit dem TOP100-Preis ausgezeichnet.",
        ],
      },
      {
        title: "System IDEAL 4000",
        imgAlt: "Aluplast-Profil IDEAL 4000",
        text: ["Edle Schlichtheit, klare und fließende Linien. Die glatte Oberfläche und elegante 15-Grad-Schrägen verleihen dem Haus ein attraktives Erscheinungsbild."],
        list: [
          "5-Kammer-Profilsystem",
          "Bautiefe 70 mm",
          "Verglasung bis 41 mm",
          "Wärmedurchlasswiderstand des Profils 0,77 m²·°C/W",
          "2 Dichtungsebenen",
          "Temperaturbereich von −60 bis +70 °C",
          "Große Farbauswahl, austauschbare Dichtungen",
          "Umweltfreundliches, bleifreies Profil",
        ],
      },
      {
        title: "System IDEAL 8000",
        imgAlt: "Aluplast-Profil IDEAL 8000",
        text: ["Ein System mit hervorragendem Schallschutz und erhöhter Einbruchhemmung des Fensterrahmens."],
        list: [
          "6-Kammer-Profilsystem",
          "Bautiefe 85 mm",
          "Verglasung bis 51 mm",
          "Wärmedurchlasswiderstand des Profils 1,0 m²·°C/W",
          "Schallschutz bis 48 dB",
          "3 Dichtungsebenen",
          "Temperaturbereich von −60 bis +70 °C",
          "Umweltfreundliches, bleifreies Profil",
        ],
      },
    ],
  },
  wital: {
    title: "WITAL-Profil",
    kicker: "Polnisches Profilsystem",
    lead: "Die Systeme WITAL STANDART und WITAL PRESTIGE TERM mit Sechskammerprofil.",
    specs: [
      { value: "6 Kammern", label: "Profilaufbau" },
      { value: "86 mm", label: "Bautiefe PRESTIGE TERM" },
      { value: "bis 52 mm", label: "Verglasung" },
    ],
    sections: [
      {
        title: "Über den Hersteller",
        text: [
          "WITAL-Kunststoffprofile werden in Gołdap in Polen hergestellt. Das Unternehmen arbeitet mit führenden Rohstofflieferanten aus Deutschland, Großbritannien, den USA, Österreich, den Niederlanden, Belgien, Schweden, Italien und Polen zusammen.",
          "Europäische Technologien fertigt Fenster aus zwei Systemen: WITAL STANDART und WITAL PRESTIGE TERM.",
        ],
      },
      {
        title: "WITAL STANDART",
        imgAlt: "Profil WITAL STANDART",
        list: [
          "Sechskammerprofil und Dreifachverglasung: hohe Wärme- und Schalldämmung",
          "Abgerundete Formen und eine breite Armierungskammer",
          "8 mm Überschlag zwischen Rahmen und Flügel schützt vor Zugluft, Staub und Wasser",
          "13-mm-Beschlagnut ermöglicht einbruchhemmende Beschläge",
          "Wärmedurchlasswiderstand des Fensters Ro = 0,87 m²·°C/W (36-mm-Verglasung mit warmer Kante)",
          "Vier durchgefärbte Profilfarben und 38 Dekorfolien",
          "Türsysteme sind mit den Fenstersystemen kompatibel",
        ],
      },
      {
        title: "WITAL PRESTIGE TERM",
        imgAlt: "Profil WITAL PRESTIGE TERM",
        list: [
          "Sechskammerprofil mit 86 mm Bautiefe",
          "Verglasung bis 52 mm und zusätzliche Mitteldichtung in Rahmen und Flügel",
          "Verstärkte Befestigungspunkte der Bänder",
          "Wärmedurchlasswiderstand des Fensters Ro = 1,06 m²·°C/W (48-mm-Verglasung mit warmer Kante)",
          "Profile der Klassen A und B",
          "Große Auswahl an Dekorfolien",
        ],
      },
    ],
  },
  "dveri-hst": {
    title: "HST-Türen",
    kicker: "Hebe-Schiebe-Portale",
    lead: "Große Glastüren, die die Grenze zwischen Haus und Garten aufheben.",
    specs: [
      { value: "bis 6500 mm", label: "Breite der Anlage" },
      { value: "bis 3000 mm", label: "Höhe der Anlage" },
      { value: "bis 51 mm", label: "Verglasung" },
    ],
    sections: [
      {
        title: "Was HST bedeutet",
        text: [
          "Die Hebe-Schiebe-Tür ist ein ausgereiftes Schiebetürsystem, das sich in Deutschland und Europa seit Jahrzehnten bewährt. Eine HST-Tür verbindet hervorragende Dämmwerte mit Ästhetik.",
          "Der Griff macht das Öffnen mühelos, die flache Schwelle stört nicht beim Durchgehen. Solche Türen lassen deutlich mehr Licht ins Haus als ein gewöhnliches Fenster.",
        ],
      },
      {
        title: "Vorteile",
        list: [
          "Einfache Bedienung und ein fein abgestimmter Laufmechanismus",
          "Barrierefreier Übergang: niedrige Schwelle",
          "Sechskammerflügel 85 mm, Rahmenbreite 207 mm",
          "Hervorragender Wärmedämmwert",
          "Zentralverriegelung mit dreifacher Dichtungstechnik",
          "Hohe Dichtheit, Klasse 1",
        ],
      },
      {
        title: "Wo sie passen",
        text: [
          "Hebe-Schiebe-Türen eignen sich für Neubauten ebenso wie für die Sanierung älterer Häuser. Sie verleihen verglasten Terrassen, Balkonen und Pavillons Charme und kommen überall zum Einsatz, wo eine großzügige, barrierefreie Öffnung wichtig ist.",
        ],
      },
    ],
  },
  "balkony-i-lodzhii": {
    title: "Balkone und Loggien",
    kicker: "Warm- und Kaltverglasung",
    lead: "Wir verglasen Balkone und Loggien mit Aluminium- und Kunststoffrahmen.",
    specs: [
      { value: "10–12 dBA", label: "Lärmminderung" },
      { value: "5–8 °C", label: "Wärmer als draußen" },
      { value: "2,5-mal", label: "Leichter als Kunststoffrahmen" },
    ],
    sections: [
      {
        title: "Warm oder kalt",
        text: [
          "Eine Warmverglasung hat einen Wärmedurchlasswiderstand von mindestens 0,35 m²·°C/W. Dafür werden Kunststoffrahmen mit Zweifach- oder Dreifachverglasung eingesetzt; Brüstung, Boden und Decke müssen gedämmt werden.",
          "Eine Kaltverglasung schützt den Balkon vor Niederschlag, senkt Lärm und Staub im angrenzenden Raum und verbessert dessen Wärmeschutz.",
        ],
      },
      {
        title: "Was zur Verglasung gehört",
        text: [
          "Im weiteren Sinne umfasst sie den gesamten Umbau des Balkons: Vordach und Fensterbankblech, das Versetzen der Rahmen vor die Brüstung, Innenausbau, Schränke, Außenverkleidung und bei Bedarf ein Dach.",
        ],
      },
      {
        title: "Arten von Flügeln",
        list: [
          "Festverglasung (nicht öffenbar)",
          "Drehflügel: beste Dichtheit und bester Schallschutz, öffnen nach innen",
          "Dreh-Kipp-Flügel",
          "Schiebeflügel: laufen entlang der Brüstung, sparen Platz und sind deutlich leichter",
        ],
      },
      {
        title: "Aluminiumsystem Provedal",
        imgAlt: "Schiebeverglasung Provedal",
        text: [
          "Für die Kaltverglasung bieten wir das System Provedal, Serie C640. Die Flügel laufen auf zwei Schienen mit einstellbaren Rollen und werden mit 4 oder 5 mm Glas gefüllt. Ein Element kann zwei bis sechs Flügel haben, Schnappverschlüsse sichern sie, Bürstendichtungen halten Staub ab und dämpfen Geräusche.",
          "Aluminiumsysteme belasten die Balkonplatte fast 2,5-mal weniger als Kunststoffrahmen und eignen sich daher für ältere Wohnhäuser und kleine Balkone. Ebenso verglasen wir Pavillons und Terrassen.",
        ],
      },
    ],
  },
  "alyuminievoe-osteklenie": {
    title: "Aluminiumverglasung",
    kicker: "Terrassen, Dächer, Portale",
    lead: "Pfosten-Riegel-Fassaden, Oberlichter, Glasanbauten und Hebe-Schiebe-Systeme.",
    specs: [
      { value: "bis 12 m", label: "Elementbreite Alumark S158" },
      { value: "bis 440 kg", label: "Flügelgewicht" },
      { value: "RAL", label: "Jede Farbe der Palette" },
    ],
    sections: [
      {
        title: "Was wir aus Aluminium bauen",
        list: [
          "Verglasung von Terrassen und Erholungsbereichen in Privathäusern",
          "Glasanbauten",
          "Pfosten-Riegel-Konstruktionen und Warmdächer über Schwimmbädern",
          "Provedal-Schiebeverglasung für Balkone und Pavillons",
        ],
      },
      {
        title: "Hebe-Schiebe-System Alumark S158",
        imgAlt: "Hebe-Schiebe-System Alumark S158",
        list: [
          "Bautiefe 158 mm",
          "Füllung von 10 bis 50 mm",
          "Maximales Flügelgewicht bis 440 kg",
          "Flügelhöhe bis 3300 mm, Breite bis 3200 mm",
          "Maximale Elementbreite 12 Meter",
          "Lackierung in jeder RAL-Farbe",
        ],
        text: ["Das System ist mit ausschließlich beweglichen Flügeln oder mit einem festen Teil erhältlich."],
      },
    ],
  },
});

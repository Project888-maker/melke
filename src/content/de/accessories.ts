import { accessories as ru, accessoriesPage as ruPage, accessoryChips as ruChips } from "../ru/accessories";
import { overlaySolutions } from "../overlay";

const chipLabels: Record<string, string> = {
  "safety": "Sicherheit",
  "sills": "Fensterbänke",
  "nets": "Insektenschutz",
  "blinds": "Jalousien",
  "shutters": "Rollläden",
  "gates": "Tore",
  "warm": "Warmes Profil"
};
export const accessoryChips = ruChips.map((c) => ({ ...c, label: chipLabels[c.id] ?? c.label }));

const t = {
  "hero": {
    "title": "Zubehör von ET",
    "lead": "Komfort entsteht aus Details.",
    "text": "Für Fenster, Interieur und Ihr Zuhause."
  },
  "safety": {
    "title": "Draft achtet auf Kindersicherheit",
    "lead": "Wir wählen Sicherheitselemente passend zu Ihrem Fenstersystem.",
    "note": "Ein Insektenschutzgitter schützt nicht vor dem Herausfallen. Sicherungen am Fenster ersetzen nicht die Aufsicht durch Erwachsene.",
    "cta": "Schutz auswählen"
  },
  "safetyItems": [
    {
      "title": "Abschließbare Griffe",
      "text": "Verhindern das Öffnen des Fensters ohne Schlüssel."
    },
    {
      "title": "Kindersicherungen",
      "text": "Begrenzen die Öffnung des Flügels."
    },
    {
      "title": "Sicherheitsverglasung",
      "text": "Erhöhte Festigkeit und Sicherheit."
    }
  ],
  "sills": {
    "title": "Fensterbänke von ET",
    "lead": "Kollektion Crystallit. Eine Oberfläche, die das Interieur abrundet.",
    "points": [
      "Feuchtigkeitsbeständig",
      "Auswahl an Oberflächen",
      "Zuschnitt nach Maß"
    ],
    "cta": "Fensterbank auswählen"
  },
  "sillItems": [
    "Weiß glänzend",
    "Anthrazit matt",
    "Marmor glänzend"
  ],
  "warm": {
    "title": "Warmes Basisprofil von ET",
    "lead": "Wärme beginnt an der Basis.",
    "text": "Wärmedämmende Unterlage für Aluminiumschwellen, Türen und Portalsysteme.",
    "points": [
      "Verringert Wärmeverluste im unteren Anschluss",
      "Feuchtigkeitsbeständiges Material",
      "Auf die Konstruktion abgestimmt"
    ],
    "note": "Maße und Kompatibilität klären wir für Ihr Projekt.",
    "cta": "Warmes Profil auswählen"
  },
  "trio": [
    {
      "title": "Insektenschutz von ET",
      "text": "Frische Luft ohne ungebetene Gäste.",
      "cta": "Gitter auswählen"
    },
    {
      "title": "ET-Jalousien",
      "text": "Stellen Sie das Licht auf Ihren Rhythmus ein.",
      "cta": "Jalousien auswählen"
    },
    {
      "title": "Rollläden",
      "text": "Privatsphäre und Lichtsteuerung.",
      "cta": "Rollläden auswählen"
    }
  ],
  "gates": {
    "kicker": "Ergänzende Lösungen",
    "title": "Garagen-Sektionaltore",
    "lead": "Die Fortsetzung der Architektur Ihres Hauses.",
    "text": "Größe, Oberfläche und Steuerung passend zu Ihrem Projekt.",
    "points": [
      "Einheitlicher Fassadenstil",
      "Individuelle Auswahl"
    ],
    "cta": "Mein Projekt besprechen"
  },
  "moreTitle": "Komponenten für Fenster",
  "moreLead": "Alles, was die Montage abschließt und das Fenster über Jahre bequem macht.",
  "cta": {
    "title": "Wir fügen die Details zu einer Lösung zusammen",
    "text": "Wir stellen die optimale Ausstattung zusammen. Kostenloses Aufmaß in Kaliningrad und im Gebiet."
  }
};

export const accessoriesPage: typeof ruPage = {
  hero: { ...ruPage.hero, ...t.hero },
  safety: { ...ruPage.safety, ...t.safety, items: ruPage.safety.items.map((it, i) => ({ ...it, ...t.safetyItems[i] })) },
  sills: { ...ruPage.sills, ...t.sills, items: ruPage.sills.items.map((it, i) => ({ ...it, title: t.sillItems[i] })) },
  warm: { ...ruPage.warm, ...t.warm },
  trio: ruPage.trio.map((it, i) => ({ ...it, ...t.trio[i] })),
  gates: { ...ruPage.gates, ...t.gates },
  moreTitle: t.moreTitle,
  moreLead: t.moreLead,
  cta: t.cta,
};

export const accessories = overlaySolutions(ru, {
  "moskitnye-setki": {
    "title": "Insektenschutzgitter",
    "kicker": "Frische Luft ohne Insekten",
    "lead": "Spannrahmen, Rollos, Plissees und Türgitter für Fenster aller Hersteller.",
    "sections": [
      {
        "text": [
          "Ein Insektenschutzgitter ist der sicherste, wirksamste und günstigste Schutz vor Mücken, Fliegen, Pappelflaum und Zigarettenkippen aus den oberen Etagen. Dank seiner Festigkeit ist es auch eine zuverlässige Barriere für Wellensittiche und Katzen, die es im Frühling nach draußen zieht.",
          "Die Gitter werden für verschiedene Fenster, Balkontüren und Loggien gefertigt. Wir montieren sie an Fenstern aller Hersteller: Kunststoff, Aluminium und Holz."
        ]
      },
      {
        "title": "Materialien",
        "list": [
          "Rahmen aus gewalztem Aluminium mit doppelter Einbrennlackierung, Standardfarben Weiß und Braun",
          "Kunststoffteile aus Polyamid: vergilben nicht und sind temperaturbeständig",
          "Gewebe aus Fiberglas mit grauer PVC-Beschichtung"
        ]
      },
      {
        "title": "Spannrahmen",
        "imgAlt": "Insektenschutz-Spannrahmen",
        "text": [
          "Die am weitesten verbreitete Bauart im Aluminiumrahmen. Einfach in Gebrauch und Montage. Eine Quersprosse in der Mitte sorgt für Stabilität. Besondere Pflege ist nicht nötig: Im Winter lässt sich der Rahmen leicht abnehmen und unter der Dusche abspülen."
        ]
      },
      {
        "title": "Rollo",
        "imgAlt": "Insektenschutzrollo",
        "text": [
          "Wird am Fensterrahmen oder in der Laibung montiert und funktioniert wie ein Rollo. Es muss im Winter nicht abgenommen werden, hat keine Quersprosse und ist von innen wie von außen kaum zu sehen."
        ]
      },
      {
        "title": "Plissee",
        "imgAlt": "Insektenschutz-Plissee",
        "text": [
          "Eine moderne Faltkonstruktion, die sich wie eine Ziehharmonika zusammenschiebt. Ideal für komplexe und ungewöhnliche Öffnungen und überall dort, wo es im geöffneten Zustand auf Kompaktheit ankommt. Die Kompromisse: ein höherer Preis und eine etwas geringere Luftdurchlässigkeit. Für normale rechteckige Fenster ist der Spannrahmen oft praktischer."
        ]
      },
      {
        "title": "Türgitter",
        "imgAlt": "Insektenschutztür",
        "text": [
          "Türgitter werden an Balkontüren montiert und öffnen in die entgegengesetzte Richtung. Sie haben Aluminiumbänder, Magnethalter und Kunststoffgriffe; die Tür besteht aus einem verstärkten 32-mm-Aluminiumprofil.",
          "Für Landhäuser, an der Haustür oder Veranda, verwenden wir ein verstärktes 52-mm-Profil mit Aluminiumgriff, Federschließer, Bändern und Magnethalter."
        ]
      },
      {
        "title": "So bestellen Sie",
        "text": [
          "Sie müssen nicht ins Büro kommen: Rufen Sie an und vereinbaren Sie ein Aufmaß, und am nächsten Tag ist das Gitter bei Ihnen zu Hause."
        ]
      }
    ]
  },
  "podokonniki": {
    "title": "Fensterbänke",
    "kicker": "Runden das Interieur ab",
    "lead": "Glänzende und matte Fensterbänke in verschiedenen Farben sowie Produkte aus Kunststein und Quarzit.",
    "sections": [
      {
        "text": [
          "Fensterbänke werden raumseitig unter dem Fenster montiert. Die Oberfläche ist mit CPL-Folie auf Basis hochwertiger Melaminharze beschichtet und damit beständig gegen Stöße, Kratzer, hohe Temperaturen, UV-Strahlung und Haushaltschemie.",
          "Außerdem bieten wir Fensterbänke, Arbeitsplatten und Stufen aus Kunststein und Quarzit an."
        ]
      },
      {
        "title": "Wichtige Eigenschaften",
        "list": [
          "Stabile, steife Struktur",
          "Beständig gegen mechanische Einwirkungen",
          "Schwer entflammbar und selbstverlöschend",
          "UV-beständig",
          "Kein Anstrich nötig",
          "Einfache Montage und Pflege"
        ]
      },
      {
        "text": [
          "Die Fensterbank ist mit einer Schutzfolie versehen, die sie bei Lagerung, Transport und Montage schützt. Nach der Montage lässt sich die Folie leicht abziehen."
        ]
      }
    ]
  },
  "otlivy": {
    "title": "Fensterbankbleche",
    "kicker": "Wasserableitung außen",
    "lead": "Verzinkte, polyesterbeschichtete und Aluminium-Fensterbankbleche in 90–350 mm Breite.",
    "sections": [
      {
        "text": [
          "Fensterbankbleche werden außen am Fenster montiert und leiten das Wasser ab. Wir bieten drei Ausführungen an."
        ]
      },
      {
        "title": "Ausführungen",
        "list": [
          "Aus verzinktem Stahl: die einfachste und günstigste Variante",
          "Verzinkt mit Polyesterbeschichtung: weiß, braun oder in Holzoptik",
          "Aus Aluminium: pulverbeschichtet, Innenseite grundiert"
        ]
      },
      {
        "title": "Vorteile",
        "list": [
          "Behalten lange ihr gepflegtes Aussehen",
          "Beständig gegen Niederschlag",
          "Fertigung in verschiedenen Breiten möglich, Standard 90–350 mm"
        ]
      }
    ]
  },
  "otkosy": {
    "title": "Fensterlaibungen",
    "kicker": "Warm und langlebig",
    "lead": "Laibungen aus 10 mm starken PVC-Sandwichplatten: glänzend, matt und in Holzoptik.",
    "sections": [
      {
        "text": [
          "Beim Austausch eines alten Fensters werden die alten Laibungen zerstört. Bei falscher Materialwahl können die Laibungen durchfrieren, an der Verglasung bildet sich Kondenswasser und das Erscheinungsbild leidet.",
          "Wir bieten eine einfache, wirtschaftliche und pflegeleichte Technik: PVC-Sandwichplatten mit 10 mm Stärke."
        ]
      },
      {
        "title": "Vorteile von Kunststofflaibungen",
        "list": [
          "Optik: vollkommen ebene Oberfläche ohne Flecken und Schlieren, leicht zu reinigen",
          "Lebensdauer entspricht der der Fenster selbst",
          "Wärmedämmung: niedriger Wärmedurchgang, kein Kondenswasser",
          "Feuchtigkeitsbeständigkeit von Außen- und Innenschicht und der Verklebung",
          "Dampfdichtheit: schützen Montageschaum und Wände vor Feuchtigkeit"
        ]
      }
    ]
  },
  "sendvich-paneli": {
    "title": "Sandwichplatten",
    "kicker": "Für Fenster, Türen und Trennwände",
    "lead": "Dreischichtige PVC-Platten von 8 bis 52 mm Stärke.",
    "sections": [
      {
        "text": [
          "Dreischichtige Sandwichplatten sind beidseitig mit durchgehenden Hart-PVC-Platten belegt, matt oder glänzend. Sie werden in Fenster- und Türkonstruktionen erfolgreich als Füllelemente eingesetzt.",
          "10-mm-Platten werden für Fenster- und Türlaibungen verwendet, 24 und 32 mm für Fenster- und Türkonstruktionen und Trennwände. Formate: 1500×3000 mm (10 mm) und 2000×3000 mm (24 und 32 mm).",
          "Dank ihrer Feuchtigkeitsbeständigkeit eignen sich die Platten für den Ausbau von Bädern; außerdem werden sie für Verkaufspavillons, Bürotrennwände und Werbeflächen eingesetzt."
        ]
      },
      {
        "title": "Eigenschaften des Dämmkerns",
        "list": [
          "Geringe Wärmeleitfähigkeit",
          "Geringe Feuchtigkeitsaufnahme",
          "Hohe mechanische Festigkeit",
          "Großer Temperaturbereich",
          "Geringes Gewicht"
        ]
      }
    ]
  },
  "steklopakety": {
    "title": "Isolierglas",
    "kicker": "Wärme, Ruhe und Sicherheit",
    "lead": "Zweifach- und Dreifachverglasung mit energiesparenden, schalldämmenden und schlagfesten Eigenschaften.",
    "specs": [
      {
        "value": "24–50 mm",
        "label": "Stärke der Verglasung"
      },
      {
        "value": "bis 1,02",
        "label": "Wärmedurchlasswiderstand, m²·°C/W"
      },
      {
        "value": "ab 27 dBA",
        "label": "Schalldämmung der Dreifachverglasung"
      }
    ],
    "sections": [
      {
        "imgAlt": "Aufbau einer Isolierglaseinheit",
        "text": [
          "Eine Isolierglaseinheit besteht aus zwei Scheiben (Zweifachverglasung) oder drei Scheiben (Dreifachverglasung), die durch dichte Scheibenzwischenräume getrennt sind. Der Scheibenabstand wird durch die Stärke der Abstandhalter bestimmt: 6 bis 24 mm.",
          "Alle Isoliergläser durchlaufen eine Eingangskontrolle nach den Anforderungen von GOST 24866-99."
        ]
      },
      {
        "title": "Stärke",
        "list": [
          "Glas: 4 oder 6 mm",
          "Zweifachverglasung: 24 mm",
          "Dreifachverglasung: 24, 32, 36, 40, 44 oder 50 mm"
        ]
      },
      {
        "title": "Arten von Isolierglas",
        "list": [
          "Für allgemeine Bauzwecke",
          "Energiesparend",
          "Schallschutz",
          "Sonnenschutz",
          "Schlagfest und sicher",
          "Dekorativ"
        ]
      },
      {
        "title": "So verbessern Sie den Schallschutz",
        "list": [
          "Glasstärke erhöhen",
          "Scheiben unterschiedlicher Stärke verwenden",
          "Scheibenzwischenräume unterschiedlicher Breite verwenden",
          "Verbundglas einsetzen"
        ]
      },
      {
        "title": "Glasarten",
        "imgAlt": "Zweifach- und Dreifachverglasung",
        "list": [
          "K-Glas: Low-E-Glas mit harter pyrolytischer Beschichtung",
          "I-Glas: mit weicher selektiver Schicht, dämmt besser als K-Glas",
          "Getöntes Glas: verringert den Lichtdurchgang ohne Spiegeleffekt",
          "Verbundglas: reißt bei einem Schlag, zerfällt aber nicht und dämmt Schall besser",
          "Schutzfolien: Sicherheit, Verstärkung und besondere optische Eigenschaften"
        ]
      }
    ]
  }
});

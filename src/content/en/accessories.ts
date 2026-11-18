import { accessories as ru, accessoriesPage as ruPage, accessoryChips as ruChips } from "../ru/accessories";
import { overlaySolutions } from "../overlay";

const chipLabels: Record<string, string> = {
  "safety": "Safety",
  "sills": "Window sills",
  "nets": "Mosquito nets",
  "blinds": "Blinds",
  "shutters": "Roller shutters",
  "gates": "Garage doors",
  "warm": "Warm profile"
};
export const accessoryChips = ruChips.map((c) => ({ ...c, label: chipLabels[c.id] ?? c.label }));

const t = {
  "hero": {
    "title": "ET accessories",
    "lead": "Comfort is made of details.",
    "text": "For your windows, your interior and your home."
  },
  "safety": {
    "title": "Draft cares about child safety",
    "lead": "We select safety elements to match your window system.",
    "note": "A mosquito net does not protect against falls. Window safety devices do not replace adult supervision.",
    "cta": "Choose protection"
  },
  "safetyItems": [
    {
      "title": "Lockable handles",
      "text": "Prevent the window from being opened without a key."
    },
    {
      "title": "Child locks",
      "text": "Limit how far the sash can open."
    },
    {
      "title": "Safety glazing",
      "text": "Increased strength and safety."
    }
  ],
  "sills": {
    "title": "ET window sills",
    "lead": "The Crystallit collection. A texture that completes the interior.",
    "points": [
      "Moisture resistant",
      "Choice of textures",
      "Made to size"
    ],
    "cta": "Choose a window sill"
  },
  "sillItems": [
    "White gloss",
    "Anthracite matt",
    "Marble gloss"
  ],
  "warm": {
    "title": "ET warm base profile",
    "lead": "Warmth starts at the base.",
    "text": "A thermally insulating support for aluminium thresholds, doors and portal systems.",
    "points": [
      "Reduces heat loss at the bottom joint",
      "Moisture-resistant material",
      "Matched to the structure"
    ],
    "note": "We will confirm size and compatibility for your project.",
    "cta": "Choose a warm profile"
  },
  "trio": [
    {
      "title": "ET mosquito nets",
      "text": "Fresh air without uninvited guests.",
      "cta": "Choose a net"
    },
    {
      "title": "ET blinds",
      "text": "Set the light to your own rhythm.",
      "cta": "Choose blinds"
    },
    {
      "title": "Roller shutters",
      "text": "Privacy and control of light.",
      "cta": "Choose roller shutters"
    }
  ],
  "gates": {
    "kicker": "Related solutions",
    "title": "Sectional garage doors",
    "lead": "A continuation of your home's architecture.",
    "text": "Size, finish and control to suit your project.",
    "points": [
      "One style for the whole façade",
      "Individual selection"
    ],
    "cta": "Discuss my project"
  },
  "moreTitle": "Window components",
  "moreLead": "Everything that completes the installation and keeps a window convenient for years.",
  "cta": {
    "title": "We will bring the details together",
    "text": "We will select the best configuration. Free measurement in Kaliningrad and the region."
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
    "title": "Mosquito nets",
    "kicker": "Fresh air without insects",
    "lead": "Framed, roll-up, pleated and door nets for windows from any manufacturer.",
    "sections": [
      {
        "text": [
          "A mosquito net is the safest, most effective and most economical protection against mosquitoes, flies, poplar fluff and cigarette ends from the floors above. It is strong enough to be a reliable barrier for parrots and cats longing for spring freedom.",
          "Nets are made for various types of windows, balcony doors and loggias. We fit them to windows from any manufacturer: PVC, aluminium and timber."
        ]
      },
      {
        "title": "Materials",
        "list": [
          "Frame of rolled aluminium with a double baked-enamel finish; standard colours are white and brown",
          "Plastic components made of polyamide: they do not yellow and withstand temperature swings",
          "Fibreglass mesh with a grey PVC coating"
        ]
      },
      {
        "title": "Framed net",
        "imgAlt": "Framed mosquito net",
        "text": [
          "The most common design, in an aluminium frame. Easy to use and to fit. A crossbar in the middle adds rigidity. It needs no special care: it comes off easily for the winter and can be washed under the shower."
        ]
      },
      {
        "title": "Roll-up net",
        "imgAlt": "Roll-up mosquito net",
        "text": [
          "Fitted to the window frame or in the opening, it works like a roller blind. It does not need to be removed for the winter, has no crossbar and is barely noticeable from inside or outside."
        ]
      },
      {
        "title": "Pleated net",
        "imgAlt": "Pleated mosquito net",
        "text": [
          "A modern folding design that gathers like an accordion. Ideal for complex and non-standard openings and wherever compactness when open matters. The trade-offs are a higher price and slightly lower air permeability. For standard rectangular windows a framed net is often more practical."
        ]
      },
      {
        "title": "Door nets",
        "imgAlt": "Mosquito net door",
        "text": [
          "Door nets are fitted to balcony doors and open in the opposite direction. They have aluminium hinges, magnetic catches and plastic handles; the door is made of a reinforced 32 mm aluminium profile.",
          "For country houses, on an entrance door or veranda, we use a reinforced 52 mm profile with an aluminium handle, a spring closer, hinges and a magnetic catch."
        ]
      },
      {
        "title": "How to order",
        "text": [
          "There is no need to come to the office: call us to book a measurement, and the next day the net will be at your home."
        ]
      }
    ]
  },
  "podokonniki": {
    "title": "Window sills",
    "kicker": "Completing the interior",
    "lead": "Gloss and matt window sills in various colours, as well as products in engineered stone and quartzite.",
    "sections": [
      {
        "text": [
          "Window sills are fitted under the window on the room side. The surface is laminated with CPL film based on high-quality melamine resins, which makes it resistant to impact, scratches, high temperatures, UV radiation and household chemicals.",
          "We also offer window sills, worktops and steps in engineered stone and quartzite."
        ]
      },
      {
        "title": "Key properties",
        "list": [
          "Stable, rigid structure",
          "Resistant to mechanical damage",
          "Low flammability and self-extinguishing",
          "UV resistant",
          "No painting required",
          "Easy to fit and to look after"
        ]
      },
      {
        "text": [
          "The sill is covered with a protective film that keeps it safe during storage, transport and fitting. After fitting, the film peels off easily."
        ]
      }
    ]
  },
  "otlivy": {
    "title": "Window drip caps",
    "kicker": "Draining water outside",
    "lead": "Galvanised, polyester-coated and aluminium drip caps 90–350 mm wide.",
    "sections": [
      {
        "text": [
          "Drip caps are fitted to windows on the outside and carry water away. We offer three types."
        ]
      },
      {
        "title": "Types of drip caps",
        "list": [
          "Galvanised steel: the simplest and most economical option",
          "Galvanised with a polyester coating: white, brown or wood effect",
          "Aluminium: powder coated, with a primed inner surface"
        ]
      },
      {
        "title": "Advantages",
        "list": [
          "Keep their good looks for a long time",
          "Resistant to rain and snow",
          "Can be made in different widths; the standard is 90–350 mm"
        ]
      }
    ]
  },
  "otkosy": {
    "title": "Window reveals",
    "kicker": "Warm and durable",
    "lead": "Reveals made of 10 mm PVC sandwich panels: gloss, matt and wood effect.",
    "sections": [
      {
        "text": [
          "When an old window is replaced, the old reveals are destroyed. With the wrong material, reveals can freeze through, condensation can form on the glazing and the appearance suffers.",
          "We offer a simple, economical and easy-to-maintain technology: 10 mm PVC sandwich panels."
        ]
      },
      {
        "title": "Advantages of PVC reveals",
        "list": [
          "Appearance: a perfectly even surface with no stains or streaks, easy to clean",
          "Service life matches that of the windows themselves",
          "Thermal insulation: low heat transfer, no condensation",
          "Moisture resistance of the outer and inner layers and the adhesive bond",
          "Vapour tightness: they protect the foam insulation and the walls from moisture"
        ]
      }
    ]
  },
  "sendvich-paneli": {
    "title": "Sandwich panels",
    "kicker": "For windows, doors and partitions",
    "lead": "Three-layer PVC panels from 8 to 52 mm thick.",
    "sections": [
      {
        "text": [
          "Three-layer sandwich panels are faced on both sides with solid sheets of rigid PVC, matt or gloss. The panels are widely used as infill elements in window and door structures.",
          "10 mm panels are used for window and door reveals; 24 and 32 mm panels for window and door structures and partitions. Sheet sizes: 1500×3000 mm (10 mm) and 2000×3000 mm (24 and 32 mm).",
          "Being moisture resistant, the panels suit bathroom finishing and are also used for retail pavilions, office partitions and advertising surfaces."
        ]
      },
      {
        "title": "Properties of the insulating core",
        "list": [
          "Low thermal conductivity",
          "Low moisture absorption",
          "High mechanical strength",
          "Wide temperature range",
          "Low weight"
        ]
      }
    ]
  },
  "steklopakety": {
    "title": "Glazing units",
    "kicker": "Warmth, quiet and safety",
    "lead": "Double- and triple-glazed units with energy-saving, sound-insulating and impact-resistant properties.",
    "specs": [
      {
        "value": "24–50 mm",
        "label": "Glazing unit thickness"
      },
      {
        "value": "up to 1.02",
        "label": "Thermal resistance, m²·°C/W"
      },
      {
        "value": "from 27 dBA",
        "label": "Sound insulation, triple glazing"
      }
    ],
    "sections": [
      {
        "imgAlt": "How a glazing unit is built",
        "text": [
          "A glazing unit is made of two panes (single-chamber, double glazing) or three panes (double-chamber, triple glazing) separated by sealed chambers. The gap between the panes is set by the thickness of the spacer bars: from 6 to 24 mm.",
          "All glazing units pass incoming quality control in line with GOST 24866-99."
        ]
      },
      {
        "title": "Thickness",
        "list": [
          "Glass: 4 or 6 mm",
          "Double-glazed unit (one chamber): 24 mm",
          "Triple-glazed unit (two chambers): 24, 32, 36, 40, 44 or 50 mm"
        ]
      },
      {
        "title": "Types of glazing units",
        "list": [
          "General purpose",
          "Energy saving",
          "Sound insulating",
          "Solar control",
          "Impact resistant and safety",
          "Decorative"
        ]
      },
      {
        "title": "How to improve sound insulation",
        "list": [
          "Increase the glass thickness",
          "Use panes of different thickness",
          "Use chambers of different width",
          "Use laminated glass"
        ]
      },
      {
        "title": "Types of glass",
        "imgAlt": "Double-glazed and triple-glazed units",
        "list": [
          "K-glass: low-emissivity glass with a hard pyrolytic coating",
          "I-glass: with a soft selective layer; insulates better than K-glass",
          "Tinted glass: reduces light transmission without a mirror effect",
          "Laminated glass: cracks on impact but does not shatter, and insulates sound better",
          "Protective films: safety, reinforcement and special optical properties"
        ]
      }
    ]
  }
});

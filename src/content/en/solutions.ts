import { solutions as ru } from "../ru/solutions";
import { overlaySolutions } from "../overlay";

export const solutionGroups = [
  { key: "profiles", label: "Profile systems" },
  { key: "doors", label: "Doors and portals" },
  { key: "glazing", label: "Glazing" },
] as const;

export const solutions = overlaySolutions(ru, {
  "melke-lite-60": {
    title: "Melke Lite 60",
    kicker: "Melke profile",
    lead: "A light three-chamber profile for economical glazing of balconies, loggias, terraces and summer houses.",
    specs: [
      { value: "60 mm", label: "Installation depth" },
      { value: "3 chambers", label: "Profile construction" },
      { value: "Class A", label: "Air and water tightness" },
    ],
    sections: [
      {
        title: "Strong, yet light",
        text: [
          "The light three-chamber Melke Lite 60 profile with a 60 mm installation depth is made using CO-EX (co-extrusion) technology and has increased strength.",
          "The windows have the highest class A rating for air and water tightness under GOST 26602.2-99 and cope with cold, heat, wind and noise.",
        ],
      },
      { title: "Where to use it", list: ["Unheated balconies and loggias", "Terraces and verandas", "Summer houses"] },
      {
        title: "About the Melke plant",
        imgAlt: "The Melke plant in Fryazino",
        text: [
          "The Melke plant is located in Fryazino, 30 km from Moscow. The profile is designed for energy-efficient windows and doors: it reduces heat loss, helps create a healthy indoor climate and improves sound insulation.",
          "According to a sanitary and epidemiological assessment, Melke window systems are suitable for glazing all categories of buildings, including medical, educational and children's facilities.",
        ],
      },
    ],
  },
  aluplast: {
    title: "Aluplast profile",
    kicker: "German profile system",
    lead: "IDEAL 4000 and IDEAL 8000 systems for glazing houses and apartments.",
    specs: [
      { value: "70 / 85 mm", label: "Installation depth" },
      { value: "5 / 6 chambers", label: "IDEAL 4000 / 8000" },
      { value: "up to 48 dB", label: "Sound insulation, IDEAL 8000" },
    ],
    sections: [
      {
        title: "About the manufacturer",
        imgAlt: "Aluplast production",
        text: [
          "Aluplast is a leading manufacturer of PVC profile systems for windows and doors. The family business was founded in December 1982 by Manfred J. Seitz in Ettlingen. Its head office and main plant are in Karlsruhe, Germany.",
          "The group has 24 production and sales subsidiaries. In 2016 Aluplast received the TOP100 award as one of the most innovative small and medium-sized companies.",
        ],
      },
      {
        title: "IDEAL 4000 system",
        imgAlt: "Aluplast IDEAL 4000 profile",
        text: ["Noble simplicity, clean and flowing lines. A smooth surface and elegant 15-degree bevels give a house an attractive appearance."],
        list: [
          "5-chamber profile system",
          "Installation depth 70 mm",
          "Glazing unit up to 41 mm",
          "Profile thermal resistance 0.77 m²·°C/W",
          "2 sealing contours",
          "Temperature range from −60 to +70 °C",
          "Wide colour range, replaceable seals",
          "Lead-free, environmentally friendly profile",
        ],
      },
      {
        title: "IDEAL 8000 system",
        imgAlt: "Aluplast IDEAL 8000 profile",
        text: ["A system with excellent sound insulation and improved burglar resistance of the window frame."],
        list: [
          "6-chamber profile system",
          "Installation depth 85 mm",
          "Glazing unit up to 51 mm",
          "Profile thermal resistance 1.0 m²·°C/W",
          "Sound insulation up to 48 dB",
          "3 sealing contours",
          "Temperature range from −60 to +70 °C",
          "Lead-free, environmentally friendly profile",
        ],
      },
    ],
  },
  wital: {
    title: "WITAL profile",
    kicker: "Polish profile system",
    lead: "WITAL STANDART and WITAL PRESTIGE TERM systems with a six-chamber profile.",
    specs: [
      { value: "6 chambers", label: "Profile structure" },
      { value: "86 mm", label: "Depth of PRESTIGE TERM" },
      { value: "up to 52 mm", label: "Glazing unit" },
    ],
    sections: [
      {
        title: "About the manufacturer",
        text: [
          "WITAL PVC profiles are produced in Gołdap, Poland. The company works with leading raw material suppliers from Germany, the United Kingdom, the USA, Austria, the Netherlands, Belgium, Sweden, Italy and Poland.",
          "European Technologies makes windows on two systems: WITAL STANDART and WITAL PRESTIGE TERM.",
        ],
      },
      {
        title: "WITAL STANDART",
        imgAlt: "WITAL STANDART profile",
        list: [
          "Six-chamber profile and triple glazing: high thermal and acoustic insulation",
          "Rounded shapes and a wide reinforcement chamber",
          "An 8 mm overlap between frame and sash keeps out draughts, dust and water",
          "A 13 mm hardware groove allows burglar-resistant fittings",
          "Window thermal resistance Ro = 0.87 m²·°C/W (36 mm glazing unit with a warm-edge spacer)",
          "Four through-coloured profile colours and 38 laminate finishes",
          "Door systems are compatible with the window systems",
        ],
      },
      {
        title: "WITAL PRESTIGE TERM",
        imgAlt: "WITAL PRESTIGE TERM profile",
        list: [
          "Six-chamber profile with an installation depth of 86 mm",
          "Glazing units up to 52 mm and an additional middle sealing contour in frame and sash",
          "Reinforced hinge fixing points",
          "Window thermal resistance Ro = 1.06 m²·°C/W (48 mm glazing unit with a warm-edge spacer)",
          "Class A and B profiles",
          "Wide range of laminate finishes",
        ],
      },
    ],
  },
  "dveri-hst": {
    title: "HST doors",
    kicker: "Lift-and-slide portals",
    lead: "Large glass doors that erase the boundary between the house and the outdoors.",
    specs: [
      { value: "up to 6500 mm", label: "Structure width" },
      { value: "up to 3000 mm", label: "Structure height" },
      { value: "up to 51 mm", label: "Glazing unit" },
    ],
    sections: [
      {
        title: "What HST means",
        text: [
          "Hebe-Schiebe-Tür, or lift-and-slide door, is an advanced sliding door system that has been used in Germany and across Europe for decades. An HST door combines excellent insulation with a refined look.",
          "The handle makes opening effortless and the flat threshold does not get in the way. These doors let far more light into the house than an ordinary window.",
        ],
      },
      {
        title: "Advantages",
        list: [
          "Easy to use, with a finely tuned sliding mechanism",
          "Barrier-free passage: a low threshold",
          "Six-chamber 85 mm sash, frame width 207 mm",
          "Excellent thermal insulation coefficient",
          "Central lock with triple sealing technology",
          "High level of air tightness, class 1",
        ],
      },
      {
        title: "Where they belong",
        text: [
          "Lift-and-slide doors suit both new houses and the renovation of older ones. They add charm to glazed terraces, balconies and garden pavilions and are used wherever a spacious, barrier-free opening matters.",
        ],
      },
    ],
  },
  "balkony-i-lodzhii": {
    title: "Balconies and loggias",
    kicker: "Warm and cold glazing",
    lead: "We glaze balconies and loggias with aluminium and PVC frames.",
    specs: [
      { value: "10–12 dBA", label: "Noise reduction" },
      { value: "5–8 °C", label: "Warmer than outdoors" },
      { value: "2.5 times", label: "Lighter than PVC frames" },
    ],
    sections: [
      {
        title: "Warm or cold",
        text: [
          "Warm glazing has a thermal resistance of at least 0.35 m²·°C/W. It uses PVC frames with double- or triple-glazed units, and the parapet, floor and ceiling must be insulated.",
          "Cold glazing protects the balcony from rain and snow, lowers the noise and dust level in the adjoining room and improves its thermal protection.",
        ],
      },
      {
        title: "What glazing includes",
        text: [
          "In the broad sense it is the full scope of work on converting a balcony: fitting a canopy and a drip cap, moving the frames beyond the parapet, interior finishing, cupboards and cabinets, exterior cladding and, where needed, a roof.",
        ],
      },
      {
        title: "Types of sashes",
        list: [
          "Fixed (non-opening)",
          "Side-hung: the best air tightness and noise protection, open inwards",
          "Tilt-and-turn",
          "Sliding: move along the parapet, save space and weigh much less",
        ],
      },
      {
        title: "Provedal aluminium system",
        imgAlt: "Provedal sliding glazing",
        text: [
          "For cold glazing we offer the Provedal system, series C640. The sashes run on two rails on adjustable rollers and are fitted with 4 or 5 mm glass. One section can have from two to six sashes, snap locks secure them, and brush seals keep out dust and dampen noise.",
          "Aluminium systems load the balcony slab almost 2.5 times less than PVC frames, so they suit older apartment blocks and small balconies. We glaze garden pavilions and terraces the same way.",
        ],
      },
    ],
  },
  "alyuminievoe-osteklenie": {
    title: "Aluminium glazing",
    kicker: "Terraces, roofs, portals",
    lead: "Mullion-transom façades, skylights, glass extensions and lift-and-slide systems.",
    specs: [
      { value: "up to 12 m", label: "Unit width, Alumark S158" },
      { value: "up to 440 kg", label: "Sash weight" },
      { value: "RAL", label: "Any colour from the palette" },
    ],
    sections: [
      {
        title: "What we build in aluminium",
        list: [
          "Glazing of terraces and leisure areas in private houses",
          "Glass extensions",
          "Mullion-transom structures and warm roofs over swimming pools",
          "Provedal sliding glazing for balconies and garden pavilions",
        ],
      },
      {
        title: "Alumark S158 lift-and-slide system",
        imgAlt: "Alumark S158 lift-and-slide system",
        list: [
          "Installation depth 158 mm",
          "Infill from 10 to 50 mm",
          "Maximum sash weight up to 440 kg",
          "Sash height up to 3300 mm, width up to 3200 mm",
          "Maximum unit width 12 metres",
          "Painted in any RAL colour",
        ],
        text: ["The system can have all sashes active or include a fixed section."],
      },
    ],
  },
});

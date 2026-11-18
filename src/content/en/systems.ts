import type { WindowSystem } from "../types";
import { systems as ru } from "../ru/systems";

const colors = [
  { name: "White", desc: "Classic and versatile", swatch: ru[0].colors[0].swatch },
  { name: "Anthracite", desc: "Modern and expressive", swatch: ru[0].colors[1].swatch },
  { name: "Wood", desc: "Natural look", swatch: ru[0].colors[2].swatch },
];

export const compareRows: { key: string; label: string }[] = [
  { key: "width", label: "Installation depth, mm" },
  { key: "frame", label: "Chambers in frame" },
  { key: "sash", label: "Chambers in sash" },
  { key: "glass", label: "Glazing unit, mm" },
  { key: "seals", label: "Sealing contours" },
  { key: "use", label: "Best suited for" },
];

export const categories = [
  { key: "all", label: "All systems" },
  { key: "warm", label: "Extra warmth" },
  { key: "universal", label: "All-round" },
  { key: "compact", label: "Compact" },
] as const;

const ctaTitle = "We will make ET windows for your project.";
const ctaText =
  "We will select the best configuration and help you choose a colour. Free measurement in Kaliningrad and the region.";
const colorsNote = "Colour availability is confirmed with your quote.";

const text: Record<string, Partial<WindowSystem>> = {
  centum: {
    badge: { text: "Extra warmth", tone: "peach" },
    short: "Maximum comfort and energy efficiency for your home.",
    width: "80 / 100 mm",
    chambers: "6 / 7 chambers",
    chambersLabel: "Chambers in frame / sash",
    heroTitle: "on the Melke Centum profile",
    heroLead: "Warmth and quiet for a country house.",
    heroNote: "A premium system for houses and cottages.",
    stats: [
      { value: "80 / 100 mm", label: "Frame / sash" },
      { value: "6 / 7 chambers", label: "In frame / in sash" },
      { value: "up to 50 mm", label: "Glazing unit" },
    ],
    sectionTitle: "Warmth that stays in the house",
    sectionLead:
      "Melke Centum offers outstanding sound and thermal insulation and effectively eliminates heat loss.",
    features: [
      { title: "80 mm frame, 100 mm sash", text: "Six-chamber frame and seven-chamber sash.", img: ru[0].features[0].img },
      { title: "Three sealing contours", text: "Protection from wind, moisture and street noise.", img: ru[0].features[1].img },
      { title: "Glazing unit up to 50 mm", text: "We choose the glass formula to suit where your house stands.", img: ru[0].features[2].img },
    ],
    about: [
      "Melke Centum is a premium system that is unique on the Russian PVC window market.",
      "A six-chamber 80 mm frame, a seven-chamber 100 mm sash, three sealing contours and a 50 mm glazing unit protect the house reliably in any weather. It is the best choice for glazing country houses and cottages: the windows eliminate heat loss and complement a modern interior.",
    ],
    interiorTitle: "For the home. For the family. For years.",
    interiorText:
      "ET windows on the Melke Centum profile keep the warmth inside and underline the architecture of the house. Melke Centum keeps your loved ones warm, even when they are far away.",
    compare: { width: "80 / 100", frame: "6", sash: "7", glass: "up to 50", seals: "3", use: "Country house, cottage" },
  },
  evolution: {
    badge: { text: "Bestseller", tone: "pink" },
    short: "A reliable solution with excellent performance and a modern design.",
    width: "70 mm",
    chambers: "5 chambers",
    chambersLabel: "Chambers in frame / sash",
    heroTitle: "on the Melke Evolution profile",
    heroLead: "Comfort for every day.",
    heroNote: "An all-round system for apartments and country houses.",
    stats: [
      { value: "70 mm", label: "Installation depth" },
      { value: "5 chambers", label: "In frame and sash" },
      { value: "To your project", label: "Colour and configuration" },
    ],
    sectionTitle: "What matters in your windows",
    sectionLead:
      "The Melke Evolution profile system and quality components make ET windows comfortable to use every day.",
    features: [
      { title: "70 mm profile", text: "Five-chamber profile construction.", img: ru[1].features[0].img },
      { title: "Glazing to suit the task", text: "Chosen with your house's location and your wishes in mind.", img: ru[1].features[1].img },
      { title: "Easy opening", text: "We agree on sashes, handles and hardware with you.", img: ru[1].features[2].img },
    ],
    about: [
      "A five-chamber profile with 3 mm outer walls, a thermoplastic elastomer seal and triple glazing keep rooms warm and quiet.",
      "Melke Evolution suits both apartments with central heating (with double glazing) and private houses. A 40 mm triple-glazed unit keeps the heat in during winter and the heat out in summer.",
      "Cool Colours technology preserves the depth of colour and the strength of the material for many years.",
    ],
    interiorTitle: "For the apartment. For the house. For you.",
    interiorText:
      "ET windows on the Melke Evolution profile fit naturally into any interior and bring comfort and quiet to a city apartment or a country house.",
    compare: { width: "70", frame: "5", sash: "5", glass: "up to 40", seals: "—", use: "Apartment, private house" },
  },
  "smart-ultra": {
    badge: { text: "New system", tone: "lime" },
    short: "A modern system with improved performance for new projects.",
    width: "65 mm",
    chambers: "4 chambers",
    chambersLabel: "Chambers in frame / sash",
    heroTitle: "on the Melke Smart Ultra profile",
    heroLead: "A modern system for apartments and country houses.",
    heroNote: "We make ET windows from Melke profiles.",
    stats: [
      { value: "65 mm", label: "Installation depth" },
      { value: "4 chambers", label: "In frame and sash" },
      { value: "28 / 36 mm", label: "Glazing unit" },
    ],
    sectionTitle: "Thought through to the last detail",
    sectionLead:
      "Modern engineering and quality components keep ET windows on the Melke Smart Ultra profile comfortable and reliable for years.",
    features: [
      { title: "65 mm profile", text: "Four-chamber profile construction.", img: ru[2].features[0].img },
      { title: "Choice of glazing", text: "We agree on a configuration that suits your home.", img: ru[2].features[1].img },
      { title: "Colour to match the interior", text: "We will show you the finishes available.", img: ru[2].features[2].img },
    ],
    about: [],
    interiorTitle: "Your interior. Your character.",
    interiorText:
      "ET windows on the Melke Smart Ultra profile fit any architectural style. Choose the colour that brings out the character of your home.",
    compare: { width: "65", frame: "4", sash: "4", glass: "28 / 36", seals: "—", use: "New projects, apartment" },
  },
};

export const systems: WindowSystem[] = ru.map((s) => ({
  ...s,
  ...text[s.slug],
  colors: s.slug === "smart-ultra" ? [colors[0], colors[1], { ...colors[2], name: "Wood effect" }] : colors,
  colorsNote,
  ctaTitle,
  ctaText,
}));

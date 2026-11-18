export type Tone = "peach" | "pink" | "lime" | "cyan";
export type Category = "warm" | "universal" | "compact";

export type WindowSystem = {
  slug: string;
  name: string;
  badge: { text: string; tone: Tone };
  category: Category;
  short: string;
  width: string;
  chambers: string;
  chambersLabel: string;
  img: string;
  heroImg: string;
  /** Transparent cutouts of the profile for cards and the product hero. */
  cutout: string;
  heroCutout: string;
  heroTitle: string;
  heroLead: string;
  heroNote: string;
  stats: { value: string; label: string }[];
  sectionTitle: string;
  sectionLead: string;
  features: { title: string; text: string; img: string }[];
  about: string[];
  interiorTitle: string;
  interiorText: string;
  interiorImg: string;
  colors: { name: string; desc: string; swatch: string }[];
  colorsNote: string;
  ctaTitle: string;
  ctaText: string;
  compare: Record<string, string>;
};

export type Solution = {
  slug: string;
  title: string;
  kicker: string;
  lead: string;
  img?: string;
  sections: { title?: string; text?: string[]; list?: string[]; img?: string; imgAlt?: string }[];
  specs?: { value: string; label: string }[];
  group: "profiles" | "doors" | "glazing";
};

export type Accessory = Solution;

export type CaseStudy = {
  slug: string;
  title: string;
  year: number;
  place?: string;
  tags: string[];
  teaser: string;
  photos: string[];
  text?: string[];
  specs?: string[];
};

export type NewsItem = {
  slug: string;
  date: string;
  title: string;
  lead: string;
  img?: string;
  blocks: { title?: string; text?: string[]; list?: string[]; img?: string; link?: { href: string; label: string } }[];
};

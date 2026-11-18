import { cases as ru } from "../ru/cases";
import { overlayCases } from "../overlay";

export const caseTags = ["All", "Residential complexes", "Private houses", "Aluminium", "Balconies", "Public buildings", "Accessories"] as const;

const tags = {
  "Жилые комплексы": "Residential complexes",
  "Частные дома": "Private houses",
  "Алюминий": "Aluminium",
  "Балконы": "Balconies",
  "Общественные здания": "Public buildings",
  "Аксессуары": "Accessories",
};

export const cases = overlayCases(ru, {
  "zona-otdyha-s-kuhney-i-barbekyu": {
    title: "Leisure area with kitchen and barbecue",
    place: "Kaliningrad – Bagrationovsk road",
    text: ["A project at a light-aviation airfield. Alumark S158 lift-and-slide system, colour RAL 7016, triple glazing. The system can have all sashes active or include a fixed section."],
    specs: ["Installation depth 158 mm", "Infill from 10 to 50 mm", "Sash weight up to 440 kg", "Sash height up to 3300 mm", "Sash width up to 3200 mm", "Unit width up to 12 metres", "Painted in any RAL colour"],
  },
  "vhodnaya-dver-iz-profilya-melke": {
    title: "Entrance door on the Melke profile",
    text: [
      "An entrance door on the Melke Evolution profile (class 1, 3 mm wall thickness) with Cool Colours technology and a 40 mm triple-glazed unit.",
      "It uses proven German Siegenia hardware: silent operation, soft closing and burglar protection.",
    ],
    specs: ["Wide choice of colours, from classic to fashionable shades", "Decor: stained glass, patina, milled patterns", "Glazing from frosted to mirrored"],
  },
  "alyuminievoe-osteklenie-na-kryshe": {
    title: "Aluminium roof glazing",
    text: ["A skylight: a warm roof over a swimming pool in aluminium profile, mullion-transom construction."],
  },
  "terrasy-provedal": { title: "Terrace glazing with Provedal profile", text: ["Glazing of terraces in private houses with Provedal aluminium profile."] },
  "balkony-provedal": { title: "Provedal sliding balcony glazing", text: ["A sliding balcony glazing system in Provedal aluminium profile."] },
  "moskitnaya-setka-garmoshka": { title: "Pleated mosquito net", text: ["A pleated mosquito net for windows of any type."] },
  "zhk-novaya-rezidenciya": { title: "Novaya Rezidentsiya residential complex", place: "Guryevsk" },
  "zhk-inzhenernyy": { title: "Inzhenerny residential complex", place: "Kaliningrad" },
  "kompleks-vad-holmogorovka": { title: "VAD company complex", place: "Kholmogorovka" },
  "oktyabrskaya-ploshchad-34": { title: "34 Oktyabrskaya Square", place: "Kaliningrad" },
  "gurevskaya-25": { title: "House at 25 Guryevskaya Street", place: "Kaliningrad" },
  "dokuka-22-chkalovsk": { title: "House at 22 Dokuka Street", place: "Chkalovsk" },
  "otdelka-balkonov": { title: "Balcony finishing", place: "Kaliningrad" },
  "steklyannaya-pristroyka": { title: "Glass extension", text: ["A glass extension in aluminium profile."] },
  "dveri-hst-na-poberezhe": { title: "HST doors on the Baltic coast", text: ["Lift-and-slide HST doors in houses on the Baltic coast."] },
  "banki-na-bolshoy-okruzhnoy": { title: "Bathhouses at 35 Bolshaya Okruzhnaya", place: "Kaliningrad" },
  "rollety-i-vorota": { title: "Roller shutters and gates", place: "Kaliningrad" },
  "osteklenie-besedok": { title: "Glazed garden pavilions" },
  "lodzhii-i-balkony": { title: "Glazing of loggias and balconies", place: "Kaliningrad", text: ["Work carried out by the company's specialists in Kaliningrad and the Kaliningrad region."] },
  "roddom-1": { title: "Renovation of Maternity Hospital No. 1", place: "Kaliningrad", text: ["Our company replaced all the doors and windows in two five-storey buildings."] },
  "teatr-tilzit": {
    title: "Tilsit Youth Theatre",
    place: "Sovetsk",
    text: [
      "The theatre building opened in Tilsit in 1893; the first production was Goethe's play Egmont.",
      "During the restoration of the building, European Technologies replaced the theatre's windows.",
    ],
  },
  "kostromskaya-6-8": { title: "Houses at 6–8 Kostromskaya Street", place: "Kaliningrad", text: ["Glazing of new and renovated buildings in Kaliningrad and the Kaliningrad region."] },
}, tags);

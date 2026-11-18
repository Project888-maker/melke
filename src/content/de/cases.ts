import { cases as ru } from "../ru/cases";
import { overlayCases } from "../overlay";

export const caseTags = ["Alle", "Wohnanlagen", "Privathäuser", "Aluminium", "Balkone", "Öffentliche Gebäude", "Zubehör"] as const;

const tags = {
  "Жилые комплексы": "Wohnanlagen",
  "Частные дома": "Privathäuser",
  "Алюминий": "Aluminium",
  "Балконы": "Balkone",
  "Общественные здания": "Öffentliche Gebäude",
  "Аксессуары": "Zubehör",
};

export const cases = overlayCases(ru, {
  "zona-otdyha-s-kuhney-i-barbekyu": {
    title: "Erholungsbereich mit Küche und Grill",
    place: "Straße Kaliningrad – Bagrationowsk",
    text: ["Ein Objekt auf einem Flugplatz für Kleinflugzeuge. Hebe-Schiebe-System Alumark S158, Farbe RAL 7016, Dreifachverglasung. Das System ist mit ausschließlich beweglichen Flügeln oder mit einem festen Teil erhältlich."],
    specs: ["Bautiefe 158 mm", "Füllung von 10 bis 50 mm", "Flügelgewicht bis 440 kg", "Flügelhöhe bis 3300 mm", "Flügelbreite bis 3200 mm", "Elementbreite bis 12 Meter", "Lackierung in jeder RAL-Farbe"],
  },
  "vhodnaya-dver-iz-profilya-melke": {
    title: "Haustür aus Melke-Profil",
    text: [
      "Eine Haustür aus dem Profil Melke Evolution (Klasse 1, Wandstärke 3 mm) mit Cool-Colours-Technologie und 40 mm Dreifachverglasung.",
      "Verbaut sind bewährte deutsche Siegenia-Beschläge: leiser Lauf, sanftes Schließen und Einbruchschutz.",
    ],
    specs: ["Große Farbauswahl, von klassisch bis modern", "Dekor: Buntglas, Patinierung, Fräsungen", "Verglasung von matt bis verspiegelt"],
  },
  "alyuminievoe-osteklenie-na-kryshe": {
    title: "Aluminium-Dachverglasung",
    text: ["Ein Oberlicht: Warmdach über einem Schwimmbad aus Aluminiumprofil in Pfosten-Riegel-Bauweise."],
  },
  "terrasy-provedal": { title: "Terrassenverglasung mit Provedal-Profil", text: ["Verglasung von Terrassen in Privathäusern mit dem Aluminiumprofil Provedal."] },
  "balkony-provedal": { title: "Provedal-Schiebeverglasung für Balkone", text: ["Ein Schiebeverglasungssystem für Balkone im Aluminiumprofil Provedal."] },
  "moskitnaya-setka-garmoshka": { title: "Plissee-Insektenschutz", text: ["Ein Plissee-Insektenschutzgitter für Fenster aller Art."] },
  "zhk-novaya-rezidenciya": { title: "Wohnanlage «Nowaja Residenzija»", place: "Gurjewsk" },
  "zhk-inzhenernyy": { title: "Wohnanlage «Inschenerny»", place: "Kaliningrad" },
  "kompleks-vad-holmogorovka": { title: "Gebäudekomplex der AG «WAD»", place: "Cholmogorowka" },
  "oktyabrskaya-ploshchad-34": { title: "Oktjabrskaja-Platz 34", place: "Kaliningrad" },
  "gurevskaya-25": { title: "Haus in der Gurjewskaja-Straße 25", place: "Kaliningrad" },
  "dokuka-22-chkalovsk": { title: "Haus in der Dokuka-Straße 22", place: "Tschkalowsk" },
  "otdelka-balkonov": { title: "Balkonausbau", place: "Kaliningrad" },
  "steklyannaya-pristroyka": { title: "Glasanbau", text: ["Ein Glasanbau aus Aluminiumprofil."] },
  "dveri-hst-na-poberezhe": { title: "HST-Türen an der Ostseeküste", text: ["Hebe-Schiebe-Türen in Häusern an der Ostseeküste."] },
  "banki-na-bolshoy-okruzhnoy": { title: "Badehäuser an der Bolschaja Okruschnaja 35", place: "Kaliningrad" },
  "rollety-i-vorota": { title: "Rollläden und Tore", place: "Kaliningrad" },
  "osteklenie-besedok": { title: "Verglasung von Gartenpavillons" },
  "lodzhii-i-balkony": { title: "Verglasung von Loggien und Balkonen", place: "Kaliningrad", text: ["Arbeiten unserer Fachleute in Kaliningrad und im Kaliningrader Gebiet."] },
  "roddom-1": { title: "Sanierung der Geburtsklinik Nr. 1", place: "Kaliningrad", text: ["Unser Unternehmen hat in zwei fünfgeschossigen Gebäuden sämtliche Türen und Fenster ausgetauscht."] },
  "teatr-tilzit": {
    title: "Jugendtheater «Tilsit»",
    place: "Sowetsk",
    text: [
      "Das Theatergebäude wurde 1893 in Tilsit eröffnet; als erste Aufführung wurde Goethes «Egmont» gezeigt.",
      "Im Zuge der Restaurierung des Gebäudes hat Europäische Technologien die Fenster des Theaters erneuert.",
    ],
  },
  "kostromskaya-6-8": { title: "Häuser in der Kostromskaja-Straße 6–8", place: "Kaliningrad", text: ["Verglasung von Neubauten und sanierten Häusern in Kaliningrad und im Kaliningrader Gebiet."] },
}, tags);

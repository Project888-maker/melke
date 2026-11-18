import { news as ru } from "../ru/news";
import { overlayNews } from "../overlay";

export const news = overlayNews(ru, {
  "centr-podderzhki-predprinimatelstva": {
    date: "2025-06-14",
    title: "A business plan for expanding production",
    lead: "With the assistance of the Kaliningrad Region Entrepreneurship Support Centre, the company has drawn up a business plan to expand and modernise its production.",
    blocks: [
      {
        text: [
          "With the assistance of the Kaliningrad Region Entrepreneurship Support Centre, European Technologies has developed a business plan for expanding and modernising production.",
          "We are grateful to the centre's staff for their prompt and professional approach. We plan to keep developing our cooperation with the centre.",
        ],
        linkLabel: "My Business centre",
      },
    ],
  },
  "seminar-tendencii-okonnyh-sistem": {
    date: "2025-04-23",
    title: "Seminar: Trends in modern window systems",
    lead: "The company organised a seminar for window industry professionals in Kaliningrad.",
    blocks: [
      {
        text: [
          "On 23 April 2025, in the conference hall of the Radisson hotel in Kaliningrad, European Technologies hosted a seminar for window industry professionals. It was devoted to modern solutions in window systems, aluminium structures and glazing technology.",
          "Leading manufacturers and suppliers of profile and hardware solutions took part: Melke, Siegenia, RALUMA and GlassCom.",
        ],
      },
      {
        title: "COOL COLORS coating from Melke",
        text: ["Melke presented its improved PVC profiles. The COOL COLORS coating stood out: a technology that helps profiles keep their appearance longer and resist heating and fading in sunlight."],
      },
      {
        title: "Siegenia window hardware",
        text: ["Siegenia showed its latest developments in window hardware: systems that combine functionality, security and comfort."],
      },
      {
        title: "RALUMA pergolas and frameless glazing",
        list: [
          "Pergolas and bioclimatic roofs for terraces and outdoor spaces",
          "Frameless glazing that creates an effect of complete transparency",
          "Partitions and opening systems: lift, slide and folding",
        ],
      },
      {
        title: "GlassCom's new-generation glazing unit",
        text: ["GlassCom presented the EnergyLight glazing unit, developed together with the Chromatech spacer. The combination delivers energy efficiency, light transmission and durability."],
      },
      {
        text: ["The seminar was an opportunity to share experience, talk to industry professionals and see the latest developments in PVC windows, hardware and architectural glazing."],
      },
    ],
  },
});

/**
 * Writes agent/brain.json: Draft's voice instructions, greeting and site map
 * for every language, built from the same content the pages render.
 * Run `npm run brain` after changing site content, then redeploy the agent.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { greeting, instructions, siteMap } from "../src/lib/assistant/brain";
import { locales } from "../src/lib/i18n";

const brain = Object.fromEntries(
  locales.map((lang) => [
    lang,
    {
      instructions: instructions(lang, "voice"),
      greeting: greeting[lang],
      paths: siteMap(lang).map((p) => p.path),
    },
  ]),
);

const out = resolve(process.cwd(), "agent/brain.json");
writeFileSync(out, JSON.stringify(brain, null, 1));
console.log(`brain.json written: ${Object.entries(brain).map(([l, b]) => `${l} ${Math.round(b.instructions.length / 1000)}k chars`).join(", ")}`);

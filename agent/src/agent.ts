/**
 * Draft, the ET voice assistant.
 *
 * A visitor presses "Speak" on the site, the site asks /api/voice/token for a
 * room, and LiveKit dispatches this agent into it. Draft listens, answers
 * aloud and drives the visitor's browser (opens pages, scrolls, opens the
 * request form) through the "site.action" RPC method.
 *
 * Speech recognition, the language model and the voice all run on LiveKit
 * Inference, so the only credentials needed are the LiveKit ones. Setting
 * VOICE_LLM_BASE_URL / VOICE_LLM_API_KEY / VOICE_LLM_MODEL swaps the brain for
 * any OpenAI-compatible endpoint instead.
 */
import { type JobContext, ServerOptions, cli, defineAgent, getJobContext, inference, llm, voice } from "@livekit/agents";
import * as openai from "@livekit/agents-plugin-openai";
import dotenv from "dotenv";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "zod";

dotenv.config({ path: [".env.local", ".env"], quiet: true });

type Lang = "ru" | "en" | "de";
type Brain = Record<Lang, { instructions: string; greeting: string; paths: string[] }>;

const brain = JSON.parse(readFileSync(new URL("../brain.json", import.meta.url), "utf8")) as Brain;
const env = (name: string, fallback: string) => process.env[name]?.trim() || fallback;

/** Models. Every one can be changed with an environment variable, no code edit. */
const STT_MODEL = env("VOICE_STT_MODEL", "deepgram/nova-3");
/** "multi" lets the visitor switch between Russian, English and German mid-call. */
const STT_LANGUAGE = env("VOICE_STT_LANGUAGE", "multi");
const LLM_MODEL = env("VOICE_LLM_MODEL", "openai/gpt-5.4-mini");
const TTS_MODEL = env("VOICE_TTS_MODEL", "cartesia/sonic-3");
const ttsVoice = (lang: Lang) => process.env[`VOICE_TTS_VOICE_${lang.toUpperCase()}`]?.trim() || process.env.VOICE_TTS_VOICE?.trim() || undefined;

function brainModel() {
  const baseURL = process.env.VOICE_LLM_BASE_URL?.trim();
  const apiKey = process.env.VOICE_LLM_API_KEY?.trim();
  if (baseURL && apiKey) return new openai.LLM({ baseURL, apiKey, model: LLM_MODEL });
  return new inference.LLM({ model: LLM_MODEL as inference.LLMModels });
}

/** Runs an action in the visitor's browser and returns what the site answered. */
async function onSite(name: string, args: Record<string, unknown>): Promise<string> {
  const room = getJobContext().room;
  const visitor = [...room.remoteParticipants.values()].find((p) => p.identity.startsWith("visitor-"));
  if (!visitor || !room.localParticipant) throw new llm.ToolError("The visitor's browser is not connected.");
  try {
    return await room.localParticipant.performRpc({
      destinationIdentity: visitor.identity,
      method: "site.action",
      payload: JSON.stringify({ name, args }),
      responseTimeout: 8000,
    });
  } catch {
    throw new llm.ToolError("The site did not respond. Carry on by voice and try again later.");
  }
}

function tools(lang: Lang) {
  const paths = brain[lang].paths;
  return [
    llm.tool({
      name: "show_page",
      description: "Open a page of the ET website on the visitor's screen, optionally scrolling to a section of it.",
      parameters: z.object({
        path: z.string().describe("Page path from the site map. Empty string is the home page."),
        section: z.string().optional().describe("Optional section id of that page to scroll to."),
      }),
      execute: async ({ path, section }) => {
        const clean = path.replace(/^\/+|\/+$/g, "");
        if (!paths.includes(clean)) throw new llm.ToolError(`No such page: "${path}". Use a path from the site map.`);
        return onSite("show_page", section ? { path: clean, section } : { path: clean });
      },
    }),
    llm.tool({
      name: "scroll_page",
      description: "Scroll the page the visitor is looking at.",
      parameters: z.object({ to: z.string().describe('One of "down", "up", "top", "bottom", or a section id of the current page.') }),
      execute: async ({ to }) => onSite("scroll_page", { to }),
    }),
    llm.tool({
      name: "open_request_form",
      description: "Open the request form so the visitor can leave their name and phone number.",
      parameters: z.object({
        kind: z.enum(["measure", "calc", "consult", "office"]).describe("measure = free measurement, calc = quote, consult = question for a manager, office = office visit."),
        system: z.string().optional().describe("Product the visitor is interested in, for example Melke Centum."),
        note: z.string().optional().describe("Short note for the manager about what the visitor needs."),
      }),
      execute: async (args) => onSite("open_request_form", args),
    }),
    llm.tool({
      name: "handoff_to_manager",
      description: "Pass the conversation to a human manager: opens the consultation form with a summary of the visitor's need.",
      parameters: z.object({ summary: z.string().describe("One sentence: what the visitor needs from the manager.") }),
      execute: async ({ summary }) => onSite("handoff_to_manager", { summary }),
    }),
  ];
}

function jobSetup(ctx: JobContext): { lang: Lang; page: string } {
  try {
    const meta = JSON.parse(ctx.job.metadata || "{}") as { lang?: string; page?: string };
    const lang = meta.lang === "en" || meta.lang === "de" ? meta.lang : "ru";
    return { lang, page: typeof meta.page === "string" ? meta.page.slice(0, 200) : "" };
  } catch {
    return { lang: "ru", page: "" };
  }
}

export default defineAgent({
  entry: async (ctx: JobContext) => {
    const { lang, page } = jobSetup(ctx);
    const b = brain[lang];

    const agent = new voice.Agent({
      instructions: page ? `${b.instructions}\n\n# Right now\nThe visitor started this call from the page "${page}".` : b.instructions,
      tools: tools(lang),
    });

    const session = new voice.AgentSession({
      stt: new inference.STT({ model: STT_MODEL as never, language: STT_LANGUAGE as never }),
      llm: brainModel(),
      tts: new inference.TTS({ model: TTS_MODEL as never, voice: ttsVoice(lang), language: lang }),
      turnHandling: { turnDetection: new inference.TurnDetector() },
      maxToolSteps: 4,
    });

    await session.start({ agent, room: ctx.room });
    await ctx.connect();
    await ctx.waitForParticipant();
    session.say(b.greeting, { allowInterruptions: true });
  },
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  cli.runApp(new ServerOptions({ agent: fileURLToPath(import.meta.url), agentName: env("LIVEKIT_AGENT_NAME", "draft") }));
}

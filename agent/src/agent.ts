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
import { type JobContext, ServerOptions, cli, defineAgent, inference, llm, voice } from "@livekit/agents";
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
/** "multi" lets the visitor switch between Russian, English and German mid-call. Can be set per site language, e.g. VOICE_STT_LANGUAGE_RU=ru. */
const sttLanguage = (lang: Lang) => process.env[`VOICE_STT_LANGUAGE_${lang.toUpperCase()}`]?.trim() || env("VOICE_STT_LANGUAGE", "multi");
/** Optional product names to help recognition, comma separated (VOICE_STT_KEYTERMS). */
const STT_KEYTERMS = (process.env.VOICE_STT_KEYTERMS ?? "").split(",").map((t) => t.trim()).filter(Boolean);
const LLM_MODEL = env("VOICE_LLM_MODEL", "openai/gpt-5.4-mini");
const TTS_MODEL = env("VOICE_TTS_MODEL", "inworld/inworld-tts-2");
/** Voices chosen for natural Russian, German and English on the model above. */
const DEFAULT_VOICE: Record<Lang, string> = { ru: "Dmitry", de: "Josef", en: "Dennis" };
const ttsVoice = (lang: Lang) => process.env[`VOICE_TTS_VOICE_${lang.toUpperCase()}`]?.trim() || process.env.VOICE_TTS_VOICE?.trim() || DEFAULT_VOICE[lang];

function brainModel() {
  const baseURL = process.env.VOICE_LLM_BASE_URL?.trim();
  const apiKey = process.env.VOICE_LLM_API_KEY?.trim();
  if (baseURL && apiKey) return new openai.LLM({ baseURL, apiKey, model: LLM_MODEL });
  return new inference.LLM({ model: LLM_MODEL as inference.LLMModels });
}

/**
 * Draft answers in the visitor's language, whatever language the site is
 * open in, so the voice has to follow the words: a Russian answer read by
 * the English voice is unintelligible.
 */
const GERMAN = /[äöüß]|\b(ich|und|nicht|bitte|danke|hallo|guten|wie|was|ist|sind|haben|möchte|fenster|preis|kosten|ja|nein|für|mit|ein|eine|der|die|das|wir|sie|können|zeigen|gerne|ihnen)\b/gi;
const ENGLISH = /\b(the|and|you|your|please|thanks|thank|hello|hi|what|how|is|are|have|would|like|window|windows|price|cost|yes|no|for|with|a|an|we|can|show|me|i|do|does|much|want|need|of|to|our)\b/gi;
const count = (text: string, re: RegExp) => (text.match(re) ?? []).length;
const letters = (text: string) => ({ cyrillic: count(text, /[а-яё]/gi), latin: count(text, /[a-zäöüß]/gi) });

/** German or English, for text in Latin script; null when it is too short to tell. */
export function latinLanguage(text: string): "de" | "en" | null {
  const de = count(text, GERMAN);
  const en = count(text, ENGLISH);
  return de === en ? null : de > en ? "de" : "en";
}

/** Language of a reply Draft is about to say. `latin` is used when German and English cannot be told apart. */
export function languageOf(text: string, latin: "de" | "en"): Lang {
  const { cyrillic, latin: lat } = letters(text);
  if (cyrillic >= 2 && cyrillic * 2 >= lat) return "ru"; // product names stay in Latin inside Russian speech
  return latinLanguage(text) ?? latin;
}

/** Draft with a voice that switches between Russian, German and English reply by reply. */
class Draft extends voice.Agent {
  /** Last Latin-script language heard from the visitor or used by Draft. */
  latin: "de" | "en";
  #said: Lang;
  constructor(options: voice.AgentOptions<unknown>, private readonly voiceOut: inference.TTS<never>, lang: Lang) {
    super(options);
    this.#said = lang;
    this.latin = lang === "de" ? "de" : "en";
  }

  override async ttsNode(text: Parameters<voice.Agent["ttsNode"]>[0], modelSettings: Parameters<voice.Agent["ttsNode"]>[1]) {
    // Read the first words of the reply, pick the voice for their language, then hand everything on.
    const source = (text as AsyncIterable<string>)[Symbol.asyncIterator]();
    const head: string[] = [];
    let done = false;
    for (;;) {
      const next = await source.next();
      if (next.done) { done = true; break; }
      head.push(next.value);
      const { cyrillic, latin } = letters(head.join(""));
      if ((cyrillic >= 12 && cyrillic >= latin) || cyrillic + latin >= 48) break;
    }
    const lang = languageOf(head.join(""), this.latin);
    if (lang !== "ru") this.latin = lang;
    if (lang !== this.#said) {
      this.#said = lang;
      this.voiceOut.updateOptions({ voice: ttsVoice(lang), language: lang as never });
    }
    async function* whole() {
      yield* head;
      if (done) return;
      for (;;) {
        const next = await source.next();
        if (next.done) return;
        yield next.value;
      }
    }
    return voice.Agent.default.ttsNode(this, whole(), modelSettings);
  }
}

/** Runs an action in the visitor's browser and returns what the site answered. */
// The room is passed in explicitly: getJobContext() is not available inside tool execution (async context is lost there).
async function onSite(room: JobContext["room"], name: string, args: Record<string, unknown>, responseTimeout = 8000): Promise<string> {
  const visitor = [...room.remoteParticipants.values()].find((p) => p.identity.startsWith("visitor-"));
  if (!visitor || !room.localParticipant) throw new llm.ToolError("The visitor's browser is not connected.");
  try {
    return await room.localParticipant.performRpc({
      destinationIdentity: visitor.identity,
      method: "site.action",
      payload: JSON.stringify({ name, args }),
      responseTimeout,
    });
  } catch {
    throw new llm.ToolError("The site did not respond. Carry on by voice and try again later.");
  }
}

const formArgs = z.object({
  kind: z.enum(["measure", "calc", "consult", "office"]).describe("measure = free measurement, calc = quote, consult = question for a manager, office = office visit."),
  name: z.string().describe("The visitor's name, as they said it."),
  phone: z.string().describe("The visitor's phone number, digits only, with the country code. Russian numbers: 11 digits starting with 7."),
  comment: z.string().optional().describe("What the manager should know: object, number of windows, wishes. In the visitor's language."),
  system: z.string().optional().describe("Product the visitor is interested in, for example Melke Centum."),
  count: z.number().int().min(1).max(99).optional().describe("Number of windows, if the visitor said it."),
});

function tools(lang: Lang, room: JobContext["room"]) {
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
        return onSite(room, "show_page", section ? { path: clean, section } : { path: clean });
      },
    }),
    llm.tool({
      name: "scroll_page",
      description: "Scroll the page the visitor is looking at.",
      parameters: z.object({ to: z.string().describe('One of "down", "up", "top", "bottom", or a section id of the current page.') }),
      execute: async ({ to }) => onSite(room, "scroll_page", { to }),
    }),
    llm.tool({
      name: "open_request_form",
      description: "Open the request form so the visitor can leave their name and phone number.",
      parameters: z.object({
        kind: z.enum(["measure", "calc", "consult", "office"]).describe("measure = free measurement, calc = quote, consult = question for a manager, office = office visit."),
        system: z.string().optional().describe("Product the visitor is interested in, for example Melke Centum."),
        note: z.string().optional().describe("Short note for the manager about what the visitor needs."),
      }),
      execute: async (args) => onSite(room, "open_request_form", args),
    }),
    llm.tool({
      name: "fill_request_form",
      description: "Fill in the request form on the visitor's screen with what they told you (opens the form if it is not open). Does not send it. Call it as soon as you have the name or the phone, and again when they correct something.",
      parameters: formArgs.partial({ name: true, phone: true }),
      execute: async (args) => onSite(room, "fill_request_form", args, 12000),
    }),
    llm.tool({
      name: "submit_request_form",
      description: "Send the filled-in request to the managers. Only after the visitor has confirmed that the name and phone number you read back are correct.",
      parameters: formArgs,
      execute: async (args) => onSite(room, "submit_request_form", args, 15000),
    }),
    llm.tool({
      name: "handoff_to_manager",
      description: "Pass the conversation to a human manager: opens the consultation form with a summary of the visitor's need.",
      parameters: z.object({ summary: z.string().describe("One sentence: what the visitor needs from the manager.") }),
      execute: async ({ summary }) => onSite(room, "handoff_to_manager", { summary }),
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

    const tts = new inference.TTS<never>({ model: TTS_MODEL as never, voice: ttsVoice(lang), language: lang });
    const agent = new Draft(
      {
        instructions: page ? `${b.instructions}\n\n# Right now\nThe visitor started this call from the page "${page}".` : b.instructions,
        tools: tools(lang, ctx.room),
      },
      tts,
      lang,
    );

    const session = new voice.AgentSession({
      stt: new inference.STT({
        model: STT_MODEL as never,
        language: sttLanguage(lang) as never,
        ...(STT_KEYTERMS.length ? { modelOptions: { keyterm: STT_KEYTERMS } as never } : {}),
      }),
      llm: brainModel(),
      tts,
      turnHandling: { turnDetection: new inference.TurnDetector() },
      maxToolSteps: 4,
    });

    // Remember whether the visitor's Latin-script speech is German or English, for short replies that do not show it.
    session.on(voice.AgentSessionEventTypes.UserInputTranscribed, (ev) => {
      if (!ev.isFinal) return;
      const heard = latinLanguage(ev.transcript);
      if (heard && letters(ev.transcript).cyrillic === 0) agent.latin = heard;
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

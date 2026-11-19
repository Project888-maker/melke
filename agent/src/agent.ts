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
/**
 * Speech recognition language at the start of a call, per site language. The Russian page listens for Russian only
 * from the first second; the English and German pages start open ("multi", limited to ru/en/de) and lock to Russian
 * on the first clear Russian. Override with VOICE_STT_LANGUAGE_RU / _EN / _DE or VOICE_STT_LANGUAGE.
 */
const sttLanguage = (lang: Lang) =>
  process.env[`VOICE_STT_LANGUAGE_${lang.toUpperCase()}`]?.trim() || process.env.VOICE_STT_LANGUAGE?.trim() || (lang === "ru" ? "ru" : "multi");
/**
 * Optional: send Deepgram's language_hint (ru, en, de) while recognition is open (VOICE_STT_LANGUAGE_HINT=on).
 * Off by default: tested on 237 clips on 19 Nov 2026, LiveKit Inference returned identical transcripts with and
 * without it (Russian was still misheard as Spanish, Arabic, Greek, Telugu), so the language lock below does the work.
 */
const STT_HINT_ON = (process.env.VOICE_STT_LANGUAGE_HINT ?? "").trim().toLowerCase() === "on";
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

/** Language of a reply Draft is about to say. `fallback` is used when the text alone does not show it. */
export function languageOf(text: string, fallback: Lang): Lang {
  const { cyrillic, latin: lat } = letters(text);
  // Product names (Melke Centum, Smart Ultra, Provedal) stay in Latin inside Russian speech, so Latin letters alone
  // do not make a reply English or German: it also needs English or German words.
  const latinWords = latinLanguage(text);
  if (cyrillic >= 2 && (cyrillic * 2 >= lat || latinWords === null)) return "ru";
  return latinWords ?? fallback;
}

/** Letters in scripts other than Latin and Cyrillic (Devanagari, Hebrew, Arabic, CJK ...): a sign of misheard speech. */
export const foreignLetters = (text: string) => count(text, /[^\s\d\p{P}\p{S}Ѐ-ӿA-Za-zÀ-ÿ]/gu);

/** What a final transcript says about the conversation language while it is still open. */
export function lockFromTranscript(text: string): { lang: Lang; why: string } | null {
  if (letters(text).cyrillic >= 6) return { lang: "ru", why: "Cyrillic speech" };
  if (foreignLetters(text) >= 2) return { lang: "ru", why: "speech heard in a foreign script, taken as misheard Russian" };
  return null;
}

const STT_HINT = ["ru", "en", "de"];
/** Endpointing (ms of silence before the visitor's turn ends). Normal = the SDK default for the audio turn detector. */
const NORMAL_ENDPOINTING = { minDelay: Number(env("VOICE_ENDPOINTING_MIN_MS", "300")), maxDelay: Number(env("VOICE_ENDPOINTING_MAX_MS", "2500")) };
const DICTATION_ENDPOINTING = { minDelay: Number(env("VOICE_DICTATION_MIN_MS", "1600")), maxDelay: Number(env("VOICE_DICTATION_MAX_MS", "5000")) };
const LANG_NAME: Record<Lang, string> = { ru: "Russian", en: "English", de: "German" };

/**
 * Draft with a voice that switches between Russian, German and English reply by reply, and a conversation
 * language that, once locked, also fixes speech recognition to that one language.
 */
class Draft extends voice.Agent {
  /** Last Latin-script language heard from the visitor or used by Draft. */
  latin: "de" | "en";
  /** Conversation language once known; null while it is still open (English and German pages, first words). */
  locked: Lang | null = null;
  #said: Lang;
  constructor(
    options: voice.AgentOptions<unknown>,
    private readonly voiceOut: inference.TTS<never>,
    private readonly ears: inference.STT<never>,
    lang: Lang,
  ) {
    super(options);
    this.#said = lang;
    this.latin = lang === "de" ? "de" : "en";
  }

  /** Adds the digits of a dictated number to the visitor's words, so the language model gets them exactly. */
  override async onUserTurnCompleted(_chatCtx: llm.ChatContext, newMessage: llm.ChatMessage): Promise<void> {
    const text = newMessage.textContent ?? "";
    if (numberWords(text) < 3) return;
    const groups = spokenDigits(text);
    const all = groups.replace(/\s/g, "");
    if (all.length < 3) return;
    newMessage.content = [`${text} [speech recognition, as digits: ${groups} = ${all} (${all.length} digits)]`];
  }

  /** Fixes the conversation language: speech recognition hears only it, and the voice falls back to it. */
  lock(lang: Lang, why: string) {
    if (this.locked === lang) return;
    this.locked = lang;
    if (lang !== "ru") this.latin = lang;
    this.ears.updateOptions({ language: lang as never });
    console.log(`[draft] language locked to ${lang} (${why})`);
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
    const lang = languageOf(head.join(""), this.locked ?? this.latin);
    if (lang !== "ru") this.latin = lang;
    if (lang !== this.#said) {
      this.#said = lang;
      this.voiceOut.updateOptions({ voice: ttsVoice(lang), language: lang as never });
      console.log(`[draft] voice switched to ${lang}`);
    }
    async function* whole() {
      try {
        yield* head;
        if (done) return;
        for (;;) {
          const next = await source.next();
          if (next.done) { done = true; return; }
          yield next.value;
        }
      } finally {
        // On an interruption the TTS node cancels this generator; pass that on to the reply text stream.
        if (!done) await source.return?.();
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

const phoneDigits = (phone: string | undefined) => (phone ?? "").replace(/\D/g, "");

/**
 * What has been put into the request form during this call. A request is only sent with the name and phone that
 * were filled in (so the visitor saw them and heard them read back), with 11 digits, and after the visitor has
 * answered since then. This holds even if the language model is tempted to send early.
 */
export class FormState {
  name = "";
  phone = "";
  visitorTurnsSinceFill = 0;
  filled(args: { name?: string; phone?: string }) {
    if (args.name?.trim()) this.name = args.name.trim();
    if (args.phone?.trim()) this.phone = phoneDigits(args.phone);
    this.visitorTurnsSinceFill = 0;
  }
  visitorSpoke() { this.visitorTurnsSinceFill++; }
  sent() { this.name = ""; this.phone = ""; this.visitorTurnsSinceFill = 0; }
  refuseSubmit(args: { name: string; phone: string }): string | null {
    const digits = phoneDigits(args.phone);
    if (digits.length !== 11) return `Not sent: the phone number has ${digits.length} digits, 11 are needed. Ask the visitor for the missing digits.`;
    if (digits !== this.phone || args.name.trim().toLowerCase() !== this.name.toLowerCase())
      return "Not sent: these details are not in the form yet. Call fill_request_form with them, read the name and phone back to the visitor and wait for their yes.";
    if (this.visitorTurnsSinceFill === 0) return "Not sent yet: read the name and phone back to the visitor and wait for their yes first.";
    return null;
  }
}

/** Number words and digits in Russian, English and German: the visitor is dictating a phone number. */
const NUMBER_WORD = /\d|(?<!\p{L})(ноль|один|одна|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять|\p{L}*надцать|двадцать|тридцать|сорок|пятьдесят|шестьдесят|семьдесят|восемьдесят|девяносто|сто|двести|триста|четыреста|пятьсот|шестьсот|семьсот|восемьсот|девятьсот|плюс|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\p{L}*teen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|plus|null|eins|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|\p{L}*zehn|\p{L}*zig|hundert)(?!\p{L})/giu;
export const numberWords = (text: string) => (text.match(NUMBER_WORD) ?? []).length;
const NUM: Record<string, [number, number]> = {}; // word -> [value, place: 0 units, 1 teens/tens, 2 hundreds]
const addNums = (place: number, words: string, values: number[]) => words.split(" ").forEach((w, i) => (NUM[w] = [values[i], place]));
addNums(0, "ноль один одна два две три четыре пять шесть семь восемь девять", [0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9]);
addNums(1, "десять одиннадцать двенадцать тринадцать четырнадцать пятнадцать шестнадцать семнадцать восемнадцать девятнадцать", [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
addNums(1, "двадцать тридцать сорок пятьдесят шестьдесят семьдесят восемьдесят девяносто", [20, 30, 40, 50, 60, 70, 80, 90]);
addNums(2, "сто двести триста четыреста пятьсот шестьсот семьсот восемьсот девятьсот", [100, 200, 300, 400, 500, 600, 700, 800, 900]);
addNums(0, "zero oh one two three four five six seven eight nine", [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
addNums(1, "ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety", [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50, 60, 70, 80, 90]);
addNums(0, "null eins zwei drei vier fünf sechs sieben acht neun", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
addNums(1, "zehn elf zwölf zwanzig dreißig vierzig fünfzig sechzig siebzig achtzig neunzig", [10, 11, 12, 20, 30, 40, 50, 60, 70, 80, 90]);

/**
 * Digits of a number dictated in words, group by group ("восемь, девятьсот пятьдесят, триста сорок" -> "8 950 340").
 * Speech recognition writes Russian phone numbers as words, and the language model then does not trust them.
 */
export function spokenDigits(text: string): string {
  const groups: string[] = [];
  let cur: number | null = null, last: number | null = null;
  const flush = () => { if (cur !== null) groups.push(String(cur)); cur = null; last = null; };
  for (const raw of text.toLowerCase().replace(/ё/g, "е").split(/[^\p{L}\d+]+/u)) {
    if (!raw) continue;
    if (/^\+?\d+$/.test(raw)) { flush(); groups.push(raw.replace("+", "")); continue; }
    const hit = NUM[raw];
    if (!hit) { if (raw !== "плюс" && raw !== "plus") flush(); continue; }
    const [v, p] = hit;
    // a new group starts when the place does not go down (hundreds -> tens -> units), or after a teen
    if (cur === null || last === null || p >= last || (last === 1 && cur % 10 !== 0)) { flush(); cur = v; last = p; }
    else { cur += v; last = p; }
  }
  flush();
  return groups.join(" ");
}

/** Draft asked for the phone number. */
export const asksForPhone = (text: string) =>
  /телефон|номер|phone|number|telefon|nummer/i.test(text) &&
  /продикт|подскаж|скажите|назовите|ваш номер|ваш телефон|your (phone|number)|what('s| is) (the|your)|what (phone|number)|which (phone|number)|ihre (telefon|nummer)|wie lautet|nennen sie/i.test(text);

function tools(lang: Lang, room: JobContext["room"], switchLanguage: (lang: Lang) => void, form: FormState) {
  const paths = brain[lang].paths;
  return [
    llm.tool({
      name: "switch_language",
      description: "Switch the conversation to another language when the visitor asks you to speak it. Speech recognition then listens for that language only.",
      parameters: z.object({ lang: z.enum(["ru", "en", "de"]).describe("ru = Russian, en = English, de = German.") }),
      execute: async ({ lang: to }) => {
        switchLanguage(to);
        return `The conversation language is now ${LANG_NAME[to]}. Answer in ${LANG_NAME[to]} from now on.`;
      },
    }),
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
      execute: async (args) => {
        const answer = await onSite(room, "fill_request_form", args, 12000);
        form.filled(args);
        return answer;
      },
    }),
    llm.tool({
      name: "submit_request_form",
      description: "Send the filled-in request to the managers. Only after the visitor has confirmed that the name and phone number you read back are correct.",
      parameters: formArgs,
      execute: async (args) => {
        const refusal = form.refuseSubmit(args);
        if (refusal) throw new llm.ToolError(refusal);
        const answer = await onSite(room, "submit_request_form", args, 15000);
        form.sent();
        return answer;
      },
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
    // No transcripts in the logs: they can contain names and phone numbers.
    console.log(`[draft] call started: site language ${lang}, page "${page}"`);

    const tts = new inference.TTS<never>({ model: TTS_MODEL as never, voice: ttsVoice(lang), language: lang });
    // Open recognition ("multi") guesses among dozens of languages and turns Russian into Hindi, Hebrew, Spanish and
    // so on, so the call is locked to one language as early as possible (see Draft.lock).
    const startLanguage = sttLanguage(lang);
    const modelOptions = {
      ...(STT_HINT_ON ? { language_hint: STT_HINT } : {}),
      ...(STT_KEYTERMS.length ? { keyterm: STT_KEYTERMS } : {}),
    };
    const stt = new inference.STT<never>({
      model: STT_MODEL as never,
      language: startLanguage as never,
      ...(Object.keys(modelOptions).length ? { modelOptions: modelOptions as never } : {}),
    });
    let agentRef: Draft | undefined;
    const form = new FormState();
    const agent = new Draft(
      {
        instructions: page ? `${b.instructions}\n\n# Right now\nThe visitor started this call from the page "${page}".` : b.instructions,
        tools: tools(lang, ctx.room, (to) => agentRef?.lock(to, "switch_language tool"), form),
      },
      tts,
      stt,
      lang,
    );
    agentRef = agent;
    // A single-language start (the Russian page by default) is the conversation language from the first second.
    if (startLanguage !== "multi") {
      agent.locked = (["ru", "en", "de"] as Lang[]).includes(startLanguage as Lang) ? (startLanguage as Lang) : null;
      if (agent.locked) console.log(`[draft] language locked to ${agent.locked} (site language)`);
    }

    const session = new voice.AgentSession({
      stt,
      llm: brainModel(),
      tts,
      turnHandling: { turnDetection: new inference.TurnDetector(), endpointing: NORMAL_ENDPOINTING },
      maxToolSteps: 4,
    });

    // A phone number is said in groups with pauses ("eight, nine eleven, one two three ..."). With the normal
    // endpointing each pause ends the visitor's turn and Draft hears only pieces of the number, so while a number
    // is being asked for or dictated the visitor gets a longer pause before their turn ends.
    let dictating = false;
    const dictation = (on: boolean, why: string) => {
      if (on === dictating) return;
      dictating = on;
      session.updateOptions({ turnHandling: { endpointing: on ? DICTATION_ENDPOINTING : NORMAL_ENDPOINTING } });
      console.log(`[draft] dictation mode ${on ? "on" : "off"} (${why})`);
    };
    session.on(voice.AgentSessionEventTypes.ConversationItemAdded, (ev) => {
      const item = ev.item as { role?: string; textContent?: string };
      if (item.role === "user") form.visitorSpoke(); // a committed visitor turn, not a transcript fragment
      if (item.role !== "assistant" || !item.textContent) return;
      if (asksForPhone(item.textContent)) dictation(true, "Draft asked for the phone number");
      else if (numberWords(item.textContent) < 4) dictation(false, "Draft moved on");
    });

    session.on(voice.AgentSessionEventTypes.UserInputTranscribed, (ev) => {
      if (numberWords(ev.transcript) >= 2) dictation(true, "visitor is saying digits");
      if (!ev.isFinal) return;
      // Remember whether the visitor's Latin-script speech is German or English, for short replies that do not show it.
      const heard = latinLanguage(ev.transcript);
      if (heard && letters(ev.transcript).cyrillic === 0) agent.latin = heard;
      // While the language is open, the first clear Russian (or misheard Russian) locks it.
      if (!agent.locked) {
        const found = lockFromTranscript(ev.transcript);
        if (found) agent.lock(found.lang, found.why);
      }
    });

    // The site sets the visitor's participant attribute "lang" when they tap a language button during the call.
    const fromAttribute = (value: string | undefined) => {
      if (value === "ru" || value === "en" || value === "de") agent.lock(value, "language button on the site");
    };
    ctx.room.on("participantAttributesChanged", (changed: Record<string, string>, p: { identity: string }) => {
      if (p.identity.startsWith("visitor-") && "lang" in changed) fromAttribute(changed.lang);
    });

    await session.start({ agent, room: ctx.room });
    await ctx.connect();
    const visitor = await ctx.waitForParticipant();
    if (visitor.attributes?.lang && visitor.attributes.lang !== lang) fromAttribute(visitor.attributes.lang);
    session.say(b.greeting, { allowInterruptions: true });
  },
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  cli.runApp(new ServerOptions({ agent: fileURLToPath(import.meta.url), agentName: env("LIVEKIT_AGENT_NAME", "draft") }));
}

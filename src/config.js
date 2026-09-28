export const EXPLANATION_WORD_LIMIT = 30;
export const MAX_SCORE = 100;
export const TIMED_ASSESSMENT_DURATIONS_MIN = [15, 30, 45];

export const AI_PROVIDER = process.env.AI_PROVIDER ?? "gemini";

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";
export const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-5";

export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.1-8b-instruct:free";

export const PORT = Number(process.env.PORT ?? 4000);

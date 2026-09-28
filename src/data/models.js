export const PROVIDER_CATALOG = [
  {
    id: "gemini",
    label: "Google Gemini",
    models: [
      { id: "gemini-flash-latest", label: "Gemini Flash (latest)" },
      { id: "gemini-flash-lite-latest", label: "Gemini Flash Lite (latest)" },
      { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash" },
      { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    ],
  },
  {
    id: "openai",
    label: "OpenAI",
    models: [
      { id: "gpt-4o-mini", label: "GPT-4o mini" },
      { id: "gpt-4o", label: "GPT-4o" },
      { id: "gpt-4.1-mini", label: "GPT-4.1 mini" },
    ],
  },
  {
    id: "anthropic",
    label: "Anthropic Claude",
    models: [
      { id: "claude-haiku-4-5", label: "Claude Haiku 4.5 (cheapest)" },
      { id: "claude-sonnet-5", label: "Claude Sonnet 5" },
      { id: "claude-opus-5", label: "Claude Opus 5" },
    ],
  },
  {
    id: "openrouter",
    label: "OpenRouter (free models)",
    models: [
      { id: "meta-llama/llama-3.1-8b-instruct:free", label: "Llama 3.1 8B (free)" },
      { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B (free)" },
      { id: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash Exp (free)" },
      { id: "deepseek/deepseek-chat-v3.1:free", label: "DeepSeek Chat v3.1 (free)" },
      { id: "qwen/qwen-2.5-72b-instruct:free", label: "Qwen 2.5 72B (free)" },
    ],
  },
];

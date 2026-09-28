import {
  AI_PROVIDER,
  ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL,
  GEMINI_API_KEY,
  GEMINI_MODEL,
  OPENAI_API_KEY,
  OPENAI_MODEL,
  OPENROUTER_API_KEY,
  OPENROUTER_MODEL,
} from "../config.js";

function extractJson(raw) {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : raw).trim();
}

class GeminiProvider {
  async generateJson(prompt, { apiKey, model } = {}) {
    const key = apiKey || GEMINI_API_KEY;
    const mdl = model || GEMINI_MODEL;

    if (!key) throw new Error("Gemini API key is not set");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${mdl}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!res.ok)
      throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Gemini response missing text");

    return extractJson(text);
  }
}

class OpenAiProvider {
  async generateJson(prompt, { apiKey, model } = {}) {
    const key = apiKey || OPENAI_API_KEY;
    const mdl = model || OPENAI_MODEL;
    if (!key) throw new Error("OpenAI API key is not set");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: mdl,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok)
      throw new Error(`OpenAI API error: ${res.status} ${await res.text()}`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("OpenAI response missing content");
    return extractJson(text);
  }
}

class AnthropicProvider {
  async generateJson(prompt, { apiKey, model } = {}) {
    const key = apiKey || ANTHROPIC_API_KEY;
    const mdl = model || ANTHROPIC_MODEL;
    if (!key) throw new Error("Anthropic API key is not set");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: mdl,
        max_tokens: 8192,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok)
      throw new Error(`Anthropic API error: ${res.status} ${await res.text()}`);
    const data = await res.json();
    const textBlock = data?.content?.find((block) => block.type === "text");
    if (!textBlock) throw new Error("Anthropic response missing text");
    return extractJson(textBlock.text);
  }
}

class OpenRouterProvider {
  async generateJson(prompt, { apiKey, model } = {}) {
    const key = apiKey || OPENROUTER_API_KEY;
    const mdl = model || OPENROUTER_MODEL;
    if (!key) throw new Error("OpenRouter API key is not set");
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: mdl,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok)
      throw new Error(
        `OpenRouter API error: ${res.status} ${await res.text()}`,
      );
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("OpenRouter response missing content");
    return extractJson(text);
  }
}

const providers = {
  gemini: new GeminiProvider(),
  openai: new OpenAiProvider(),
  anthropic: new AnthropicProvider(),
  openrouter: new OpenRouterProvider(),
};

export function getAiProvider(name = AI_PROVIDER) {
  const provider = providers[name];
  if (!provider) throw new Error(`Unknown AI provider: ${name}`);
  return provider;
}

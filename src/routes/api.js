import express from "express";
import { z } from "zod";
import { TAG_CATEGORIES } from "../data/tags.js";
import { PROVIDER_CATALOG } from "../data/models.js";
import { createSession, getSession, submitSession } from "../sessions.js";
import { testModel } from "../ai/service.js";
import {
  ANTHROPIC_API_KEY,
  GEMINI_API_KEY,
  OPENAI_API_KEY,
  OPENROUTER_API_KEY,
  TIMED_ASSESSMENT_DURATIONS_MIN,
} from "../config.js";

const SERVER_KEYS = {
  gemini: GEMINI_API_KEY,
  openai: OPENAI_API_KEY,
  anthropic: ANTHROPIC_API_KEY,
  openrouter: OPENROUTER_API_KEY,
};

const AiConfigSchema = z.object({
  provider: z.enum(["gemini", "openai", "anthropic", "openrouter"]).default("gemini"),
  model: z.string().optional(),
  apiKey: z.string().optional(),
});

const CreateSessionBody = z.object({
  tags: z.array(z.string()).default([]),
  language: z.string().default("javascript"),
  timedMinutes: z.number().nullable().default(null),
  aiConfig: AiConfigSchema.default({}),
});

const SubmitBody = z.object({
  code: z.string(),
});

const TestModelBody = AiConfigSchema;

export const router = express.Router();

router.get("/tags", (req, res) => {
  res.json({ categories: TAG_CATEGORIES, timedDurations: TIMED_ASSESSMENT_DURATIONS_MIN });
});

router.get("/providers", (req, res) => {
  const providers = PROVIDER_CATALOG.map((p) => ({
    ...p,
    hasServerKey: Boolean(SERVER_KEYS[p.id]),
  }));
  res.json({ providers });
});

router.post("/test-model", async (req, res) => {
  const body = TestModelBody.parse(req.body);
  try {
    const sample = await testModel(body);
    res.json({ ok: true, sample });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

router.post("/sessions", async (req, res) => {
  const body = CreateSessionBody.parse(req.body);
  try {
    const session = await createSession(body.tags, body.language, body.timedMinutes, body.aiConfig);
    res.json({
      sessionId: session.id,
      question: session.question,
      language: session.language,
      timedMinutes: session.timedMinutes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/sessions/:id", (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json({
    sessionId: session.id,
    question: session.question,
    language: session.language,
    timedMinutes: session.timedMinutes,
    submitted: Boolean(session.submittedAt),
  });
});

router.post("/sessions/:id/submit", async (req, res) => {
  const body = SubmitBody.parse(req.body);
  try {
    const { grade, aiAnswer } = await submitSession(req.params.id, body.code);
    res.json({ grade, aiAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

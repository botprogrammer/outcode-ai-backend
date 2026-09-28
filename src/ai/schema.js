import { z } from "zod";

export const DeductionSchema = z.object({
  id: z.string(),
  points: z.number().min(0),
  lineStart: z.number().int().min(1),
  lineEnd: z.number().int().min(1),
  category: z.enum(["correctness", "edge-case", "complexity", "readability", "best-practice"]),
  oneLiner: z.string(),
  explanation: z.string(),
});

export const GradeResultSchema = z.object({
  score: z.number().min(0).max(100),
  maxScore: z.literal(100),
  summary: z.string(),
  deductions: z.array(DeductionSchema),
});

export const SolveResultSchema = z.object({
  code: z.string(),
  language: z.string(),
  explanation: z.string(),
});

export const ExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
});

export const QuestionSchema = z.object({
  title: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  tags: z.array(z.string()),
  description: z.string(),
  constraints: z.array(z.string()),
  examples: z.array(ExampleSchema),
  renderType: z.enum(["none", "html", "react"]),
  language: z.string(),
  starterCode: z.string(),
});

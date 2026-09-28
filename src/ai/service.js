import { getAiProvider } from "./provider.js";
import { toFriendlyError } from "./errors.js";
import { buildGradePrompt, buildQuestionPrompt, buildSolvePrompt } from "./prompts.js";
import { GradeResultSchema, QuestionSchema, SolveResultSchema } from "./schema.js";

async function generateValidated(prompt, schema, aiConfig, retries = 1) {
  const provider = getAiProvider(aiConfig?.provider);
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const raw = await provider.generateJson(prompt, {
        apiKey: aiConfig?.apiKey,
        model: aiConfig?.model,
      });
      const parsed = JSON.parse(raw);
      return schema.parse(parsed);
    } catch (err) {
      lastError = err;
    }
  }
  console.error("AI generation failed after retries:", lastError);
  throw toFriendlyError(lastError);
}

export async function generateQuestion(tags, language, aiConfig) {
  return generateValidated(buildQuestionPrompt(tags, language), QuestionSchema, aiConfig);
}

export async function solveQuestion(question, language, aiConfig) {
  return generateValidated(buildSolvePrompt(question, language), SolveResultSchema, aiConfig);
}

export async function gradeSubmission(question, language, userCode, aiConfig) {
  return generateValidated(buildGradePrompt(question, language, userCode), GradeResultSchema, aiConfig);
}

export async function testModel(aiConfig) {
  const provider = getAiProvider(aiConfig?.provider);
  try {
    return await provider.generateJson("Reply with exactly the single word: OK", {
      apiKey: aiConfig?.apiKey,
      model: aiConfig?.model,
    });
  } catch (err) {
    console.error("AI test-model failed:", err);
    throw toFriendlyError(err);
  }
}

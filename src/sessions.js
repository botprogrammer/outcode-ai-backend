import { nanoid } from "nanoid";
import {
  generateQuestion,
  gradeSubmission,
  solveQuestion,
} from "./ai/service.js";

const sessions = new Map();

export async function createSession(tags, language, timedMinutes, aiConfig) {
  const question = await generateQuestion(tags, language, aiConfig);
  const id = nanoid(10);
  const aiSolvePromise = solveQuestion(question, language, aiConfig);
  const session = {
    id,
    question,
    language,
    timedMinutes,
    aiConfig,
    createdAt: Date.now(),
    aiSolvePromise,
    submittedAt: null,
    userCode: null,
    aiAnswer: null,
    gradeResult: null,
  };
  sessions.set(id, session);
  return session;
}

export function getSession(id) {
  return sessions.get(id);
}

export async function submitSession(id, code) {
  const session = sessions.get(id);

  if (!session) throw new Error("Session not found");

  if (session.submittedAt) {
    return { grade: session.gradeResult, aiAnswer: session.aiAnswer };
  }

  session.submittedAt = Date.now();
  session.userCode = code;

  const [aiAnswer, gradeResult] = await Promise.all([
    session.aiSolvePromise,
    gradeSubmission(session.question, session.language, code, session.aiConfig),
  ]);

  session.aiAnswer = aiAnswer;
  session.gradeResult = gradeResult;

  return { grade: gradeResult, aiAnswer };
}

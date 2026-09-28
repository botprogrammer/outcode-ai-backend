import { EXPLANATION_WORD_LIMIT } from "../config.js";

function questionBlock(question) {
  return [
    `Title: ${question.title}`,
    `Difficulty: ${question.difficulty}`,
    `Description: ${question.description}`,
    `Constraints:\n${question.constraints.map((c) => `- ${c}`).join("\n")}`,
    `Examples:\n${question.examples
      .map((e) => `Input: ${e.input}\nOutput: ${e.output}${e.explanation ? `\nExplanation: ${e.explanation}` : ""}`)
      .join("\n\n")}`,
    `Render type: ${question.renderType}`,
  ].join("\n\n");
}

export function buildQuestionPrompt(tags, language) {
  const tagLine = tags.length > 0 ? tags.join(", ") : "any common programming topic";
  return `You are generating a single coding practice question for a developer to solve in ${language}, focused on these tags: ${tagLine}.

The question can be ANY of the following kinds — pick whichever fits the tags best:
- A classic algorithm / data-structures problem (no visual output).
- A backend/SQL/systems problem (no visual output).
- A frontend problem that renders something visible: either a small vanilla HTML/CSS/JS page, or a single React component.

Hard requirements:
- The solution MUST be solvable in a SINGLE file. Do not require multiple files, a build step, or external npm packages beyond React itself for "react" render type.
- Decide "renderType":
  - "none" — for algorithmic/backend/SQL/logic problems with no visual output.
  - "html" — if the best-fitting solution is a self-contained HTML document (inline <style> and <script> only, no external resources).
  - "react" — if the best-fitting solution is a single React component. The starter code and expected solution must NOT use import/export statements or JSX modules — assume "React" and "ReactDOM" are already available as global variables, and the file must define a component named exactly \`App\` (e.g. \`function App() { ... }\`) using JSX syntax directly (it will be Babel-transpiled). Do not call ReactDOM.render/createRoot yourself — that is handled externally.
- "starterCode" is the single-file boilerplate the candidate starts editing (a short skeleton/comment scaffold, not a solution).
- Write a clear description, constraints, and 1-3 examples (for renderType "html"/"react", the "examples" can describe expected visible behavior instead of input/output pairs).

Respond with ONLY valid JSON, no markdown fences, no prose outside the JSON, matching exactly this shape:
{
  "title": "<short title>",
  "difficulty": "Easy" | "Medium" | "Hard",
  "tags": ["<subset/superset of the given tags relevant to this question>"],
  "description": "<full problem statement>",
  "constraints": ["<constraint>", "..."],
  "examples": [{ "input": "<...>", "output": "<...>", "explanation": "<optional>" }],
  "renderType": "none" | "html" | "react",
  "language": "${language}",
  "starterCode": "<single-file starter boilerplate, real newlines escaped as \\n>"
}`;
}

export function buildSolvePrompt(question, language) {
  const renderNote =
    question.renderType === "none"
      ? ""
      : question.renderType === "react"
        ? "\n\nThis is a React render-type question: do not use import/export, assume React and ReactDOM are global, define a component named exactly `App`, and do not call ReactDOM.render/createRoot yourself."
        : "\n\nThis is an HTML render-type question: return a single self-contained HTML document with inline <style> and <script> only.";

  return `You are an expert software engineer. Solve the following coding problem correctly and idiomatically in ${language}.${renderNote}

${questionBlock(question)}

Respond with ONLY valid JSON, no markdown fences, no prose outside the JSON, matching exactly this shape:
{
  "code": "<the full solution code as a string, with real newlines escaped as \\n>",
  "language": "${language}",
  "explanation": "<a short 2-4 sentence note on the approach and time/space complexity>"
}`;
}

function numberLines(code) {
  return code
    .split("\n")
    .map((line, i) => `${i + 1}: ${line}`)
    .join("\n");
}

export function buildGradePrompt(question, language, userCode) {
  const numbered = numberLines(userCode);
  const renderNote =
    question.renderType === "none"
      ? ""
      : `\n\nThis is a "${question.renderType}" render-type question — the candidate's code produces visible output. In addition to logic/correctness, judge whether the code actually renders/behaves as described (DOM structure, styling, interactivity implied by the description), based on reading the code (you cannot execute it, so reason carefully about what it would render).`;

  return `You are a strict, honest senior engineer grading a candidate's code submission. Do not sugarcoat anything. Behave like a demanding teacher, not a cheerleader.${renderNote}

Grade the candidate's ${language} solution to this problem:

${questionBlock(question)}

The candidate's code, with line numbers prefixed (use these exact line numbers when citing issues):
---
${numbered}
---

Instructions:
- Actually trace through the logic against the constraints and examples above. Do not give credit for code that merely looks plausible — verify it truly solves the problem, including edge cases (empty input, duplicates, boundary values, etc).
- Deduct points for every real issue you find: correctness bugs, missed edge cases, wrong/suboptimal time or space complexity, poor readability/naming, and violations of language best practices.
- Every deduction must cite the exact line number(s) from the numbered code above where the issue occurs.
- Each deduction's "explanation" field must be a detailed, specific explanation of roughly ${EXPLANATION_WORD_LIMIT} words (do not pad with filler — be precise, but hit close to that length).
- The "oneLiner" field must be a single short sentence, written for a collapsed summary row, e.g. "Off-by-one error causes the last element to be skipped."
- Score out of 100 = 100 minus the sum of all deduction points, floored at 0.
- If the code is genuinely correct, efficient, and clean, say so plainly and score it highly — do not invent issues just to have something to say.

Respond with ONLY valid JSON, no markdown fences, no prose outside the JSON, matching exactly this shape:
{
  "score": <number 0-100>,
  "maxScore": 100,
  "summary": "<1-2 sentence overall verdict, honest and direct>",
  "deductions": [
    {
      "id": "d1",
      "points": <number>,
      "lineStart": <number>,
      "lineEnd": <number>,
      "category": "correctness" | "edge-case" | "complexity" | "readability" | "best-practice",
      "oneLiner": "<short one sentence>",
      "explanation": "<~${EXPLANATION_WORD_LIMIT} word detailed explanation and how to fix it>"
    }
  ]
}`;
}

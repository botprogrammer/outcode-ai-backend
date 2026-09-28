export function toFriendlyError(err) {
  const raw = String(err?.message ?? err);

  if (/api key is not set/i.test(raw)) return new Error(raw);
  if (/503|UNAVAILABLE|overloaded|high demand/i.test(raw)) {
    return new Error("The AI model is overloaded right now — try again in a moment, or pick a different provider/model.");
  }
  if (/401|403|invalid.?api.?key|PERMISSION_DENIED|authentication/i.test(raw)) {
    return new Error("That API key was rejected. Check the key and try again.");
  }
  if (/429|rate.?limit|quota|insufficient_quota|credit/i.test(raw)) {
    return new Error("Rate limit or quota exceeded for this provider/key.");
  }
  return new Error("The AI request failed. Try again, or pick a different provider/model.");
}

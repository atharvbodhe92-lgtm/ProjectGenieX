import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS = [
  process.env.GOOGLE_GEMINI_KEY_1,
  process.env.GOOGLE_GEMINI_KEY_2,
  process.env.GOOGLE_GEMINI_KEY_3,
].filter(Boolean);

if (API_KEYS.length === 0) {
  throw new Error("No Gemini API keys found. Set GOOGLE_GEMINI_KEY_1, _2, _3 in .env");
}

console.log(`✅ Loaded ${API_KEYS.length} Gemini API key(s)`);

const MODEL_POOL = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-pro",
];

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const textGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

function isRetryableError(error) {
  if (!error) return false;
  const str = (error.message || JSON.stringify(error) || "").toLowerCase();
  // Always retry — skip bad keys, exhausted quotas, unavailable models, etc.
  // Only hard-stop on errors that no key/model can fix (e.g. invalid prompt)
  const hardStop = [
    "invalid argument",
    "request payload",
    "content filter",
    "safety",
  ];
  return !hardStop.some((s) => str.includes(s));
}

function createSession(apiKey, modelName, useJsonResponse) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelInstance = genAI.getGenerativeModel({ model: modelName });
  return modelInstance.startChat({
    generationConfig: useJsonResponse ? generationConfig : textGenerationConfig,
    history: [],
  });
}

// Build all combinations: [{ apiKey, model }, ...] shuffled
function getCombinations() {
  const combos = [];
  for (const apiKey of API_KEYS) {
    for (const model of MODEL_POOL) {
      combos.push({ apiKey, model });
    }
  }
  // Shuffle so we don't always hammer the same key first
  return combos.sort(() => Math.random() - 0.5);
}

export async function sendMessageWithRetry(prompt, useJsonResponse = false) {
  const combos = getCombinations();
  const errors = [];

  for (let i = 0; i < combos.length; i++) {
    const { apiKey, model } = combos[i];
    const keyIndex = API_KEYS.indexOf(apiKey) + 1;

    try {
      console.log(`🔄 [Attempt ${i + 1}/${combos.length}] Key #${keyIndex} | Model: ${model}`);
      const session = createSession(apiKey, model, useJsonResponse);
      const result = await session.sendMessage(prompt);
      console.log(`✅ Success — Key #${keyIndex} | Model: ${model}`);
      return result;
    } catch (error) {
      const retryable = isRetryableError(error);
      console.error(`❌ Failed — Key #${keyIndex} | Model: ${model} | ${error.message}`);
      errors.push({ keyIndex, model, error: error.message });

      if (!retryable) {
        console.warn("⚠️ Non-retryable error, stopping.");
        throw error;
      }

      // Exponential backoff capped at 4s
      if (i < combos.length - 1) {
        const wait = Math.min(Math.pow(2, i) * 500, 4000);
        console.log(`⏳ Waiting ${wait}ms before next attempt...`);
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
    }
  }

  throw new Error(
    `All ${combos.length} attempts failed (${API_KEYS.length} keys × ${MODEL_POOL.length} models). ` +
      errors.map((e) => `Key#${e.keyIndex}/${e.model}: ${e.error.substring(0, 60)}`).join(" | ")
  );
}

export async function sendJsonMessageWithRetry(prompt) {
  return sendMessageWithRetry(prompt, true);
}

export async function sendTextMessageWithRetry(prompt) {
  return sendMessageWithRetry(prompt, false);
}

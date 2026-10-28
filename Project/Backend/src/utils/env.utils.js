const requiredEnvVars = [
  "GOOGLE_GEMINI_KEY_1",
];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (!process.env.CORS_ORIGIN) {
    console.warn("CORS_ORIGIN is not set. Falling back to http://localhost:8000.");
  }
};

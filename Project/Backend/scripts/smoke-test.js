import assert from "node:assert/strict";

process.env.GOOGLE_GEMINI_KEY_1 ||= "smoke-test-gemini-key";
process.env.SCRAPINGDOG_API_KEY ||= "smoke-test-paper-key";
process.env.CORS_ORIGIN ||= "http://localhost:8000";

const { app } = await import("../src/app.js");
const { validateEnv } = await import("../src/utils/env.utils.js");
const { requireText } = await import("../src/utils/validation.utils.js");
const { findDatasetTitleMatches } = await import("../src/services/titleDataset.service.js");

validateEnv();
assert.equal(requireText("  hello  ", "sample"), "hello");
assert.throws(() => requireText("", "sample"), /sample is required/);

const matches = await findDatasetTitleMatches(
  {
    areaOfInterest: "Artificial Intelligence",
    skills: "Python, React",
    devTyp: "Web Development",
  },
  3
);

assert.ok(matches.length > 0, "Expected dataset title matches");
assert.ok(matches[0].title, "Expected match title");

const server = app.listen(0);
const port = server.address().port;
const response = await fetch(`http://127.0.0.1:${port}/`);
const text = await response.text();
server.close();

assert.equal(response.status, 200);
assert.equal(text, "Hello world!");

console.log("Backend smoke test passed.");

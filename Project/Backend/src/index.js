import { app } from "./app.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import { validateEnv } from "./utils/env.utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    validateEnv();

    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      console.log("MongoDB URI not configured. Using Firebase as the app data store.");
    }
  } catch (err) {
    // Log but continue starting server even if DB fails (optional)
    console.error("DB connection error:", err.message);
  }
  app.listen(port, () => {
    console.log(`Application is listening on port :${port}`);
  });
};

start();

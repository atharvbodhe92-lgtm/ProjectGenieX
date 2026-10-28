import { Router } from "express";
import multer from "multer";
import { generateProjectPlan, generateProjectTitles } from "../controllers/project.controller.js";
import { uploadAndSummarizePDF, askQuestionFromSummary } from "../controllers/pdf.controller.js";
import { getResearchPapers } from "../controllers/researchPaper.controller.js";
import { uploadMultiplePDFs } from "../middleware/multer.middleware.js";

const router = Router();

router.post("/project-titles", generateProjectTitles);
router.post("/projectitles", generateProjectTitles);
router.post("/project-plan", generateProjectPlan);
router.post("/projectplan", generateProjectPlan);

// PDF routes with multer middleware
router.post("/upload_pdf", (req, res, next) => {
  uploadMultiplePDFs(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "File too large. Maximum size is 10MB per file." });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({ error: "Too many files. Maximum is 10 files." });
        }
        return res.status(400).json({ error: err.message });
      }
      // Handle other errors (e.g., file filter)
      return res.status(400).json({ error: err.message || "File upload error." });
    }
    next();
  });
}, uploadAndSummarizePDF);

router.post("/ask_question", askQuestionFromSummary);

router.get("/research-papers", getResearchPapers);

export default router;

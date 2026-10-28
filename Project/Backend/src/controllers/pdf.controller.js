import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import { sendTextMessageWithRetry } from "../utils/gemini.utils.js";
import { requireText } from "../utils/validation.utils.js";

const paperSessions = new Map();
let lastSessionId = "";
const PAPER_SESSION_TTL_MS = Number(process.env.PAPER_SESSION_TTL_MS) || 60 * 60 * 1000;
const MAX_PAPER_SESSIONS = Number(process.env.MAX_PAPER_SESSIONS) || 25;

const makeSessionId = () => `paper_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const chunkText = (text, filename, chunkSize = 3500, overlap = 400) => {
  const chunks = [];
  const normalizedText = text.replace(/\s+/g, " ").trim();

  for (let start = 0; start < normalizedText.length; start += chunkSize - overlap) {
    const chunk = normalizedText.slice(start, start + chunkSize).trim();
    if (chunk) {
      chunks.push({
        filename,
        chunkIndex: chunks.length + 1,
        text: chunk,
      });
    }
  }

  return chunks;
};

const tokenize = (text = "") =>
  text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);

const rankRelevantChunks = (question, chunks, limit = 5) => {
  const questionTokens = new Set(tokenize(question));

  return chunks
    .map((chunk) => {
      const chunkTokens = tokenize(chunk.text);
      const score = chunkTokens.reduce(
        (total, token) => total + (questionTokens.has(token) ? 1 : 0),
        0
      );

      return { ...chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

const cleanupPaperSessions = () => {
  const now = Date.now();

  for (const [sessionId, session] of paperSessions.entries()) {
    if (now - session.createdAtMs > PAPER_SESSION_TTL_MS) {
      paperSessions.delete(sessionId);
    }
  }

  while (paperSessions.size > MAX_PAPER_SESSIONS) {
    const oldestSessionId = paperSessions.keys().next().value;
    paperSessions.delete(oldestSessionId);
  }
};

export const uploadAndSummarizePDF = async (req, res) => {
  const filePaths = [];

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Please upload at least one PDF file!" });
    }

    const files = req.files;
    const extractedTexts = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      filePaths.push(file.path);

      try {
        const dataBuffer = fs.readFileSync(file.path);
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        const extractedText = result.text ? result.text.slice(0, 50000) : "";

        if (extractedText.trim().length > 0) {
          extractedTexts.push({ filename: file.originalname, text: extractedText });
        } else {
          console.warn(`No text extracted from ${file.originalname}`);
        }
      } catch (parseError) {
        console.error(`Error parsing PDF ${file.originalname}:`, parseError);
      }
    }

    filePaths.forEach((filePath) => {
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error(`Error deleting file ${filePath}:`, cleanupError);
      }
    });

    if (extractedTexts.length === 0) {
      return res.status(400).json({ error: "No text could be extracted from the PDF files!" });
    }

    const combinedText = extractedTexts
      .map((item, index) => `--- PDF ${index + 1}: ${item.filename} ---\n${item.text}`)
      .join("\n\n");
    const chunks = extractedTexts.flatMap((item) => chunkText(item.text, item.filename));

    const textToSummarize = combinedText.slice(0, 100000);

    const prompt = `Summarize the following research paper in clear, concise language.
Focus on main objectives, methods, and findings.
If multiple PDFs are provided, create a comprehensive summary that covers all documents.

PDF Text:
${textToSummarize}`;

    const result = await sendTextMessageWithRetry(prompt);
    const pdfSummary = result.response?.text() || "No summary generated.";
    const sessionId = makeSessionId();
    lastSessionId = sessionId;

    paperSessions.set(sessionId, {
      summary: pdfSummary,
      chunks,
      files: extractedTexts.map((item) => item.filename),
      createdAt: new Date().toISOString(),
      createdAtMs: Date.now(),
    });
    cleanupPaperSessions();

    res.json({
      message: `${files.length} PDF(s) processed and summarized successfully!`,
      sessionId,
      summary: pdfSummary,
      filesProcessed: files.length,
      chunksIndexed: chunks.length,
    });
  } catch (err) {
    filePaths.forEach((filePath) => {
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error(`Error deleting file ${filePath}:`, cleanupError);
      }
    });

    console.error("Error processing PDF:", err);
    res.status(500).json({ error: "Failed to summarize PDF(s).", details: err.message });
  }
};

export const askQuestionFromSummary = async (req, res) => {
  try {
    let questionText;
    try {
      questionText = requireText(req.body.question, "question", 1000);
    } catch {
      return res.status(400).json({ answer: "Please enter a question." });
    }

    const activeSessionId = req.body.sessionId || lastSessionId;
    const session = paperSessions.get(activeSessionId);

    if (!session) {
      return res.status(400).json({
        answer: "Please upload and summarize PDF file(s) first before asking questions.",
      });
    }

    const relevantChunks = rankRelevantChunks(questionText, session.chunks);
    const evidence = relevantChunks
      .map((chunk, index) => `[Source ${index + 1}: ${chunk.filename}, chunk ${chunk.chunkIndex}]\n${chunk.text}`)
      .join("\n\n");

    const prompt = `You are an academic assistant. Use only the paper summary and relevant paper excerpts below to answer the question.
Be precise, accurate, and cite sources using labels like [Source 1] when possible.
If the answer cannot be found in the provided excerpts or summary, state that clearly.

Summary:
${session.summary}

Relevant excerpts:
${evidence}

Question: ${questionText}

Provide a clear answer based only on the information above.`;

    const result = await sendTextMessageWithRetry(prompt);
    const responseText = result.response?.text() || "No answer found.";

    res.json({
      answer: responseText,
      sessionId: activeSessionId,
      sources: relevantChunks.map((chunk, index) => ({
        label: `Source ${index + 1}`,
        filename: chunk.filename,
        chunkIndex: chunk.chunkIndex,
      })),
    });
  } catch (err) {
    console.error("Error answering question:", err);
    res.status(500).json({ answer: "Failed to get answer from Gemini.", error: err.message });
  }
};

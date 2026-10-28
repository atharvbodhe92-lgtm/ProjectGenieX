import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datasetPath = path.resolve(__dirname, "../project_titles_dataset_(2).csv");

let cachedRows = null;

const normalize = (value = "") => value.toString().trim().toLowerCase();

const tokenize = (value = "") =>
  normalize(value)
    .split(/[^a-z0-9.+#]+/i)
    .map((token) => token.trim())
    .filter(Boolean);

const getSkillOverlap = (requestedSkills, datasetSkills) => {
  const requested = new Set(tokenize(requestedSkills));
  const available = new Set(tokenize(datasetSkills));

  if (requested.size === 0 || available.size === 0) return 0;

  let overlap = 0;
  requested.forEach((skill) => {
    if (available.has(skill)) overlap += 1;
  });

  return overlap / requested.size;
};

const loadDataset = () =>
  new Promise((resolve, reject) => {
    if (cachedRows) {
      resolve(cachedRows);
      return;
    }

    const rows = [];

    fs.createReadStream(datasetPath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => {
        cachedRows = rows;
        resolve(rows);
      })
      .on("error", reject);
  });

export const findDatasetTitleMatches = async ({ areaOfInterest, skills, devTyp }, limit = 10) => {
  const rows = await loadDataset();
  const requestedDomain = normalize(areaOfInterest);
  const requestedType = normalize(devTyp);

  const scoredRows = rows
    .map((row) => {
      const domainScore = normalize(row.Domain) === requestedDomain ? 0.45 : 0;
      const typeScore = normalize(row["Project Type"]) === requestedType ? 0.25 : 0;
      const skillScore = getSkillOverlap(skills, row.Skills) * 0.3;
      const score = domainScore + typeScore + skillScore;

      return {
        title: row["Project Title"],
        domain: row.Domain,
        skills: row.Skills,
        projectType: row["Project Type"],
        score: Number(score.toFixed(3)),
      };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  const uniqueTitles = new Map();

  scoredRows.forEach((row) => {
    const key = normalize(row.title);
    if (!uniqueTitles.has(key)) uniqueTitles.set(key, row);
  });

  return Array.from(uniqueTitles.values()).slice(0, limit);
};

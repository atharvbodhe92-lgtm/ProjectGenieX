import { sendJsonMessageWithRetry } from "../utils/gemini.utils.js";
import { jsonrepair } from "jsonrepair";
import { findDatasetTitleMatches } from "../services/titleDataset.service.js";
import { requireText } from "../utils/validation.utils.js";

export const generateProjectTitles = async (req, res) => {
  try {
    const areaOfInterest = requireText(req.body.areaOfInterest, "areaOfInterest", 100);
    const skills = requireText(req.body.skills, "skills", 300);
    const devTyp = requireText(req.body.devTyp, "devTyp", 100);

    const datasetMatches = await findDatasetTitleMatches({ areaOfInterest, skills, devTyp });

    const prompt = `Generate 5 unique project title recommendations based on the following student details and dataset matches.

  - **Area of Interest:** ${areaOfInterest}
  - **Skills:** ${skills}
  - **Development Type:** ${devTyp}

Dataset matches ranked by relevance:
${JSON.stringify(datasetMatches, null, 2)}

Use the dataset matches as grounded inspiration. You may reuse a strong matching title or create a refined variation if it better fits the user's skills.

Return only a valid JSON array with exactly 5 objects in this format:
  [
    {
      "title": "Project Title",
      "description": "One sentence explaining the idea",
      "techStack": ["Technology 1", "Technology 2", "Technology 3"],
      "difficultyLevel": "Beginner | Intermediate | Advanced",
      "source": "dataset | ai-refined",
      "reason": "Short reason why this fits the user"
    }
  ]`;

    let projectTitles = [];
    try {
      const result = await sendJsonMessageWithRetry(prompt);
      const responseText = result.response?.text() || "";
      projectTitles = parseJSONResponse(responseText);
    } catch (parseError) {
      console.error("Failed to generate AI title recommendations:", parseError);
    }

    if (!Array.isArray(projectTitles) || projectTitles.length === 0) {
      projectTitles = datasetMatches.slice(0, 5).map((match) => ({
        title: match.title,
        description: `A ${match.projectType} project idea in ${match.domain}.`,
        techStack: match.skills.split(",").map((skill) => skill.trim()).filter(Boolean).slice(0, 5),
        difficultyLevel: "Intermediate",
        source: "dataset",
        reason: "Matched from the project-title dataset using your selected domain, development type, and skills.",
      }));
    }

    projectTitles = normalizeTitleRecommendations(projectTitles, datasetMatches);

    if (projectTitles.length < 5) {
      const existingTitles = new Set(projectTitles.map((item) => item.title.toLowerCase()));
      const fallbackTitles = datasetMatches
        .filter((match) => !existingTitles.has(match.title.toLowerCase()))
        .map((match) => ({
          title: match.title,
          description: `A ${match.projectType} project idea in ${match.domain}.`,
          techStack: match.skills.split(",").map((skill) => skill.trim()).filter(Boolean).slice(0, 5),
          difficultyLevel: "Intermediate",
          source: "dataset",
          reason: "Matched from the project-title dataset using your selected domain, development type, and skills.",
          matchScore: match.score,
        }));

      projectTitles = [...projectTitles, ...fallbackTitles];
    }

    projectTitles = projectTitles.slice(0, 5);

    return res.status(200).json(projectTitles);
  } catch (error) {
    if (error.message?.includes("is required")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

const normalizeTitleRecommendations = (titles, datasetMatches) => {
  const seen = new Set();
  const datasetLookup = new Map(
    datasetMatches.map((match) => [match.title.toLowerCase(), match])
  );

  return titles
    .map((item) => {
      const title = typeof item === "string" ? item : item?.title;
      if (!title) return null;

      const datasetMatch = datasetLookup.get(title.toLowerCase());

      return {
        title,
        description: item.description || (datasetMatch ? `A ${datasetMatch.projectType} project idea in ${datasetMatch.domain}.` : ""),
        techStack: Array.isArray(item.techStack)
          ? item.techStack
          : datasetMatch?.skills?.split(",").map((skill) => skill.trim()).filter(Boolean) || [],
        difficultyLevel: item.difficultyLevel || "Intermediate",
        source: item.source || (datasetMatch ? "dataset" : "ai-refined"),
        reason: item.reason || "Recommended based on your selected domain, skills, and development type.",
        matchScore: datasetMatch?.score || null,
      };
    })
    .filter((item) => {
      if (!item) return false;
      const key = item.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export const generateProjectPlan = async (req, res) => {
  try {
    const title = requireText(req.body.title, "title", 200);

    const result = await sendJsonMessageWithRetry(getProjectPlanPrompt(title));
    const responseText = result.response?.text() || "";
    const projectPlan = normalizeProjectPlan(parseJSONResponse(responseText), title);

    return res.status(200).json(projectPlan);
  } catch (error) {
    if (error.message?.includes("is required")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

const getProjectPlanPrompt = (projectTitle) => `
Generate a complete, practical project plan for the software project titled "${projectTitle}".

Return only one valid JSON object in this exact shape:
{
  "title": "${projectTitle}",
  "overview": {
    "introduction": "One detailed paragraph explaining the project, motivation, real-world problem, users, and long-term benefits."
  },
  "objectives": [
    "10 to 12 clear, measurable objectives. Each objective should be one sentence and include why it matters."
  ],
  "scope": {
    "inclusions": ["8 to 10 concrete features, modules, or deliverables included in the project."],
    "exclusions": ["5 to 7 reasonable boundaries that are not included."]
  },
  "features": {
    "coreFunctionalities": ["10 to 12 core functionalities with concise explanations."]
  },
  "timelineAndMilestones": [
    {
      "phase": "Phase name",
      "tasks": ["4 to 6 specific tasks for this phase."],
      "milestones": ["2 to 4 completion milestones for this phase."]
    }
  ],
  "challengesAndConsiderations": [
    {
      "challenge": "Specific challenge.",
      "solution": "Practical mitigation strategy."
    }
  ]
}

Use 6 to 8 realistic phases. Keep the plan detailed enough for a final-year project but concise enough for a web UI.
`;

const normalizeProjectPlan = (plan, fallbackTitle) => ({
  title: plan?.title || fallbackTitle,
  overview: {
    introduction: plan?.overview?.introduction || "",
  },
  objectives: Array.isArray(plan?.objectives) ? plan.objectives : [],
  scope: {
    inclusions: Array.isArray(plan?.scope?.inclusions) ? plan.scope.inclusions : [],
    exclusions: Array.isArray(plan?.scope?.exclusions) ? plan.scope.exclusions : [],
  },
  features: {
    coreFunctionalities: Array.isArray(plan?.features?.coreFunctionalities)
      ? plan.features.coreFunctionalities
      : Array.isArray(plan?.features?.core_functionalities)
        ? plan.features.core_functionalities
        : [],
  },
  timelineAndMilestones: Array.isArray(plan?.timelineAndMilestones)
    ? plan.timelineAndMilestones
    : [],
  challengesAndConsiderations: Array.isArray(plan?.challengesAndConsiderations)
    ? plan.challengesAndConsiderations
    : [],
});

const getText = async (prompt) => {
  try {
    const result = await sendJsonMessageWithRetry(prompt);
    const text = result.response?.text();
    if (text && text.trim().length > 0) return text;
    throw new Error("Empty response from AI model");
  } catch (error) {
    console.error("Error getting text from AI:", error);
    throw new Error(`Failed to get response from AI: ${error.message}`);
  }
};

const getOverviewPrompt = (projectTitle) => `Write an extremely detailed and insightful introduction explaining what the project is about in simple and understandable language with example, the motivation behind it, the real-world problems it addresses, and potential long-term benefits regarding "${projectTitle}". All information should be inside a large single paragraph.

Format:
{
  "introduction": "Project Overview"
}`;

const getObjectivesPrompt = (projectTitle) => `
List 18–20 **clear, measurable, and meaningful objectives** for the software project titled "${projectTitle}".

Each objective should:
- Be one sentence long.
- Clearly state what the project aims to achieve.
- Include a reason or rationale for its importance.

Ensure diversity in the objectives: cover technical goals (e.g., scalability, performance), user goals (e.g., intuitive UI), and operational goals (e.g., maintainability, accessibility). Use professional tone.
Return only an array of strings in JSON format.
`;

const getScopePrompt = (projectTitle) => `
Define the **Project Scope** for "${projectTitle}". Return a JSON with two arrays: **inclusions** and **exclusions**.

1. **Inclusions** – List 12–13 specific features, modules, or deliverables that WILL be part of the project. Be detailed (e.g., "User authentication with email/password and Google login").
2. **Exclusions** – List 8–10 reasonable features or domains that will NOT be part of the scope. These help clarify boundaries and prevent scope creep (e.g., "Does not include machine learning recommendation engine").

Format:
{
  "inclusions": [ ... ],
  "exclusions": [ ... ]
}

Use concise but descriptive language for each point.
`;

const getFeaturesPrompt = (projectTitle) => `
List the **Core Functionalities** of the project titled "${projectTitle}". These are features the system must support in order to be considered complete.

Return an array of 15–20 features. For each feature:
- Give a feature name or label.
- Provide a 5–6 sentence explanation of what it does and why it's necessary.

Format as:
{
  "core_functionalities": [
    "Feature name: Explanation...",
    ...
  ]
}

Focus on functionality that adds value for users or solves part of the problem.
`;

const getTimelinePrompt = (projectTitle) => `
Break down the project titled "${projectTitle}" into **15–16 distinct phases** (e.g., Research, Features and overall Design, Features Development, Testing, Deployment).

For each phase:
- Give the phase a name.
- List 7–8 important tasks (concise, actionable). Explain each task in 10-12 lines.
- Define 4–5 meaningful milestones (results that signal progress or completion).

Format:
[
  {
    "phase": "Phase Name",
    "tasks": ["Task 1", "Task 2", ...],
    "milestones": ["Milestone 1", "Milestone 2", ...]
  },
  ...
]

Return the above structure as a valid JSON array. Be specific and realistic with tasks and milestones.
`;

const getChallengesPrompt = (projectTitle) => `
Identify at least **15-20 significant challenges or considerations** for the project titled "${projectTitle}". These may be technical, organizational, operational, or related to user adoption.

For each challenge:
- Provide a short **title** or problem statement.
- Provide a detailed and realistic **solution or mitigation strategy**.
- Avoid generic advice—tie it to the context of the project.

Return in this format:
[
  {
    "challenge": "Challenge description...",
    "solution": "Corresponding solution..."
  },
  ...
]

Focus on real-world issues like scalability, security, performance, stakeholder alignment, legal/privacy, etc.
`;

const parseJSONResponse = (text) => {
  try {
    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const repaired = jsonrepair(clean);
    return JSON.parse(repaired);
  } catch (err) {
    throw new Error(`Failed to parse AI response: ${err.message}`);
  }
};

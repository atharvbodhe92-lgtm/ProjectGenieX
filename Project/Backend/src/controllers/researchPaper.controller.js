import { fetchResearchPapers } from "../services/researchPaper.service.js";
import { requireText } from "../utils/validation.utils.js";

export const getResearchPapers = async (req, res) => {
  let query;
  try {
    query = requireText(req.query.query, "query", 200);
  } catch (error) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const result = await fetchResearchPapers(query, 5);

    return res.status(200).json({
      query,
      provider: result.provider,
      scholar_results: result.papers,
    });
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    console.error(`Research paper API error [${status}]:`, message);

    return res.status(error.status || status || 500).json({
      error: message || "Wait for sometime limit hit limit reset after 2 hrs",
    });
  }
};

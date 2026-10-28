import axios from "axios";

const API_LIMIT_ERROR = "Wait for sometime limit hit limit reset after 2 hrs";
const REQUEST_TIMEOUT_MS = 15_000;
const SCRAPINGDOG_API_KEY = process.env.SCRAPINGDOG_API_KEY;

const reconstructAbstract = (abstractInvertedIndex) => {
  if (!abstractInvertedIndex) return "";

  const words = [];
  Object.entries(abstractInvertedIndex).forEach(([word, positions]) => {
    positions.forEach((position) => {
      words[position] = word;
    });
  });

  return words.filter(Boolean).join(" ");
};

const getBestOpenAlexLink = (work) =>
  work.primary_location?.landing_page_url ||
  work.primary_location?.pdf_url ||
  work.open_access?.oa_url ||
  work.doi ||
  work.id ||
  "";

const normalizeOpenAlexWork = (work) => ({
  title: work.title || work.display_name || "",
  title_link: getBestOpenAlexLink(work),
  snippet: reconstructAbstract(work.abstract_inverted_index),
  displayed_link: work.primary_location?.source?.display_name || "OpenAlex",
  publication_info: [
    work.publication_year,
    work.authorships?.slice(0, 3).map((author) => author.author?.display_name).filter(Boolean).join(", "),
  ].filter(Boolean).join(" - "),
  cited_by: work.cited_by_count ?? null,
  doi: work.doi || "",
  source: "OpenAlex",
});

const normalizeSemanticScholarPaper = (paper) => ({
  title: paper.title || "",
  title_link: paper.openAccessPdf?.url || paper.url || (paper.paperId ? `https://www.semanticscholar.org/paper/${paper.paperId}` : ""),
  snippet: paper.abstract || "",
  displayed_link: "Semantic Scholar",
  publication_info: [
    paper.year,
    paper.authors?.slice(0, 3).map((author) => author.name).filter(Boolean).join(", "),
  ].filter(Boolean).join(" - "),
  cited_by: paper.citationCount ?? null,
  doi: paper.externalIds?.DOI || "",
  source: "Semantic Scholar",
});

const normalizeScrapingDogPaper = (paper) => ({
  title: paper.title || "",
  title_link: paper.title_link || paper.link || "",
  snippet: paper.snippet || "",
  displayed_link: paper.displayed_link || "ScrapingDog",
  publication_info: [
    paper.year,
    paper.displayed_link,
  ].filter(Boolean).join(" - "),
  cited_by: (() => {
    const rawCount =
      paper.inline_links?.cited_by?.total ||
      paper.inline_links?.cited_by?.value ||
      paper.cited_by;

    const parsed = Number.parseInt(String(rawCount || "").replace(/\D+/g, ""), 10);
    return Number.isFinite(parsed) ? parsed : null;
  })(),
  doi: paper.doi || "",
  source: "ScrapingDog",
});

const getScrapingDogResults = (data) => {
  if (Array.isArray(data?.scholar_results)) return data.scholar_results;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data)) return data;
  return [];
};

const fetchFromScrapingDog = async (query, results, apiKey) => {
  const response = await axios.get("https://api.scrapingdog.com/google_scholar", {
    timeout: REQUEST_TIMEOUT_MS,
    params: {
      api_key: apiKey,
      query,
      results,
      country: "us",
    },
  });

  return getScrapingDogResults(response.data).map(normalizeScrapingDogPaper);
};

const fetchFromOpenAlex = async (query, results) => {
  const response = await axios.get("https://api.openalex.org/works", {
    timeout: REQUEST_TIMEOUT_MS,
    params: {
      search: query,
      per_page: results,
      sort: "relevance_score:desc",
      mailto: process.env.OPENALEX_MAILTO || undefined,
    },
  });

  return (response.data?.results || []).map(normalizeOpenAlexWork);
};

const fetchFromSemanticScholar = async (query, results) => {
  const response = await axios.get("https://api.semanticscholar.org/graph/v1/paper/search", {
    timeout: REQUEST_TIMEOUT_MS,
    params: {
      query,
      limit: results,
      fields: "title,abstract,url,year,authors,citationCount,openAccessPdf,externalIds",
    },
    headers: process.env.SEMANTIC_SCHOLAR_API_KEY
      ? { "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY }
      : undefined,
  });

  return (response.data?.data || []).map(normalizeSemanticScholarPaper);
};

const fetchFromScrapingDogProvider = async (query, results) => {
  if (!SCRAPINGDOG_API_KEY) {
    console.warn("No ScrapingDog API key configured. Falling back to OpenAlex.");
    return null;
  }

  try {
    const papers = await fetchFromScrapingDog(query, results, SCRAPINGDOG_API_KEY);
    if (papers.length > 0) {
      return {
        provider: "scrapingdog",
        papers,
      };
    }

    console.warn("ScrapingDog returned no papers. Falling back to OpenAlex.");
  } catch (error) {
    console.error("ScrapingDog research-paper lookup failed:", error.response?.status || error.message);
  }

  return null;
};

export const fetchResearchPapers = async (query, results = 5) => {
  const scrapingDogResult = await fetchFromScrapingDogProvider(query, results);
  if (scrapingDogResult) {
    return scrapingDogResult;
  }

  try {
    const openAlexPapers = await fetchFromOpenAlex(query, results);
    if (openAlexPapers.length > 0) {
      return {
        provider: "openalex",
        papers: openAlexPapers,
      };
    }

    console.warn("OpenAlex returned no papers. Falling back to Semantic Scholar.");
  } catch (error) {
    console.error("OpenAlex research-paper lookup failed:", error.response?.status || error.message);
  }

  try {
    const semanticScholarPapers = await fetchFromSemanticScholar(query, results);
    if (semanticScholarPapers.length > 0) {
      return {
        provider: "semantic-scholar",
        papers: semanticScholarPapers,
      };
    }

    console.warn("Semantic Scholar returned no papers.");
  } catch (error) {
    console.error("Semantic Scholar research-paper lookup failed:", error.response?.status || error.message);
  }

  const limitError = new Error(API_LIMIT_ERROR);
  limitError.status = 429;
  throw limitError;
};

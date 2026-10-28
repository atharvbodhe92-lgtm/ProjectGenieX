import axios from "axios";

export const generateProjectTitles = async (formData) => {
  const { areaOfInterest, skills, devTyp } = formData;

  try {
    const response = await axios.post("/api/v1/project-titles", {
      areaOfInterest,
      skills,
      devTyp,
    });

    // Backend already returns parsed JSON array
    return response.data;
  } catch (error) {
    console.error("Error generating project titles:", error);
    throw error;
  }
};

export const generateProjectPlan = async (title) => {
  try {
    const response = await axios.post("/api/v1/project-plan", {
      title,
    });

    // Backend already returns the complete project plan
    return response.data;
  } catch (error) {
    console.error("Error generating project plan:", error);
    throw error;
  }
};



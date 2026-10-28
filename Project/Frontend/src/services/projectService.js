import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

export const getUserProjects = async (userId) => {
    if (!userId) {
      console.error("Invalid userId");
      return [];
    }
  
    try {
      const projectsRef = collection(db, "users", userId, "projects");
      const snapshot = await getDocs(projectsRef);
  
      const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return projects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  };
  

const makeProjectDocId = (title = "untitled-project") =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled-project";

export const saveProjectToFirestore = async (userId, projectPlan) => {
  if (!userId) {
    console.error("Invalid userId");
    return;
  }

  try {
    const title = projectPlan.title || "Untitled Project";
    const existingProjectsQuery = query(
      collection(db, "users", userId, "projects"),
      where("title", "==", title),
      limit(1)
    );
    const existingProjects = await getDocs(existingProjectsQuery);
    const projectRef = existingProjects.empty
      ? doc(db, "users", userId, "projects", makeProjectDocId(title))
      : existingProjects.docs[0].ref;

    const formattedProjectPlan = {
      title,
      createdAt: existingProjects.empty ? serverTimestamp() : existingProjects.docs[0].data().createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
      overview: projectPlan.overview || {},
      objectives: projectPlan.objectives || [],
      scope: {
        inclusions: projectPlan.scope?.inclusions || [],
        exclusions: projectPlan.scope?.exclusions || [],
      },
      features: {
        coreFunctionalities: projectPlan.features?.coreFunctionalities || [],
      },
      timelineAndMilestones: projectPlan.timelineAndMilestones || [],
      challengesAndConsiderations: projectPlan.challengesAndConsiderations || [],
    };

    await setDoc(projectRef, formattedProjectPlan, { merge: true });

    console.log("Project saved successfully!", {
      userId,
      projectId: projectRef.id,
      projectData: formattedProjectPlan,
    });

    return projectRef.id;
  } catch (error) {
    console.error("Error saving project:", error);
  }
};


export const getProjectDetails = async (userId, projectId) => {
  if (!userId || !projectId) {
    console.error("Invalid userId or projectId");
    return null;
  }

  try {
    const projectRef = doc(db, "users", userId, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    if (projectDoc.exists()) {
      return { id: projectDoc.id, ...projectDoc.data() };
    } else {
      console.error("No such project!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching project details:", error);
    return null;
  }
};

export const deleteProject = async (userId, projectId) => {
  if (!userId || !projectId) {
    console.error("Invalid userId or projectId");
    return false;
  }

  try {
    const projectRef = doc(db, "users", userId, "projects", projectId);
    await deleteDoc(projectRef);
    
    console.log("Project deleted successfully!", {
      userId,
      projectId,
    });

    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
};

export const saveTitleRecommendationSession = async (userId, preferences, recommendations) => {
  if (!userId) {
    console.error("Invalid userId");
    return null;
  }

  try {
    const recommendationRef = await addDoc(
      collection(db, "users", userId, "titleRecommendations"),
      {
        preferences: {
          areaOfInterest: preferences.areaOfInterest || "",
          skills: preferences.skills || "",
          devTyp: preferences.devTyp || "",
        },
        recommendations: Array.isArray(recommendations) ? recommendations : [],
        createdAt: serverTimestamp(),
      }
    );

    return recommendationRef.id;
  } catch (error) {
    console.error("Error saving title recommendations:", error);
    return null;
  }
};

export const getRecentTitleRecommendationSessions = async (userId, maxResults = 5) => {
  if (!userId) {
    console.error("Invalid userId");
    return [];
  }

  try {
    const recommendationsQuery = query(
      collection(db, "users", userId, "titleRecommendations"),
      orderBy("createdAt", "desc"),
      limit(maxResults)
    );
    const snapshot = await getDocs(recommendationsQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching title recommendations:", error);
    return [];
  }
};

export const saveResearchPaperRecommendationSession = async (userId, projectTitle, papers) => {
  if (!userId) {
    console.error("Invalid userId");
    return null;
  }

  try {
    const recommendationRef = await addDoc(
      collection(db, "users", userId, "researchPaperRecommendations"),
      {
        projectTitle: projectTitle || "",
        papers: Array.isArray(papers) ? papers : [],
        createdAt: serverTimestamp(),
      }
    );

    return recommendationRef.id;
  } catch (error) {
    console.error("Error saving research paper recommendations:", error);
    return null;
  }
};

export const getRecentResearchPaperRecommendationSessions = async (userId, maxResults = 5) => {
  if (!userId) {
    console.error("Invalid userId");
    return [];
  }

  try {
    const recommendationsQuery = query(
      collection(db, "users", userId, "researchPaperRecommendations"),
      orderBy("createdAt", "desc"),
      limit(maxResults)
    );
    const snapshot = await getDocs(recommendationsQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching research paper recommendations:", error);
    return [];
  }
};

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectTitles: [], // Store project titles for listing
  projectPlan: null, // Store detailed plans by title
  userProjects: [] // store user projects
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjectTitles: (state, action) => {
      state.projectTitles = action.payload;
    },
    setProjectPlan: (state, action) => {
      state.projectPlan = action.payload;
    },
    setUserProjects: (state, action) => {
      state.userProjects = action.payload;
    },
    removeUserProject: (state, action) => {
      state.userProjects = state.userProjects.filter(
        (project) => project.id !== action.payload
      );
    },
  },
});

export const { setProjectTitles, setProjectPlan, setUserProjects, removeUserProject } = projectSlice.actions;
export default projectSlice.reducer;

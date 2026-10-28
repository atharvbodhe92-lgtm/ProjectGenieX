/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";

export const ProjectContext = createContext();

const Context = ({children}) => {
    const [projectTitles, setProjectTitles] = useState([]);
    return (
        <ProjectContext.Provider value={{projectTitles, setProjectTitles}}>
            {children}
        </ProjectContext.Provider>
    );
};

export default Context;

export const useProject = () => useContext(ProjectContext);
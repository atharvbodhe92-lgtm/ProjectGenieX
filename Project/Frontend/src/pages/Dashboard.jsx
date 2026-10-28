import { useEffect, useState } from "react";
import { AiOutlineProject } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectAreaOfInterst, SelectTypeOfDev } from "@/constants/options";
import { removeUserProject, setUserProjects } from "@/redux/slices/projectSlice";
import { generateProjectTitles } from "@/services/generateData";
import {
  deleteProject,
  getRecentTitleRecommendationSessions,
  getUserProjects,
  saveTitleRecommendationSession,
} from "@/services/projectService";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { toast } from "sonner";
import ChatPDF from "./ChatPDF";
import ResearchPaperRecommend from "./ResearchPaperRecommend";
 
import Profile from "./Profile";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("Projects");
  const [selectedTab, setSelectedTab] = useState("Project Plan");
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [projectTitles, setProjectTitles] = useState([]);
  const [recentTitleSessions, setRecentTitleSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState();
  const [researchTitle, setResearchTitle] = useState("");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Get the current authenticated user
  const userProjects = useSelector((state) => state.projects.userProjects);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const [projects, titleSessions] = await Promise.all([
          getUserProjects(user.uid),
          getRecentTitleRecommendationSessions(user.uid),
        ]);
        console.log("User projects : ", projects);
        dispatch(setUserProjects(projects));
        setRecentTitleSessions(titleSessions);
      }
    };

    fetchUserData();
  }, [user, dispatch]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onGenerateTitles = async () => {
    setLoading(true);

    if (!formData.areaOfInterest || !formData.skills || !formData.devTyp) {
      toast.error("Please fill all details");
      setLoading(false);
      return;
    }

    if (formData.skills.length <= 2) {
      toast.error("Please enter valid skills!");
      setLoading(false);
      return;
    }

    try {
      const titles = await generateProjectTitles(formData);
      setProjectTitles(titles);

      if (user?.uid) {
        const sessionId = await saveTitleRecommendationSession(user.uid, formData, titles);
        if (sessionId) {
          setRecentTitleSessions((prev) => [
            {
              id: sessionId,
              preferences: formData,
              recommendations: titles,
            },
            ...prev,
          ].slice(0, 5));
        }
      }
    } catch {
      toast.error("Failed to generate project titles");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const success = await deleteProject(user.uid, projectId);
      if (success) {
        dispatch(removeUserProject(projectId));
        toast.success("Project deleted successfully");
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const openResearchPapers = (projectTitle) => {
    setResearchTitle(projectTitle);
    setSelectedTab("Recommend Research Paper");
  };

  console.log(userProjects)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#0d414e] text-white p-8 shadow-lg flex flex-col justify-between">
        <div className="space-y-6">
          <SidebarItem icon={<CgProfile size={22} />} text="Profile" onClick={() => setSelectedMenu("Profile")} />
          <SidebarItem icon={<AiOutlineProject size={22} />} text="Projects" onClick={() => setSelectedMenu("Projects")} />
          {/* <SidebarItem icon={<FiSettings size={22} />} text="Settings" onClick={() => setSelectedMenu("Settings")} /> */}
          
        </div>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-10 bg-gray-100 overflow-auto">
        {selectedMenu === "Projects" && (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
            
            {/* Tabs */}
            <div className="flex mb-6">
              <button
                className={`mr-4 w-full ${selectedTab === "Project Plan" ? "font-bold border-b-2 border-black" : "text-gray-500"}`}
                onClick={() => setSelectedTab("Project Plan")}
              >
                Project Plan
              </button>
              <button
                  className={`w-full ${
                      selectedTab === "Recommend Research Paper"
                                        ? "font-bold border-b-2 border-black"
                                        : "text-gray-500"
                        }`}
                        onClick={() =>
                            setSelectedTab("Recommend Research Paper")
                        }
              >
                  Recommend Research Paper
              </button>
              <button
                className={`w-full ${selectedTab === "Analyze Research Paper" ? "font-bold border-b-2 border-black" : "text-gray-500"}`}
                onClick={() => setSelectedTab("Analyze Research Paper")}
              >
                Analyze Research Paper
              </button>
            </div>

            {/* Project Plan tab */}
            {selectedTab === "Project Plan" && (
              <div>
                {!showNewProjectForm ? (
                  <div>
                    <Button onClick={() => setShowNewProjectForm(true)} className="bg-[#4845D2] hover:bg-[#4745d2af] mb-4">
                      Add New Project
                    </Button>
                    
                    {/* Quick Project View Section */}
                    <div className="flex gap-4 mb-6">
                      <Input
                        type="text"
                        placeholder="Enter project title to view plan"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-grow"
                      />
                      <Button
                        onClick={() => title && navigate(`/view-plan/${encodeURIComponent(title)}`)}
                        className="bg-[#4845D2] hover:bg-[#4745d2af]"
                        disabled={!title}
                      >
                        View Plan
                      </Button>
                    </div>

                    <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
                    {userProjects.length === 0 ? (
                      <p className="text-gray-500">No projects found. Start by creating a new one!</p>
                    ) : (
                      <ul className="space-y-4">
                        {userProjects.map((project) => (
                          <li
                            key={project.id}
                            className="flex justify-between items-center bg-white p-4 border rounded-md shadow-sm"
                          >
                            <h3 className="font-semibold">{project.title}</h3>
                            <div className="flex gap-2">
                              <Button onClick={() => navigate(`/view-plan/${encodeURIComponent(project.title)}`)} className="bg-[#4845D2] hover:bg-[#4745d2af]">
                                View Plan
                              </Button>
                              <Button
                                onClick={() => openResearchPapers(project.title)}
                                className="bg-[#0d414e] hover:bg-[#0d414ecc]"
                              >
                                Find Papers
                              </Button>
                              <Button 
                                onClick={() => handleDeleteProject(project.id)} 
                                className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                              >
                                <MdDeleteOutline size={18} />
                                Delete
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Tell us your project preferences 💡🌐</h2>
                    <p className="text-gray-500 mb-8">Provide your interests and technology you know</p>

                    {/* Area of Interest */}
                    <div className="mb-6">
                      <h3 className="text-xl font-medium mb-3">Select your area of interest:</h3>
                      <div className="grid grid-cols-3 gap-5">
                        {SelectAreaOfInterst.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleInputChange("areaOfInterest", item.title)}
                            className={`p-4 border rounded-lg cursor-pointer ${formData?.areaOfInterest === item.title ? "border-black bg-[#4745d2af] text-white" : ""}`}
                          >
                            <img className="rounded-lg" src={item.img} alt={item.title} />
                            <h2 className="font-normal text-sm mt-2">{item.title}</h2>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                      <h3 className="text-xl font-medium mb-3">Enter your skills:</h3>
                      <Input type="text" placeholder="ex: HTML, CSS, etc." onChange={(e) => handleInputChange("skills", e.target.value)} />
                    </div>

                    {/* Development Type */}
                    <div className="mb-6">
                      <h3 className="text-xl font-medium mb-3">Select development type:</h3>
                      <div className="grid grid-cols-3 gap-5">
                        {SelectTypeOfDev.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleInputChange("devTyp", item.title)}
                            className={`p-4 border rounded-lg cursor-pointer ${formData?.devTyp === item.title ? "border-black bg-[#4745d2af] text-white" : ""}`}
                          >
                            <img className="rounded-lg" src={item.img} alt={item.title} />
                            <h2 className="font-normal text-sm mt-2">{item.title}</h2>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Generate Titles */}
                    <div className="text-right">
                      <Button disabled={loading} onClick={onGenerateTitles} className="bg-[#4845D2] hover:bg-[#4745d2af]">
                        {loading ? <i className="ri-loader-4-line animate-spin" /> : "Generate Titles"}
                      </Button>
                    </div>

                    {/* Generated Titles */}
                    <div className="mt-10">
                      {projectTitles.map((project, index) => (
                        <div key={index} className="flex items-center justify-between bg-white border-2 border-black p-4 rounded-md drop-shadow-xl mb-4">
                          <div>
                            <h1 className="font-semibold">
                              Project Title: <span className="font-normal">{project.title}</span>
                            </h1>
                            {project.description && (
                              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            )}
                            {project.reason && (
                              <p className="text-xs text-gray-500 mt-1">{project.reason}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => navigate(`/view-plan/${encodeURIComponent(project.title)}`)} className="bg-[#4845D2] hover:bg-[#4745d2af]">
                              View Plan
                            </Button>
                            <Button
                              onClick={() => openResearchPapers(project.title)}
                              className="bg-[#0d414e] hover:bg-[#0d414ecc]"
                            >
                              Find Papers
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {recentTitleSessions.length > 0 && (
                      <div className="mt-10">
                        <h3 className="text-xl font-bold mb-3">Recent Title Research</h3>
                        <div className="space-y-3">
                          {recentTitleSessions.map((session) => (
                            <div key={session.id} className="border rounded-md p-4 bg-white">
                              <p className="text-sm font-semibold">
                                {session.preferences?.areaOfInterest} / {session.preferences?.devTyp}
                              </p>
                              <p className="text-xs text-gray-500 mb-2">{session.preferences?.skills}</p>
                              <div className="flex flex-wrap gap-2">
                                {session.recommendations?.slice(0, 5).map((recommendation, idx) => (
                                  <button
                                    key={`${session.id}-${idx}`}
                                    type="button"
                                    onClick={() => navigate(`/view-plan/${encodeURIComponent(recommendation.title)}`)}
                                    className="text-xs border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100"
                                  >
                                    {recommendation.title}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Recommend Research Paper */}

            {selectedTab === "Recommend Research Paper" && (
              <div>
                <ResearchPaperRecommend initialTitle={researchTitle}/>
              </div>
            )}

            {/* Analyze Research Paper tab */}
            {selectedTab === "Analyze Research Paper" && (
              <div>
                <ChatPDF />
              </div>
            )}

          </div>
        )}

        

        {selectedMenu === "Profile" && (
          <Profile/>
        )}
        
      </div>

    </div>
  );
}

export const SidebarItem = ({ icon, text, onClick }) => (
  <div className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer hover:bg-white/20 transition duration-300" onClick={onClick}>
    {icon}
    <p className="text-lg font-semibold">{text}</p>
  </div>
);

export default Dashboard;

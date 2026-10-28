import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setProjectPlan } from "../redux/slices/projectSlice";
import { generateProjectPlan } from "@/services/generateData";
import { saveProjectToFirestore } from "@/services/projectService";
import { SidebarItem } from "./Dashboard";
import { CgProfile } from "react-icons/cg";
import { AiOutlineProject } from "react-icons/ai";
import { BsQuestionCircle } from "react-icons/bs";
import PlanLoading from "@/components/PlanLoading";

const Plan = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userProjects = useSelector((state) => state.projects.userProjects);
  const projectPlan = useSelector((state) => state.projects.projectPlan);

  const [activeTab, setActiveTab] = useState("projectOverview");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAndSetProjectPlan = async () => {
      setLoading(true);
      try {
        console.log(userProjects);
        const existingProject = userProjects?.find((proj) => proj.title === id);
        if (existingProject) {
          console.log("exisiting project", existingProject);
          dispatch(setProjectPlan(existingProject));
        } else {
          const generatedPlan = await generateProjectPlan(id);
          const parsedPlan = typeof generatedPlan === "string" ? JSON.parse(generatedPlan) : generatedPlan;
          console.log("generated plan", parsedPlan);
          dispatch(setProjectPlan(parsedPlan));

          if (user?.uid) {
            await saveProjectToFirestore(user.uid, parsedPlan);
          }
        }
      } catch (error) {
        console.error("Error fetching project plan:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAndSetProjectPlan();
  }, [dispatch, id, user?.uid, userProjects]);

  const handleSaveProject = async () => {
    if (!projectPlan || !user?.uid) return;
    await saveProjectToFirestore(user.uid, projectPlan);
    alert("Project saved successfully!");
  };
  if(loading) return <PlanLoading id={id} />;
  // if (loading) return <div className="mt-52 flex justify-center items-center">

  //   <div role="status">
  //     <svg aria-hidden="true" className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
  //       <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
  //     </svg>
  //     <span className="sr-only">Loading...</span>
  //   </div>

  // </div>;
  if (!projectPlan) return <p className="mt-5">No project plan available.</p>;

  const planData = projectPlan;
  console.log(planData);

  const tabs = {
    projectOverview: "Project Overview",
    projectObjectives: "Project Objectives",
    projectScope: "Project Scope",
    projectFeatures: "Project Features",
    projectTimelineAndMilestones: "Timeline & Milestones",
    challengesAndConsiderations: "Challenges & Considerations",
  };

  return (
    <div className="flex">

      <div className="w-64 bg-[#0d414e] text-white p-8 shadow-lg flex flex-col justify-between">
        <div className="space-y-6">
          <SidebarItem icon={<CgProfile size={22} />} text="Profile" onClick={() => {}} />
          <SidebarItem icon={<AiOutlineProject size={22} />} text="Projects" onClick={() => {}} />
          <SidebarItem icon={<BsQuestionCircle size={22} />} text="FAQ's" onClick={() => {}} />
        </div>
      </div>

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{planData?.title}</h1>
        <button
          onClick={handleSaveProject}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Project
        </button>

        <div className="flex justify-center border-b mb-4">
          {Object.keys(tabs).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 border-b-2 ${activeTab === key ? "border-blue-500 font-bold" : "border-transparent"}`}
            >
              {tabs[key]}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          {activeTab === "projectOverview" && planData?.overview && (
            <div className="space-y-6 max-w-3xl">
              <div>
                {planData?.overview?.introduction?planData.overview.introduction:null}
              </div>
            </div>
          )}


          {activeTab === "projectObjectives" && (
            <ul className="list-disc ml-6">
              {planData?.objectives?.length > 0 ? (
                planData.objectives.map((obj, i) => <li key={i}>{obj}</li>)
              ) : (
                <p>No objectives available.</p>
              )}
            </ul>
          )}


          {activeTab === "projectScope" && (
            <div>
              <h3 className="font-bold">Inclusions:</h3>
              <ul className="list-disc ml-6">
                {planData?.scope?.inclusions?.map((inc, i) => <li key={i}>{inc}</li>)||null}
              </ul>
              <h3 className="font-bold mt-2">Exclusions:</h3>
              <ul className="list-disc ml-6">
                {planData?.scope?.exclusions?.map((exc, i) => <li key={i}>{exc}</li>)||null}
              </ul>
            </div>
          )}
{activeTab === "projectFeatures" ? (
  <div>
    <h3 className="font-bold">Core Functionalities:</h3>

    <ul className="list-disc ml-6">
      {Array.isArray(planData?.features?.coreFunctionalities) &&
      planData?.features?.coreFunctionalities?.length > 0 ? (
        planData.features.coreFunctionalities.map((feature, i) => (
          <li key={i}>{feature ?? "N/A"}</li>
        ))
      ) : (
        <li className="text-gray-500 italic">No features available</li>
      )}
    </ul>
  </div>
) : null}


          {activeTab === "projectTimelineAndMilestones" && (
            <div className="max-w-3xl">
              {planData?.timelineAndMilestones?.map((phase, i) => (
                <div key={i} className="mb-6 border-b pb-4">
                  <h3 className="text-lg font-bold text-blue-700 mb-1">{phase.phase}</h3>
                  <h4 className="font-semibold mt-2">Tasks:</h4>
                  <ul className="list-disc ml-6">
                    {phase?.tasks?.map((task, j) => <li key={j}>{task}</li>)||null}
                  </ul>
                  <h4 className="font-semibold mt-2">Milestones:</h4>
                  <ul className="list-disc ml-6">
                    {phase?.milestones?.map((milestone, j) => <li key={j}>{milestone}</li>)||null}
                  </ul>
                </div>
              ))||null}
            </div>
          )}

          {activeTab === "challengesAndConsiderations" && (
            <div className="max-w-3xl">
              {planData?.challengesAndConsiderations?.map((challenge, i) => (
                <div key={i} className="mb-6 border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-bold text-red-700">Challenge:</h3>
                  <p className="mb-2">{challenge?.challenge}</p>
                  <h4 className="font-semibold text-green-700">Solution:</h4>
                  <p>{challenge?.solution}</p>
                </div>
              ))||null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Plan;

import { useProject } from "@/context/Context";
import { useParams } from "react-router-dom";

const ProjectPlan = () => {
  const { projectTitles } = useProject();
  const str=JSON.stringify(projectTitles)
  console.log(str);
  const id = useParams();
  console.log(id);

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="px-10 py-10 md:px-20 md:py-20 m-[10vw] rounded-md bg-white border-2 border-black">
        {Object.values(projectTitles).map((value, index) => {
          return <div
            key={index}
            className="flex items-center justify-between space-x-2 bg-white border-2 border-black p-2 rounded-md drop-shadow-xl m-4"
          >
            <h1>{value.Name}</h1>
            
          </div>
        })}
      </div>
    </div>
  );
};

export default ProjectPlan;

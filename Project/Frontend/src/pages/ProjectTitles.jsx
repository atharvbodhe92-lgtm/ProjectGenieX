import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { SelectAreaOfInterst, SelectTypeOfDev } from "@/constants/options";
import { toast } from "sonner";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";


const ProjectTitles = () => {

  const [formData, setFormData] = useState([]);

  const [projectTitles, setProjectTitles] = useState([]);

  const [loading, setLoading] = useState(false);
  
  const navigate =useNavigate()

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // useEffect(() => {
  //   console.log(formData);

  // }, [formData]);

  const OnGenerateTitles = () => {
    setLoading(true);
    if (!formData.areaOfInterest || !formData.skills || !formData.devTyp) {
      toast.error("Please fill all details");
      setLoading(false)
      return;
    }
    let skills=formData.skills
    if(skills.length<=2){
      toast.error("Please enter valid skills!");
      setLoading(false)
      return;
    }
    
    // console.log(skills);
    
    axios({
        method: "post",
        url: "/api/v1/project-titles",
        data: formData,
    })
    .then(function (response) {
        // Backend now returns parsed JSON array directly
        const data = response.data;
        
        setProjectTitles(data);
    })
    .catch(function (error) {
        console.error("Error generating project titles:", error);
        toast.error("Failed to generate project titles. Please try again.");
    })
    .finally(function(){
        setLoading(false)
        // navigate('/project_titles_info',{state:projectTitles})
    });
    // navigate('/ProjectTitlesInfo')
  };

  return (
    <>
      <div className="w-full flex flex-col justify-center">
        <div className="px-10 py-10 md:px-20 md:py-20 m-[10vw] rounded-md bg-white border-2 border-black">
          <h2 className="font-bold text-3xl">
            Tell us your project preferences💡🌐
          </h2>
          <p className="mt-3 text-gray-500 text-xl">
            Just Provide your interests and technology you know
          </p>

          <div className="mt-10 flex flex-col gap-6">
            <h2 className="text-xl my-3 font-medium">
              Select your area of interest:
            </h2>

            <div className="grid grid-cols-3 gap-5 mt-5">
              {SelectAreaOfInterst.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    handleInputChange("areaOfInterest", item.title)
                  }
                  className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer transition duration-500 hover:scale-105
                  ${
                    formData?.areaOfInterest == item.title &&
                    "shadow-lg border-black bg-[#4745d2af] text-white"
                  }  
                  `}
                >
                  <img className="rounded-lg" src={item.img} />
                  <h2
                    className="
                  font-normal text-sm mt-2"
                  >
                    {item.title}
                  </h2>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-10">
            <div>
              <h2 className="text-xl my-3 font-medium">Enter your skills:</h2>
              <Input
                type="text"
                placeholder=" Ex.Html,Css etc "
                onChange={(e) => handleInputChange("skills", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-10">
            <div>
              <h2 className="text-xl my-3 font-medium">
                Select develoment type:
              </h2>

              <div className="grid grid-cols-3 gap-5 mt-5">
                {SelectTypeOfDev.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleInputChange("devTyp", item.title)}
                    className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer transition duration-500 hover:scale-105
                    ${
                      formData?.devTyp == item.title &&
                      "shadow-lg border-black bg-[#4745d2af] text-white"
                    }  
                    `}
                  >
                    <img className="rounded-lg" src={item.img} />
                    <h2
                      className="
                  font-normal text-sm mt-2"
                    >
                      {item.title}
                    </h2>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="my-6 justify-end flex">
            <Button
              disabled={loading}
              onClick={OnGenerateTitles}
              className="bg-[#4845D2] hover:bg-[#4745d2af]"
            >
              {loading?<i className="ri-reset-right-line animate-spin"/>:"Generate titles"}
            </Button>
          </div>
        </div>

        <div className=" w-[80vw] m-auto">
          <h1 className="text-center font-extrabold mb-6 text-2xl">
            Select One Project Title
          </h1>

          <div className="flex flex-col gap-4">
            {Array.isArray(projectTitles) && projectTitles.map((value, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border-2 border-black p-4 rounded-md drop-shadow-xl"
              >
                <h1 className="font-semibold">
                  Project Title: <span className="font-normal">{value.title}</span>
                </h1>
                <Button onClick={() => navigate(`/view-plan/${encodeURIComponent(value.title)}`)} className="bg-[#4845D2] hover:bg-[#4745d2af]">
                  View Plan
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectTitles;

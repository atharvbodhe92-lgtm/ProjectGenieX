import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ResearchPaper = () => {
  const [info, setInfo] = useState([]);
  const [title, setTitle] = useState();

  const fetchResearchPaper = () => {
    axios
      .get("/api/v1/research-papers", { params: { query: title } })
      .then(function (response) {
        if (response.status === 200) {
          const data = response.data;
          setInfo(data.scholar_results || []);
          console.log(info);
        } else {
          console.log("Request failed with status code: " + response.status);
        }
      })
      .catch(function (error) {
        console.error("Error making the request: " + error.message);
      });
  };

  return (
    <>
      <div className="w-full flex flex-col justify-center p-5">
        <div className="px-10 py-10 md:px-20 md:py-20 m-[10vw] rounded-md bg-white border-2 border-black ">
          <div className="mt-10 flex flex-col gap-10">
            <div>
              <h2 className="text-xl my-3 font-medium">
                Enter Project Title:-
              </h2>
              <Input
                type="text"
                placeholder=""
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="my-5 justify-end flex">
            <Button
              onClick={fetchResearchPaper}
              className="bg-[#4845D2] hover:bg-[#4745d2af]"
            >
              Fetch Resources
            </Button>
          </div>
        </div>
      </div>

      {info.map((value, index) => (
        <div key={index} className="w-[80vw] m-auto bg-red-400 p-3">
          <div
            className="flex flex-col items-center justify-between space-x-2 bg-white border-2 border-black p-2 rounded-md drop-shadow-xl m-4"
          >
            <a href={value.title_link}>{value.title}</a>
          </div>
        </div>
      ))}
    </>
  );
};

export default ResearchPaper;

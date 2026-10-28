import { Button } from "@/components/ui/button";
import { FaMicrophone, FaPlay, FaCalendar, FaImage, FaGlobe, FaBook, FaCoffee, FaMicrochip } from 'react-icons/fa';
import { FaLightbulb, FaRocket, FaHandsHelping } from 'react-icons/fa';
import { AiOutlineFileText, AiOutlineClockCircle } from 'react-icons/ai'
import robot from '../images/robot.png'
import { Link } from "react-router-dom";


const LandingPage = () => {
  return (
    <>
      
      <div className="w-full flex flex-col items-center justify-center">
       
        <div className="h-[1190px] w-[1530px] bg-gradient-to-br from-[#237a85] via-[#0a323c] to-[#052029] text-white flex flex-col">
          {/* Header Section */}
          {/* <header className="mt-6 mx-6 flex justify-between items-center">
            <nav className="flex space-x-6">
              <p>Home</p>
              <p>Features</p>
              <p>How it Works?</p>
            </nav>

            <div className="text-2xl font-semibold">
              Project Genie
            </div>

            <div className="flex space-x-4">
              <Link to={'/login'} className="px-4 py-2 bg-white text-[#042027] rounded-md">Login</Link>
              <Link to={'/sign-up'} className="px-4 py-2 bg-[#042027] border border-white rounded-md">Sign Up</Link>
            </div>
          </header> */}

          <div className="mt-10">
            <h1 className="font-extrabold text-[60px] text-center">Transform Your Project Planning</h1>
            <h1 className="font-extrabold text-[60px] text-center">with AI Power</h1>
            <p className="text-center mt-3">
              Simplify tasks, get Personalized Project Recommendations and many more!
            </p>
          </div>
          
          {/* Circular Background and Robot Image */}
          <div className="mt-[160px] flex items-center justify-center relative">
            {/* Outer Circle */}
            <div className="absolute w-[750px] h-[750px] border-2 border-dashed border-white rounded-full animate-spin-slow"></div>
            {/* Inner Circle */}
            <div className="absolute w-[540px] h-[540px] border-2 border-dashed border-blue-300 rounded-full animate-spin-reverse-slow"></div>
            {/* Robot Image */}
            <img src={robot} alt="Robot" className="w-[550px] h-[550px] z-10" />

            {/* Icons around the circle */}
            <div className="absolute w-[670px] h-[670px] flex items-center justify-center">
              <FaMicrophone size={50} className="absolute top-[0%] left-[50%] transform -translate-x-1/2" />
              <FaPlay size={50} className="absolute top-[50%] right-[0%] transform -translate-y-1/2" />
              <FaCalendar size={50} className="absolute bottom-[0%] left-[50%] transform -translate-x-1/2" />
              <FaImage size={50} className="absolute top-[50%] left-[0%] transform -translate-y-1/2" />
              <FaGlobe size={50} className="absolute top-[15%] left-[85%] transform -translate-x-1/2" />
              <FaBook size={50} className="absolute top-[15%] right-[85%] transform translate-x-1/2" />
              <FaCoffee size={50} className="absolute bottom-[15%] left-[85%] transform -translate-x-1/2" />
              <FaMicrochip size={50} className="absolute bottom-[15%] right-[85%] transform translate-x-1/2" />
            </div>
          </div>
        </div>

        {/* features */}
        <div>
          <h1 className="mt-20 font-extrabold text-[50px] text-center bg-gradient-to-br from-[#21575d] via-[#0c5061] to-[#07394a] bg-clip-text text-transparent">Harness the Power of GENIE for</h1>
          <h1 className="font-extrabold text-[50px] text-center bg-gradient-to-l from-[#1a4044] via-[#0ea2c7] to-[#052029] bg-clip-text text-transparent">Flawless Project Planning</h1>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 px-20 mt-[50px]">
            {/* f1 */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg flex flex-col items-center">
              <FaLightbulb size={35} className="mb-7 text-[#219ebc]" />
              <h3 className="text-xl font-bold mb-2">Personalised Project Suggestions</h3>
              <p className="text-center">Analyze individual skills and preferences to recommend tailored project ideas.</p>
            </div>
            {/* f2 */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg flex flex-col items-center">
              <FaBook size={35} className="mb-7 text-[#219ebc]" />
              <h3 className="text-xl font-bold mb-2">Resource Recommendations</h3>
              <p className="text-center">Provide curated research papers and materials relevant to the chosen project topic.</p>
            </div>
            {/* f3 */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg flex flex-col items-center">
              <AiOutlineFileText size={35} className="mb-7 text-[#219ebc]" />
              <h3 className="text-xl font-bold mb-2 text-center">Comprehensive Documentation Assistance</h3>
              <p className="text-center">Generate essential documents like SRS, reports, and data flow diagrams to support project development.</p>
            </div>
            {/* f4 */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg flex flex-col items-center mt-10">
              <AiOutlineClockCircle size={35} className="mb-7 text-[#219ebc]" />
              <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
              <p className="text-center">Always online for instant assistance, enhancing productivity and ensuring support whenever you need it.</p>
            </div>
            {/* f5 */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg flex flex-col items-center mt-10">
              <FaRocket size={35} className="mb-7 text-[#219ebc]" />
              <h3 className="text-xl font-bold mb-2">Instant Responses</h3>
              <p className="text-center">Get answers in seconds, reducing wait times and improving overall efficiency in your interactions.</p>
            </div>
            {/* f6 */}
            <div className="bg-white text-black p-6 rounded-lg shadow-lg flex flex-col items-center mt-10">
              <FaHandsHelping size={35} className="mb-7 text-[#219ebc]" />
              <h3 className="text-xl font-bold mb-2">Personalised Interactions</h3>
              <p className="text-center">Adapts to your preferences, delivering tailored experiences that meet your unique needs and expectations.</p>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <h2 className="text-center font-extrabold text-[50px] text-[#13414d] mb-10">
            How it Works?
          </h2>

          <div className="flex justify-center gap-10 text-white">
            {/* Explore */}
            <div className="w-80 h-48 bg-[#0d414e] rounded-xl shadow-lg flex flex-col justify-center items-center p-4 text-center">
              <h3 className="text-2xl font-bold mb-4">Explore</h3>
              <p className="text-sm">Discover personalized project ideas tailored to your skills and interests.</p>
            </div>

            {/* Plan */}
            <div className="w-80 h-48 bg-[#0d414e] rounded-xl shadow-lg flex flex-col justify-center items-center p-4 text-center">
              <h3 className="text-2xl font-bold mb-4">Plan</h3>
              <p className="text-sm">Get essential resources, project plans, and documentation templates.</p>
            </div>

            {/* Build */}
            <div className="w-80 h-48 bg-[#0d414e] rounded-xl shadow-lg flex flex-col justify-center items-center p-4 text-center">
              <h3 className="text-2xl font-bold mb-4">Build</h3>
              <p className="text-sm">Utilize our tools and recommended materials to develop your project from start to finish.</p>
            </div>
          </div>
        </div>


        <div className="relative w-full mt-[130px]">
          <h2 className="bg-[#0a222e] font-extrabold text-[35px] text-center text-white p-4 rounded-lg w-1/2 mx-auto relative z-10">
            Ready to Transform your Project Planning?
          </h2>
          <div className="bg-[#eaf8ff] w-full h-60 flex justify-center items-center -mt-10">
            <Link to={"/generate_titles"}>
              <Button className="bg-[#4845D2] hover:bg-[#4745d2af]">
                Get Started, It's Free
              </Button>
            </Link>
          </div>
        </div>

      
      </div>

      {/* <footer className="flex justify-between items-center w-full h-[120px] bg-[#023047] text-white px-10">
        <div className="flex flex-col justify-center">
          <p className="text-sm">© 2024 ProjectGenie. All rights reserved.</p>
          <div className="flex space-x-4 mt-2">
            <p className="text-sm hover:underline cursor-pointer">Terms of Use</p>
            <p className="text-sm hover:underline cursor-pointer">Privacy Policy</p>
          </div>
        </div>

        <div className="flex space-x-5">
          <FaInstagram className="hover:text-pink-500 transition duration-300 cursor-pointer text-xl" />
          <FaTwitter className="hover:text-blue-400 transition duration-300 cursor-pointer text-xl" />
          <FaYoutube className="hover:text-red-500 transition duration-300 cursor-pointer text-xl" />
          <FaFacebook className="hover:text-blue-600 transition duration-300 cursor-pointer text-xl" />
        </div>
      </footer> */}


    </>
  );
};

export default LandingPage;

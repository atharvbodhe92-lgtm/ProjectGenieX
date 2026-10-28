import { useEffect, useState } from "react";

const PlanLoading = ({ id }) => {
  const  projectName = decodeURIComponent(id);// fetch project name from URL

  const steps = [
    "Connecting to the Project API...",
    "Fetching project details...",
    "Processing title and constraints...",
    "Assembling your project plan...",
  ];

  const [index, setIndex] = useState(0);

  // Loop through steps continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-700 text-center px-6">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide mb-4 text-gray-800">
        Generating Project Plan
      </h1>

      {/* Dynamic Project Name */}
      <p className="text-lg sm:text-xl font-medium text-gray-600 mb-10">
        for <span className="text-blue-600 font-semibold">{projectName}</span>
      </p>

      {/* Step Message */}
      <p
        key={index}
        className="text-base sm:text-lg font-mono text-gray-500 mb-8 animate-fade-in-up"
      >
        {steps[index]}
      </p>

      {/* Elegant Running Line Loader */}
      <div className="relative w-72 h-1.5 bg-gray-300 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 animate-line-progress"></div>
      </div>

      {/* Subtext */}
      <p className="text-sm text-gray-500 mt-8">
        Please wait while we prepare your detailed project plan...
      </p>

      {/* Animations */}
      <style>
        {`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes lineProgress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-line-progress {
          animation: lineProgress 2.5s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
};

export default PlanLoading;

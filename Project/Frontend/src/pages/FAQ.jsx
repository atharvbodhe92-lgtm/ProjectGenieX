import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Project GenieX?",
    answer:
      "Project GenieX is an AI-powered platform designed to help final-year BE students discover personalized project ideas, generate project plans, and explore relevant research papers—all in one place.",
  },
  {
    question: "How does the project recommendation work?",
    answer:
      "You simply enter your skills, domain, and area of interest. Based on that input, our system suggests multiple project titles with complete project plans including timeline, scope, features, and more.",
  },
  {
    question: "What makes ProjectGenieX different from ChatGPT or other AI tools?",
    answer:
      "It’s tailored for project ideation, research paper recommendation, project planning, and real-time collaboration—designed specifically for students.",
  },
  {
    question: "Can I ask questions on uploaded research papers?",
    answer:
      "Yes! Upload a PDF and ask questions—our AI backend processes the document and provides context-specific answers using Gemini and LangChain.",
  },
  {
    question: "Is this platform free to use?",
    answer:
      "Yes, currently GenieX is available for students and educators completely free of cost.",
  },
  {
    question: "Do I need to have a finalized topic before using the system?",
    answer:
      "No, ProjectGenieX helps you generate and refine project ideas based on your preferences.",
  },
  {
    question: "Can I use this tool even if I'm in my second or third year?",
    answer:
      "Yes! It’s ideal for any engineering student planning ahead for final-year projects.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="bg-white text-gray-900 p-10 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden transition-all">
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left text-lg font-medium hover:bg-gray-50 transition"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  activeIndex === idx ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`px-6 text-gray-700 text-base leading-relaxed overflow-hidden transition-all duration-300 ${
                activeIndex === idx ? "max-h-40 py-4" : "max-h-0 py-0"
              }`}
            >
              <div className="transition-opacity duration-300">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

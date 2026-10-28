import { Lightbulb, BrainCircuit, FileSearch, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
    return (
    <section
      id="about"
      className="relative bg-gradient-to-br from-[#237a85] via-[#0a323c] to-[#052029] text-white py-20 px-6 md:px-20 overflow-hidden"
    >
      {/* Glowing background lights */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-cyan-400 opacity-10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-teal-500 opacity-10 rounded-full filter blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-cyan-300">
          Welcome to <span className="text-white">Project Genie</span>
        </h2>
        <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-3xl mx-auto">
          Your smart project guide system that empowers final-year engineering students to ideate, plan, and research their dream projects using AI-driven precision and simplicity.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* Card 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <Lightbulb className="text-yellow-300 w-7 h-7" />
              <h3 className="text-2xl font-semibold text-white">Smart Project Suggestions</h3>
            </div>
            <p className="text-gray-300">
              Instantly receive project ideas aligned with your skills, area of interest, and tech stack using AI.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <Rocket className="text-pink-400 w-7 h-7" />
              <h3 className="text-2xl font-semibold text-white">Full Project Blueprint</h3>
            </div>
            <p className="text-gray-300">
              Get detailed plans with objectives, features, tech stack, challenges, and timeline for successful execution.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <FileSearch className="text-cyan-400 w-7 h-7" />
              <h3 className="text-2xl font-semibold text-white">Research Paper Finder</h3>
            </div>
            <p className="text-gray-300">
              Enter your topic and we’ll fetch top research papers to support and validate your work.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <BrainCircuit className="text-green-300 w-7 h-7" />
              <h3 className="text-2xl font-semibold text-white">AI Research Analyzer</h3>
            </div>
            <p className="text-gray-300">
              Upload PDFs and ask questions—get accurate answers from within the document using LangChain & Gemini AI.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default About

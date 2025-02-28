import { motion } from "framer-motion";
import DiabetesInfo from "../components/DiabetesInfo";
import ModelDetails from "../components/modeldetails";
import { div } from "framer-motion/client";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AIIntro from "../components/aiintro";


function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1)); // Remove "#" and find element
      if (element) {
        element.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to section
      }
    }
  }, [location]);
  
  return (
    <div>
      

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8 space-y-16">
      {/* Animated Text */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center text-white mb-16"
      >
        <h1 className="text-4xl font-bold mb-3">Get Started</h1>
        <p className="text-lg text-gray-300 mt-2">Go Through MyApp</p>
      </motion.div>

      {/* Three Boxes with Staggered Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-1 w-full max-w-7xl"
      >
        <SectionCard 
          title="Welcome to MyApp" 
          description="This is the best platform for AI-powered predictions and assistance." 
          onClick={() => document.getElementById("diabetes-info").scrollIntoView({ behavior: "smooth" })}
        />
        <SectionCard 
          title="Data Information" 
          description="We use advanced machine learning techniques to analyze data and provide insights." 
          onClick={()=> document.getElementById("model-details").scrollIntoView({ behavior: "smooth" })}
        />
        <SectionCard 
          title="Prediction & AI Assistance" 
          description="Get AI-powered predictions and expert assistance tailored to your needs."
          onClick={()=> document.getElementById("ai-intro").scrollIntoView({ behavior: "smooth"})} 
        />
      </motion.div>

      {/* Horizontal Line */}
      <hr className="w-4/5 border-t border-gray-600 my-12"/>

      {/* Diabetes Prediction Feature Section */}
      <div id="diabetes-info">
        <DiabetesInfo />
      </div>
      
      {/* Horizontal Line */}
      <hr className="w-4/5 border-t border-gray-600 my-6"/>
      <div id="model-details">
        <ModelDetails />
      </div>
      {/* Horizontal Line */}
      <hr className="w-4/5 border-t border-gray-600 my-6"/>
      <div id="ai-intro">
        <AIIntro />
      </div>


      


    </div>
    </div>
  );
}

export default Home;



// Variants for staggered fade-in + scale animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delay between children animations
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 }, // Start faded & slightly smaller
  show: { 
    opacity: 1, 
    scale: 1, // Scale to normal size
    transition: { duration: 1, ease: "easeInOut" } 
  },
};

// Section Card Component
function SectionCard({ title, description,onClick }) {
  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick} // Make the card clickable
      className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full sm:w-2/3 mx-auto 
                 border-2 border-gray-700 hover:border-white transition-all duration-300 
                 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
    >
      <h2 className="text-2xl font-bold tracking-wide text-gray-100">{title}</h2>
      <p className="mt-3 text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}

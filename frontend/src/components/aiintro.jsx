import { motion } from "framer-motion";
import { useState } from "react";

const primaryFeatures = [
  { name: "Retrieval-Augmented Generation (RAG)", description: "Enhances AI responses by retrieving relevant data from medical research papers and knowledge bases before generating answers." },
  { name: "LangChain", description: "A framework that allows seamless integration of LLMs with external data sources, memory, and decision-making tools for better AI responses." },
];

const secondaryFeatures = [
  { name: "Hugging Face Models", description: "Utilizing pre-trained models from Hugging Face for natural language understanding and fine-tuned medical AI capabilities." },
  { name: "Fine-Tuning", description: "Improving AI accuracy by training models on diabetes-related datasets, making predictions more personalized and reliable." },
  { name: "Medical Data Integration", description: "AI is trained on real medical case studies, ensuring fact-based and clinically relevant responses." },
  { name: "AI Assistance for Healthcare", description: "Provides real-time insights and recommendations, enhancing patient care and early diagnosis." },
];

export default function AIIntro() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-gray-900 py-24 sm:py-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Heading, Description, and Primary Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl shadow-md">
            AI-Powered Diabetes Prediction & Assistance
          </h2>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed">
            Our system leverages advanced AI techniques such as RAG, LangChain, and Hugging Face models 
            to provide <strong>accurate, real-time medical insights.</strong> By fine-tuning AI on medical 
            datasets, we ensure a high level of precision and reliability in diabetes prediction and patient assistance.
          </p>

          {/* Primary Features Below the Heading */}
          <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 lg:gap-x-8">
            {primaryFeatures.map((feature) => (
              <motion.div 
                key={feature.name} 
                className="border-t border-gray-700 pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <dt className="text-lg font-semibold text-white">{feature.name}</dt>
                <dd className="mt-2 text-gray-400">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        {/* Right Side - AI Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          {!imageError ? (
            <img
              src="/src/assets/all.webp"
              alt="AI Concepts - RAG, LangChain, Hugging Face, Fine-Tuning"
              className="rounded-lg bg-gray-800 shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="rounded-lg bg-gray-800 shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl h-64 flex items-center justify-center">
              <p className="text-gray-400">AI Concepts Illustration</p>
            </div>
          )}
        </motion.div>

      </div>

      {/* Secondary Features Below Both Heading and Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-16 mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
      >
        {secondaryFeatures.map((feature) => (
          <div key={feature.name} className="border-t border-gray-700 pt-4">
            <dt className="text-lg font-semibold text-white">{feature.name}</dt>
            <dd className="mt-2 text-gray-400">{feature.description}</dd>
          </div>
        ))}
      </motion.div>

    </div>
  );
}

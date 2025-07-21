import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const modelData = [
  {
    name: "Dataset",
    description:
      "Our diabetes prediction model is trained on a diverse dataset, ensuring accuracy across different demographics and medical histories.",
    image: "https://tailwindui.com/plus-assets/img/ecommerce-images/home-page-02-edition-01.jpg",
  },
  {
    name: "Pretraining",
    description:
      "The model is initially pre-trained using an Artificial Neural Network (ANN) to recognize complex patterns in medical data.",
    image: "https://tailwindui.com/plus-assets/img/ecommerce-images/home-page-02-edition-02.jpg",
  },
  {
    name: "Fine-tuning",
    description:
      "The model undergoes extensive fine-tuning with real-world patient data, optimizing its accuracy and reducing false positives.",
    image: "https://tailwindui.com/plus-assets/img/ecommerce-images/home-page-02-edition-03.jpg",
  },
];

export default function ModelDetails() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="bg-gray-900 text-white py-12 px-6 lg:px-16">
      <h2 className="text-3xl font-bold text-left mb-6">Model Details</h2>
      <p className="text-gray-400 text-left max-w-2xl mb-8">
        Learn how our AI-powered Diabetes Prediction Model works, from data collection to
        fine-tuned accuracy.
      </p>

      {/* Tabs */}
      <div className="flex justify-start space-x-6 border-b border-gray-700 pb-2">
        {modelData.map((tab, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(index)}
            className={`pb-2 transition ${
              selectedTab === index
                ? "border-b-2 border-indigo-500 text-indigo-400 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Animated Content Section */}
      <div className="mt-8 flex flex-col lg:flex-row items-center">
        <AnimatePresence mode="wait">
          {/* Text Section */}
          <motion.div
            key={selectedTab} // Unique key ensures re-render
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2 text-left px-4"
          >
            <h3 className="text-xl font-semibold text-left">{modelData[selectedTab].name}</h3>
            <p className="text-gray-300 mt-3 text-left">{modelData[selectedTab].description}</p>
          </motion.div>

          {/* Image Section */}
          <motion.img
            key={`img-${selectedTab}`}
            src={modelData[selectedTab].image}
            alt={modelData[selectedTab].name}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md h-[250px] object-cover rounded-lg"
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const text = "Early detection, smarter decisions. Get started with MyApp";

export default function Start({ onGetStarted }) {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [blinkCount, setBlinkCount] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const blinkInterval = setInterval(() => {
        setBlinkCount((prev) => prev + 1);
      }, 500);

      if (blinkCount >= 5) {
        setShowCursor(false);
        clearInterval(blinkInterval);
      }

      return () => clearInterval(blinkInterval);
    }
  }, [index, blinkCount]);

  const handleGetStarted = () => {
    sessionStorage.setItem("hasVisited", "true"); // Store session visit status
    onGetStarted();
    navigate("/home");
  };

  const handleLearnMore = () => {
    sessionStorage.setItem("hasVisited", "true");
    onGetStarted();
    navigate("/about#main");
  };

  return (
    <div className="bg-white">
      <div className="w-full h-screen flex items-center justify-center">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:px-16 md:pt-24 lg:px-24 w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          >
            <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-2xl text-center flex flex-col items-center justify-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
              {displayText}
              {showCursor && (
                <motion.span
                  className="text-white"
                  animate={{ opacity: [0, 1] }}
                  transition={{ repeat: blinkCount < 5 ? Infinity : 0, duration: 0.5 }}
                >
                  _
                </motion.span>
              )}
            </h2>
            <p className="mt-6 text-xl lg:text-2xl text-gray-300">
              AI-powered diabetes prediction with smart insights for better health decisions.Intelligent health predictions with cutting-edge AI technology.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={handleGetStarted}
                className="rounded-md bg-white px-5 py-3 text-lg font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </button>
              <button 
                onClick={handleLearnMore}
                className="text-lg font-semibold text-white hover:text-blue-400 transition"
              >
                Learn more <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

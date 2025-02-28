import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home.jsx";
import Prediction from "./pages/Prediction.jsx";
import Help from "./pages/Help.jsx";
import GlowingBorderBox from "./pages/Assistance.jsx";
import Footer from "./pages/Footer.jsx";
import Start from "./pages/start.jsx";
import AboutSection from "./components/about";

function App() {
  const [hasVisited, setHasVisited] = useState(() => {
    return sessionStorage.getItem("hasVisited") === "true"; // Check session storage
  });

  const handleGetStarted = () => {
    console.log("Get Started clicked!"); // Debugging
    sessionStorage.setItem("hasVisited", "true");
    setHasVisited(true);
  };

  return (
    <Router>
      <Routes>
        {/* Show Start page only on first visit */}
        {!hasVisited ? (
          <Route path="/" element={<Start onGetStarted={handleGetStarted} />} />
        ) : (
          <>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<><Navbar /><Home /><Footer /></>} />
            <Route path="/prediction" element={<><Navbar /><Prediction /><Footer /></>} />
            <Route path="/ai-assistance" element={<><Navbar /><GlowingBorderBox /><Footer /></>} />
            <Route path="/help" element={<><Navbar /><Help /><Footer /></>} />
            <Route path="/about" element={<><Navbar /><AboutSection /><Footer /></>} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

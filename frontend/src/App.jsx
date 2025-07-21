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
    return sessionStorage.getItem("hasVisited") === "true";
  });

  const handleGetStarted = () => {
    sessionStorage.setItem("hasVisited", "true");
    setHasVisited(true);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            !hasVisited ? (
              <Start onGetStarted={handleGetStarted} />
            ) : (
              <Navigate to="/home" replace />
            )
          } 
        />
        <Route path="/home" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/prediction" element={<><Navbar /><Prediction /><Footer /></>} />
        <Route path="/ai-assistance" element={<><Navbar /><GlowingBorderBox /></>} />
        <Route path="/help" element={<><Navbar /><Help /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><AboutSection /><Footer /></>} />
        <Route path="*" element={<Navigate to={hasVisited ? "/home" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;

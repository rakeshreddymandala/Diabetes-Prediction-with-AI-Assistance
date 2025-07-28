import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer.jsx";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home.jsx"));
const Prediction = lazy(() => import("./pages/prediction.jsx"));
const Help = lazy(() => import("./pages/Help.jsx"));
const GlowingBorderBox = lazy(() => import("./pages/Assistance.jsx"));
const Start = lazy(() => import("./pages/start.jsx"));
const AboutSection = lazy(() => import("./components/about"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-4 text-gray-300">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  </div>
);

function App() {
  const [hasVisited, setHasVisited] = useState(() => {
    return sessionStorage.getItem("hasVisited") === "true";
  });

  const handleGetStarted = () => {
    sessionStorage.setItem("hasVisited", "true");
    setHasVisited(true);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
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
            <Route 
              path="/home" 
              element={
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              } 
            />
            <Route 
              path="/prediction" 
              element={
                <>
                  <Navbar />
                  <Prediction />
                  <Footer />
                </>
              } 
            />
            <Route 
              path="/ai-assistance" 
              element={
                <>
                  <Navbar />
                  <GlowingBorderBox />
                </>
              } 
            />
            <Route 
              path="/help" 
              element={
                <>
                  <Navbar />
                  <Help />
                  <Footer />
                </>
              } 
            />
            <Route 
              path="/about" 
              element={
                <>
                  <Navbar />
                  <AboutSection />
                  <Footer />
                </>
              } 
            />
            <Route path="*" element={<Navigate to={hasVisited ? "/home" : "/"} replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

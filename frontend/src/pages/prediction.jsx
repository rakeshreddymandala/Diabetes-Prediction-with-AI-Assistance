import { useState } from "react";

export default function Prediction() {
  const [formData, setFormData] = useState({
    age: "", insulin: "", pregnancies: "", bmi: "",
    glucose: "", skinThickness: "", bloodPressure: "", diabetesPedigreeFunction: ""
  });
  const [result, setResult] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [typing, setTyping] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const predictDiabetes = async () => {
    setLoading(true); //Disable button
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, parseFloat(value)]))
        })
      });
      const data = await response.json();
      setResult(data.result);
      await fetchAiResponse(data.result);
    } catch (error) {
      console.error("Error predicting diabetes:", error);
      setResult("Error occurred");
    } finally {
      setLoading(false); //Enable button
    }
  };

  const fetchAiResponse = async (prediction) => {
    try {
      const response = await fetch("http://localhost:8000/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: prediction })
      });
      const data = await response.json();
      animateTypingEffect(data.assistance);
    } catch (error) {
      console.error("Error fetching AI assistance:", error);
      setAiResponse("Error fetching AI assistance");
    }
  };

  const animateTypingEffect = (text) => {
    setAiResponse("");
    setTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setAiResponse((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setTyping(false);
      }
    }, 30); // Adjust speed of typing effect
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-200 p-6">
      <div className="flex w-full max-w-6xl gap-8">
        {/* Left Side: Input Form */}
        <div className="bg-gray-800 p-4 rounded-2xl shadow-lg w-1/3">
          <h2 className="text-xl font-bold mb-4 text-center">Enter all details</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="mb-2">
                <label className="block text-xs font-medium capitalize">{key}</label>
                <input
                  type="number"
                  name={key}
                  placeholder={key}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={value}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
          <button
            className={`w-full bg-purple-500 text-white py-2 rounded-lg mt-4 hover:bg-purple-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={predictDiabetes}
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>

        </div>

        {/* Right Side: Prediction Result & AI Assistance */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-2/3 flex flex-col">
          {/* Prediction Result */}
          <div className="text-center text-xl font-semibold mb-4 text-green-400">
            {result || "Your result will appear here..."}
          </div>

          {/* AI Assistance */}
          <h2 className="text-2xl font-bold mb-2 text-purple-400 text-center">AI Assistance</h2>
          <div className="flex-1 p-4 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 min-h-[300px] overflow-auto">
            {typing ? <span className="text-gray-400">{aiResponse}▌</span> : aiResponse || "AI Assistance will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
}

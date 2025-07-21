import { useState } from "react";

export default function HelpPage() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message Sent!\nName: ${name}\nMessage: ${message}`);
    setShowForm(false);
    setName("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Help & Support
        </h1>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              className="h-32 w-32 rounded-full ring-4 ring-purple-500 shadow-lg"
              src="https://iare-data.s3.ap-south-1.amazonaws.com/uploads/STUDENTS/22951A04D8/22951A04D8.jpg"
              alt="Support Representative"
            />
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Ravi Naidu
              </h2>
              <p className="text-purple-400 font-medium mb-4">
                Customer Support Specialist
              </p>
              <p className="text-gray-400 mb-4">
                I'm here to help you with any questions or concerns you might
                have.
              </p>
              {!showForm && (
                <button
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 shadow-lg"
                  onClick={() => setShowForm(true)}
                >
                  Get in Touch
                </button>
              )}
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-gray-800 rounded-xl shadow-2xl p-8 animate-fade-in">
            <h3 className="text-xl font-semibold text-white mb-6">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 shadow-lg"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-700 transition-colors duration-300"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

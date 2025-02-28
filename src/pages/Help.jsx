import { useState } from "react";

export default function ProfileCard() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message Sent!\nName: ${name}\nMessage: ${message}`);
    setShowForm(false); // Hide form after submitting
    setName(""); // Clear inputs
    setMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex flex-col gap-2 p-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4">
        <img
          className="mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0"
          src="https://iare-data.s3.ap-south-1.amazonaws.com/uploads/STUDENTS/22951A04D8/22951A04D8.jpg"
          alt="Profile"
        />
        <div className="space-y-2 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-lg font-semibold text-white">Ravi Naidu</p>
            <p className="font-medium text-gray-500">Product Engineer</p>
          </div>

          {!showForm ? (
            <button
              className="px-4 py-2 rounded-lg border border-purple-500 text-purple-500 transition duration-300 ease-in-out hover:bg-purple-500 hover:text-white focus:ring focus:ring-purple-300"
              onClick={() => setShowForm(true)}
            >
              Message
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring focus:ring-purple-300"
                required
              />
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring focus:ring-purple-300"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
                >
                  Send
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

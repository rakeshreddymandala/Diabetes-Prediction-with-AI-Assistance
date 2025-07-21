import { useState, useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import Navbar from '../components/Navbar';
import axios from 'axios';

function Assistance() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'bot',
      message: "Hi! I'm your medical assistant. I can help you with general medical questions. How can I assist you today?",
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setChatHistory(prev => [...prev, { type: 'user', message: trimmedQuery }]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/ask', {
        query: trimmedQuery  // Changed from 'question' to 'query'
      });

      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        message: response.data.response 
      }]);

    } catch (error) {
      console.error('Error fetching response:', error);
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        message: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 flex flex-col bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Messages */}
      <section className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-4">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`mb-4 flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 ${
                  chat.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {chat.message}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </section>

      {/* Input */}
      <footer className="flex-none border-t border-gray-700 bg-gray-900">
        <div className="mx-auto max-w-3xl p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-lg bg-gray-700 p-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask a medical question..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="rounded-lg bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <SendIcon />
              )}
            </button>
          </form>
        </div>
      </footer>
    </main>
  );
}

export default Assistance;

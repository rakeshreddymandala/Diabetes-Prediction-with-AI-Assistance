import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-800 text-white">
      {/* Logo and Website Name */}
      <Link to="/home" className="flex items-center space-x-2">
        <img 
          src="src\assets\logo.webp"  // Ensure logo is in "public/images/logo.png"
          alt="MyApp Logo" 
          className="h-10 w-10 object-cover rounded-full border-2 border-white"
        />
        <span className="text-xl font-bold hover:text-blue-400 transition">
          MyApp
        </span>
      </Link>

      <ul className="flex space-x-6">
        {[
          { name: "Home", path: "/home" }, // Changed from "/" to "/home"
          { name: "Prediction", path: "/prediction" },
          { name: "AI-Assistance", path: "/ai-assistance" },
          { name: "Help", path: "/help" },
          { name: "About", path: "/about" },
        ].map((item) => (
          <li key={item.name} className="relative group cursor-pointer">
            <Link 
              to={location.pathname === item.path ? "#" : item.path} 
              className="group-hover:underline group-hover:text-blue-400 transition"
            >
              {item.name}
            </Link>
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;

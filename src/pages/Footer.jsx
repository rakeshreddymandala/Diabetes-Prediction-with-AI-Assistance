import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 mt-auto flex items-center justify-between px-6">
      {/* Left Side: Text */}
      <div>
        <p className="text-sm">&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        <p className="text-xs">Designed with ❤️ by Sai Rakesh Reddy Mandala</p>
      </div>

      {/* Right Side: Social Media Icons */}
      <div className="flex gap-4">
        <a href="https://www.linkedin.com/in/rakesh-reddy-mandala-716014256" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-white text-2xl hover:text-blue-500 transition duration-300" />
        </a>
        <a href="https://github.com/rakeshreddymandala" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-white text-2xl hover:text-gray-400 transition duration-300" />
        </a>
        <a href="https://www.instagram.com/rakesh_reddy_mandala" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-white text-2xl hover:text-pink-500 transition duration-300" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;

import { FaLinkedin, FaGithub, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About MyApp</h3>
            <p className="text-gray-300 text-sm mb-4">
              Leading the way in AI-powered diabetes prediction and healthcare assistance. 
              We're committed to making healthcare more accessible and intelligent.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/rakesh-reddy-mandala-716014256" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaLinkedin className="text-2xl hover:text-blue-500 transition-colors" />
              </a>
              <a href="https://github.com/rakeshreddymandala" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaGithub className="text-2xl hover:text-gray-400 transition-colors" />
              </a>
              <a href="https://www.instagram.com/rakesh_reddy_mandala" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaInstagram className="text-2xl hover:text-pink-500 transition-colors" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaPhone className="text-blue-400" />
                <span className="text-gray-300 text-sm">+91 (999) 999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-blue-400" />
                <span className="text-gray-300 text-sm">support@myapp.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" />
                <span className="text-gray-300 text-sm">
                  Institute of Aeronautical Engineering<br />
                  Dundigal, Hyderabad, Telangana
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/prediction" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Diabetes Prediction
                </a>
              </li>
              <li>
                <a href="/ai-assistance" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  AI Assistance
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  Help & Support
                </a>
              </li>
              <li>
                <a href="/about#main" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MyApp. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2 sm:mt-0">
            Designed with ❤️ by Sai Rakesh Reddy Mandala
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

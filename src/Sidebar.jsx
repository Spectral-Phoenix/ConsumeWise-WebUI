import React from "react";
import { Plus, Clock, NotepadText, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom"; // Import Link

import HistoryPage from "./HistoryPage.jsx";
import NotesPage from "./NotesPage.jsx";

const Sidebar = ({ isDarkMode, toggleProfilePopup, showProfilePopup }) => {
  const navigate = useNavigate();

  const icons = [
    { Icon: Plus, tooltip: "New", action: () => navigate("/") },
    {
      Icon: Clock,
      tooltip: "History",
      action: () => navigate("/history"), // Update path
    },
    {
      Icon: NotepadText,
      tooltip: "User Data",
      action: () => navigate("/notes"), // Update path
    },
  ];

  return (
    <aside
      className={`w-16 border-r flex flex-col ${
        isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
      } h-full fixed top-12 left-0 z-40`}
    >
      <div className="space-y-6 flex flex-col items-center py-6">
        {icons.map(({ Icon, tooltip, action }, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-lg transition-colors duration-200 relative group ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
            }`}
            onClick={action}
          >
            {/* You can use either Link or button with onClick based on your routing setup */}
            {/* <Link to={route}> 
              <Icon size={24} />
            </Link> */}
            <Icon size={24} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap top-1/2 -translate-y-1/2 pointer-events-none">
              {tooltip}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Profile icon */}
      <div className="absolute bottom-12 flex flex-col items-center left-0 w-full p-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-3 rounded-lg transition-colors duration-200 relative group ${
            isDarkMode
              ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
              : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
          }`}
          onClick={toggleProfilePopup}
        >
          <User size={24} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap top-1/2 -translate-y-1/2 pointer-events-none">
            Profile
          </span>
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;
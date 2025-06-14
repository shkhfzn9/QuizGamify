// src/components/common/NavTabs.jsx
import { NavLink } from "react-router-dom";

const NavTabs = ({ activeTab }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 md:space-x-4 overflow-x-auto">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `py-4 px-3 md:px-6 font-medium text-sm md:text-base whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`
            }
          >
            <i className="fas fa-chart-line mr-2"></i>Dashboard
          </NavLink>
          <NavLink
            to="/quizzes"
            className={({ isActive }) =>
              `py-4 px-3 md:px-6 font-medium text-sm md:text-base whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`
            }
          >
            <i className="fas fa-question-circle mr-2"></i>Quizzes
          </NavLink>
          <NavLink
            to="/badges"
            className={({ isActive }) =>
              `py-4 px-3 md:px-6 font-medium text-sm md:text-base whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`
            }
          >
            <i className="fas fa-award mr-2"></i>Badges
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `py-4 px-3 md:px-6 font-medium text-sm md:text-base whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`
            }
          >
            <i className="fas fa-trophy mr-2"></i>Leaderboard
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `py-4 px-3 md:px-6 font-medium text-sm md:text-base whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`
            }
          >
            <i className="fas fa-upload mr-2"></i>Upload Quiz
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavTabs;

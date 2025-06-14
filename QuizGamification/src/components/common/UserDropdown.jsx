// src/components/common/UserDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold">
          {currentUser?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="hidden md:inline">
          {currentUser?.displayName || currentUser?.email || "User"}
        </span>
        <i
          className={`fas fa-chevron-down text-sm transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        ></i>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
          <a
            href="#profile"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-user-circle w-5 text-gray-400"></i>
            <span className="ml-3">My Profile</span>
          </a>
          <a
            href="#settings"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-cog w-5 text-gray-400"></i>
            <span className="ml-3">Account Settings</span>
          </a>
          <a
            href="#achievements"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 transition-colors"
          >
            <i className="fas fa-trophy w-5 text-gray-400"></i>
            <span className="ml-3">Achievements</span>
          </a>
          <div className="h-px bg-gray-200 my-2"></div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            <i className="fas fa-sign-out-alt w-5"></i>
            <span className="ml-3">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

// src/components/common/Header.jsx
import { useAuth } from "../../context/AuthContext";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const { currentUser } = useAuth();

  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fas fa-graduation-cap text-2xl"></i>
          <h1 className="text-2xl font-bold">EduGame</h1>
        </div>

        {currentUser && (
          <div className="flex items-center space-x-6">
            <button className="text-white hover:text-indigo-200 transition-colors cursor-pointer">
              <i className="fas fa-bell text-xl"></i>
            </button>
            <UserDropdown />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

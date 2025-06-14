// src/components/ui/Toast.jsx
import { useEffect } from "react";

const Toast = ({ message, icon }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const toast = document.getElementById("toast");
      if (toast) {
        toast.remove();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="toast"
      className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out"
    >
      <i className={`fas ${icon} mr-2`}></i>
      {message}
    </div>
  );
};

export default Toast;

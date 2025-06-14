// src/components/ui/Tooltip.jsx
import { useState } from "react";

const Tooltip = ({ content, position = "top", children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2",
    right: "left-full ml-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={`absolute z-10 w-max max-w-xs px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-100 transition-opacity duration-200 ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === "top"
                ? "bottom-[-0.25rem] left-1/2 -translate-x-1/2"
                : position === "right"
                ? "left-[-0.25rem] top-1/2 -translate-y-1/2"
                : position === "bottom"
                ? "top-[-0.25rem] left-1/2 -translate-x-1/2"
                : "right-[-0.25rem] top-1/2 -translate-y-1/2"
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;

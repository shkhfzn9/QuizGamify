// src/components/ui/SearchInput.jsx
import { useState, useEffect } from "react";

const SearchInput = ({ placeholder = "Search...", delay = 300, onSearch }) => {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTyping) {
        onSearch(query);
        setIsTyping(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay, isTyping, onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setIsTyping(true);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i className="fas fa-search text-gray-400"></i>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <i className="fas fa-times text-gray-400 hover:text-gray-500"></i>
        </button>
      )}
    </div>
  );
};

export default SearchInput;

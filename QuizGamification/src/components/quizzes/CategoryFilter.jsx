// src/components/quizzes/CategoryFilter.jsx
import { useState } from "react";

const CategoryFilter = ({ categories, onFilterChange }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    onFilterChange(category);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => handleCategoryChange("all")}
        className={`px-3 py-1 text-sm rounded-full font-medium ${
          activeCategory === "all"
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All Categories
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-3 py-1 text-sm rounded-full font-medium ${
            activeCategory === category
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

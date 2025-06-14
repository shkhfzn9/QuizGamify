// src/components/quizzes/FilterModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, filters, onFiltersChange, categories }) => {
  if (!isOpen) return null;

  const handleCategoryChange = (category) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? 'all' : category
    });
  };

  const handleDifficultyChange = (difficulty) => {
    onFiltersChange({
      ...filters,
      difficulty: filters.difficulty === difficulty ? 'all' : difficulty
    });
  };

  const handleSortChange = (sort) => {
    onFiltersChange({
      ...filters,
      sortBy: sort
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      difficulty: 'all',
      sortBy: 'newest'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Filter Quizzes</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                filters.category === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  filters.category === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Difficulty</h4>
          <div className="flex gap-2">
            {['all', 'easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  filters.difficulty === diff
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
          <div className="space-y-2">
            {[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'alphabetical', label: 'Alphabetical' },
              { value: 'difficulty', label: 'Difficulty' }
            ].map((sort) => (
              <button
                key={sort.value}
                onClick={() => handleSortChange(sort.value)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  filters.sortBy === sort.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={clearFilters}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;

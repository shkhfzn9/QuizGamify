// src/pages/QuizzesPage.jsx
import { useState, useMemo } from "react";
import Header from "../components/common/Header";
import NavTabs from "../components/common/NavTabs";
import QuizList from "../components/quizzes/QuizList";
import QuizModal from "../components/quizzes/QuizModal";
import FilterModal from "../components/quizzes/FilterModal";
import Pagination from "../components/ui/Pagination";
import { useQuizzes } from "../hooks/useQuizzes";
import { useUserData } from "../hooks/useUserData";
import PageLoader from "../components/ui/PageLoader";
import SkeletonLoader from "../components/ui/SkeletonLoader";

const QuizzesPage = () => {
  const { quizzes, loading } = useQuizzes();
  const { userData } = useUserData();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    sortBy: 'newest'
  });

  const ITEMS_PER_PAGE = 9;

  // Get unique categories
  const categories = useMemo(() => {
    if (!quizzes || quizzes.length === 0) return [];
    return [...new Set(quizzes.map(quiz => quiz.category))].filter(Boolean);
  }, [quizzes]);

  // Enhanced search function
  const searchQuizzes = (quiz, searchTerm) => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    const searchWords = searchLower.split(' ').filter(word => word.length > 0);
    
    // Fields to search in
    const searchableFields = [
      quiz.title || '',
      quiz.category || '',
      quiz.difficulty || '',
      quiz.description || '',
      // Search in questions if available
      ...(quiz.questions || []).map(q => q.questionText || '').slice(0, 3) // Limit to first 3 questions
    ].map(field => field.toLowerCase());
    
    const searchText = searchableFields.join(' ');
    
    // Check if all search words are found
    return searchWords.every(word => searchText.includes(word));
  };

  // Filter and sort quizzes
  const filteredAndSortedQuizzes = useMemo(() => {
    if (!quizzes || quizzes.length === 0) return [];
    
    let filtered = quizzes.filter(quiz => {
      // Enhanced search filter
      const matchesSearch = searchQuizzes(quiz, searchTerm);
      
      // Category filter
      const matchesCategory = filters.category === 'all' || quiz.category === filters.category;
      
      // Difficulty filter
      const matchesDifficulty = filters.difficulty === 'all' || quiz.difficulty === filters.difficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort quizzes
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'alphabetical':
          return (a.title || '').localeCompare(b.title || '');
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    return filtered;
  }, [quizzes, searchTerm, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedQuizzes.length / ITEMS_PER_PAGE);
  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedQuizzes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedQuizzes, currentPage]);

  const handleQuizComplete = (score) => {
    // Update user data with new score
    console.log("Quiz completed with score:", score);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle search on Enter key
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Search is already triggered by onChange, just focus out
      e.target.blur();
    }
  };

  if (loading) return <PageLoader message="Loading quizzes..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs activeTab="quizzes" />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Available Quizzes ({filteredAndSortedQuizzes.length})
            </h2>
            <div className="flex space-x-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search quizzes, categories, or questions..."
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-64"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <button 
                onClick={() => setShowFilterModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors relative"
              >
                <i className="fas fa-filter mr-2"></i>Filter
                {(filters.category !== 'all' || filters.difficulty !== 'all') && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-medium">
                    {[filters.category !== 'all', filters.difficulty !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.category !== 'all' || filters.difficulty !== 'all' || searchTerm) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => handleSearchChange('')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.category !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Category: {filters.category}
                  <button
                    onClick={() => handleFiltersChange({...filters, category: 'all'})}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.difficulty !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Difficulty: {filters.difficulty}
                  <button
                    onClick={() => handleFiltersChange({...filters, difficulty: 'all'})}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setFilters({ category: 'all', difficulty: 'all', sortBy: 'newest' });
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {paginatedQuizzes.length > 0 ? (
            <QuizList
              quizzes={paginatedQuizzes}
              onQuizSelect={(quiz) => {
                setSelectedQuiz(quiz);
                setShowQuizModal(true);
              }}
            />
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm || filters.category !== 'all' || filters.difficulty !== 'all' 
                  ? 'No quizzes found' 
                  : 'No quizzes available'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? `No results for "${searchTerm}". Try different keywords or check your spelling.`
                  : 'Try adjusting your search or filters'}
              </p>
              {(searchTerm || filters.category !== 'all' || filters.difficulty !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ category: 'all', difficulty: 'all', sortBy: 'newest' });
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedQuizzes.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}

          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-indigo-800 mb-2">
                  Ready for a challenge?
                </h3>
                <p className="text-indigo-600">
                  Take our weekly quiz competition and win bonus points!
                </p>
              </div>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Join Weekly Challenge
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
      />

      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz}
          showModal={showQuizModal}
          setShowModal={setShowQuizModal}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default QuizzesPage;

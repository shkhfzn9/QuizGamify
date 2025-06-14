// src/components/quizzes/QuizCard.jsx
const QuizCard = ({ quiz, onStart }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform hover:transform hover:scale-105">
      <div className="h-48 overflow-hidden">
        <img
          src={quiz.image || "https://placehold.co/400x250?text=Quiz+Image"}
          alt={quiz.title}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
            {quiz.category}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              quiz.difficulty === "easy"
                ? "bg-green-100 text-green-800"
                : quiz.difficulty === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {quiz.difficulty}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {quiz.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {quiz.description || "Test your knowledge with this quiz"}
        </p>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>
            <i className="fas fa-question-circle mr-1"></i>
            {quiz.questions?.length || 0} questions
          </span>
          <span>
            <i className="far fa-clock mr-1"></i>
            {quiz.timeEstimate || "10 min"}
          </span>
        </div>
        <button
          onClick={onStart}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizCard;

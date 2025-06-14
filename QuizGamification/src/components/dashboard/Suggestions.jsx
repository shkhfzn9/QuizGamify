// src/components/dashboard/Suggestions.jsx
import { useQuizzes } from "../../hooks/useQuizzes";
import QuizCard from "../quizzes/QuizCard";
import { useNavigate } from "react-router-dom";

const Suggestions = () => {
  const { quizzes, loading } = useQuizzes();
  const navigate = useNavigate();

  if (loading) return <div>Loading suggestions...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quizzes.slice(0, 3).map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onStart={() => navigate(`/quiz/${quiz.id}`)}
        />
      ))}
    </div>
  );
};

export default Suggestions;

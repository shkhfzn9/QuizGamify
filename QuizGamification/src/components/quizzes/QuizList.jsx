// src/components/quizzes/QuizList.jsx
import QuizCard from "./QuizCard";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../ui/SkeletonLoader";

const QuizList = ({ quizzes, onQuizSelect, loading = false }) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonLoader type="quiz" count={6} />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onStart={() => navigate(`/quiz/${quiz.id}`)}
        />
      ))}
    </div>
  );
};

export default QuizList;

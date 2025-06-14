import { useParams } from "react-router-dom";
import QuizScreen from "./QuizScreen";

const QuizPageWrapper = () => {
  const { id } = useParams();
  console.log("QuizPageWrapper - Quiz ID from params:", id);
  return <QuizScreen quizId={id} />;
};

export default QuizPageWrapper;

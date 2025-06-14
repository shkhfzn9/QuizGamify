// Import statements - these bring in code from other files that we need to use
// useParams is a React Router hook that lets us get URL parameters (like quiz ID from the web address)
import { useParams } from "react-router-dom";
// Import our QuizScreen component from the same folder - this is the actual quiz display component
import QuizScreen from "./QuizScreen";

/**
 * QuizPageWrapper Component
 *
 * This is a "wrapper" component - think of it like a middleman or translator.
 * Its job is to:
 * 1. Get the quiz ID from the URL (web address)
 * 2. Pass that quiz ID to the QuizScreen component
 *
 * Why do we need this wrapper?
 * - It separates concerns: this component handles URL stuff, QuizScreen handles quiz display
 * - Makes the code more organized and easier to maintain
 * - Follows React best practices of having small, focused components
 */
const QuizPageWrapper = () => {
  // useParams() is a React Router hook that extracts parameters from the current URL
  // For example, if the URL is "/quiz/123", then quizId will be "123"
  // The curly braces { quizId } use "destructuring" - it's like saying "give me just the quizId property"
  const { quizId } = useParams();

  // Return JSX (JavaScript XML) - this is what gets displayed on the screen
  // We're rendering the QuizScreen component and passing the quizId as a "prop"
  // Props are like arguments you pass to a function - they give the component data to work with
  return <QuizScreen quizId={quizId} />;
};

// Export this component so other files can import and use it
// "default" means this is the main thing this file exports

export default QuizPageWrapper;

// // src/components/quizzes/QuizModal.jsx
// import { useState, useEffect } from 'react';
// import Button from '../ui/Button';
// import Toast from '../ui/Toast';

// const QuizModal = ({
//   quiz,
//   showModal,
//   setShowModal,
//   onQuizComplete
// }) => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [score, setScore] = useState(0);
//   const [timer, setTimer] = useState(60);
//   const [showToast, setShowToast] = useState(false);

//   useEffect(() => {
//     let interval;
//     if (showModal && timer > 0) {
//       interval = setInterval(() => {
//         setTimer(prev => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [showModal, timer]);

//   const handleAnswerSelect = (index) => {
//     setSelectedAnswer(index);
//     const correct = index === quiz.questions[currentQuestionIndex].correctAnswer;
//     setIsCorrect(correct);
//     setShowFeedback(true);
//     if (correct) setScore(prev => prev + 1);
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < quiz.questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//       setTimer(60);
//       setSelectedAnswer(null);
//       setShowFeedback(false);
//     } else {
//       onQuizComplete(score);
//       setShowModal(false);
//     }
//   };

//   const handleSkipQuestion = () => {
//     if (currentQuestionIndex < quiz.questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//       setTimer(60);
//       setSelectedAnswer(null);
//       setShowFeedback(false);
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 2000);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   if (!showModal) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           {/* Modal header and timer */}
//           {/* Question and options */}
//           {/* Feedback section */}
//           {/* Navigation buttons */}
//         </div>
//       </div>

//       {showToast && <Toast message="Question skipped" icon="fa-forward" />}
//     </div>
//   );
// };

// export default QuizModal;

// src/components/quizzes/QuizModal.jsx
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Toast from "../ui/Toast";

const QuizModal = ({ quiz, showModal, setShowModal, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let interval;
    if (showModal && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showModal, timer]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    const correct =
      index === quiz.questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore((prev) => prev + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(60);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onQuizComplete(score);
      setShowModal(false);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(60);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal header and timer */}

          {/* Question and options */}
          {/* Feedback section */}
          {/* Navigation buttons */}
        </div>
      </div>

      {showToast && <Toast message="Question skipped" icon="fa-forward" />}
    </div>
  );
};

export default QuizModal;

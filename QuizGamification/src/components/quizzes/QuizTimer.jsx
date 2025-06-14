const QuizTimer = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        timeLeft < 15
          ? "bg-red-100 text-red-600"
          : "bg-indigo-100 text-indigo-600"
      }`}
    >
      <i className="far fa-clock mr-1"></i>
      {formatTime(timeLeft)}
    </div>
  );
};

export default QuizTimer;

// // src/components/quizzes/QuizTimer.jsx
// import { useEffect, useState } from 'react';

// const QuizTimer = ({ initialTime = 60, onTimeUp, isPaused = false }) => {
//   const [timeLeft, setTimeLeft] = useState(initialTime);
//   const [isRunning, setIsRunning] = useState(true);

//   useEffect(() => {
//     setIsRunning(!isPaused);
//   }, [isPaused]);

//   useEffect(() => {
//     if (!isRunning || timeLeft <= 0) return;

//     const timerId = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           onTimeUp();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [isRunning, timeLeft, onTimeUp]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   return (
//     <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//       timeLeft < 15 ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
//     }`}>
//       <i className="far fa-clock mr-1"></i>
//       {formatTime(timeLeft)}
//     </div>
//   );
// };

// export default QuizTimer;

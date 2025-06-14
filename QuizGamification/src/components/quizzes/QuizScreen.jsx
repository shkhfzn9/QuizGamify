// // export default QuizScreen; //
// import React, { useEffect, useState } from "react";
// import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
// import { db, auth } from "../../firebase/firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// const QuizScreen = ({ quizId }) => {
//   const [quiz, setQuiz] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [quizFinished, setQuizFinished] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const navigate = useNavigate();

//   // Load user UID
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // Load quiz data from Firestore
//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         setLoading(true);
//         console.log("Fetching quiz with ID:", quizId);
//         const quizRef = doc(db, "quizzes", quizId);
//         const quizSnap = await getDoc(quizRef);
//         if (quizSnap.exists()) {
//           console.log("Quiz found:", quizSnap.data());
//           setQuiz(quizSnap.data());
//         } else {
//           console.error("Quiz not found:", quizId);
//           setError(`Quiz with ID "${quizId}" not found`);
//         }
//       } catch (err) {
//         console.error("Error fetching quiz:", err);
//         setError("Failed to load quiz");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (quizId) {
//       fetchQuiz();
//     }
//   }, [quizId]);

//   // Timer logic
//   useEffect(() => {
//     if (quizFinished) return; // stop timer when done
//     if (timeLeft === 0) {
//       handleNext();
//       return;
//     }
//     const timerId = setInterval(() => {
//       setTimeLeft((t) => Math.max(t - 1, 0));
//     }, 1000);
//     return () => clearInterval(timerId);
//   }, [timeLeft, quizFinished]);

//   const handleOptionClick = (index) => {
//     if (showAnswer) return;
//     setSelectedOption(index);
//     setShowAnswer(true);
//     const correctIndex = quiz.questions[currentQuestion].correctOption;
//     if (index === correctIndex) {
//       setScore((s) => s + 1);
//     }
//   };

//   const handleNext = () => {
//     setShowAnswer(false);
//     setSelectedOption(null);
//     setTimeLeft(30);

//     if (currentQuestion + 1 < quiz.questions.length) {
//       setCurrentQuestion((q) => q + 1);
//     } else {
//       setQuizFinished(true);
//     }
//   };

//   const handleFinish = async () => {
//     if (!userId || !quiz) {
//       console.warn("No user or quiz, skipping update");
//       return navigate("/");
//     }

//     const userRef = doc(db, "users", userId);
//     const userSnap = await getDoc(userRef);

//     // compute xp, level, badges
//     const xpEarned = score * 100;
//     const newTotalXP = (userSnap.data()?.xp || 0) + xpEarned;
//     const newLevel = Math.floor(newTotalXP / 500) + 1;
//     const newBadges = [...(userSnap.data()?.badges || [])];
//     if (
//       score === quiz.questions.length &&
//       !newBadges.includes("Perfect Score")
//     ) {
//       newBadges.push("Perfect Score");
//     }

//     console.log({
//       before: userSnap.exists() ? userSnap.data() : "(no doc)",
//       xpEarned,
//       newTotalXP,
//       newLevel,
//       newBadges,
//     });

//     if (!userSnap.exists()) {
//       // create the doc if it was missing
//       await setDoc(userRef, {
//         xp: newTotalXP,
//         level: newLevel,
//         badges: newBadges,
//       });
//     } else {
//       // update the existing doc
//       await updateDoc(userRef, {
//         xp: newTotalXP,
//         level: newLevel,
//         badges: newBadges,
//       });
//     }

//     // only once the write completes do we navigate home
//     navigate("/");
//   };

//   if (loading) return <div>Loading Quiz…</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!quiz) return <div>No quiz data available</div>;

//   if (quizFinished) {
//     return (
//       <div style={{ padding: "20px" }}>
//         <h2>Quiz Finished 🎉</h2>
//         <p>
//           Your Score: {score} / {quiz.questions.length}
//         </p>
//         <p>XP Earned: {score * 100}</p>
//         <button onClick={handleFinish}>Go Back to Dashboard</button>
//       </div>
//     );
//   }

//   const question = quiz.questions[currentQuestion];
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>{quiz.title}</h2>
//       <p>Time Left: {timeLeft}s</p>
//       <h3>
//         Q{currentQuestion + 1}: {question.questionText}
//       </h3>
//       <div>
//         {question.options.map((option, idx) => {
//           let style = {};
//           if (showAnswer) {
//             if (idx === question.correctOption) {
//               style = { backgroundColor: "green", color: "#fff" };
//             } else if (idx === selectedOption) {
//               style = { backgroundColor: "red", color: "#fff" };
//             }
//           }
//           return (
//             <button
//               key={idx}
//               style={{ ...style, margin: "5px", padding: "10px" }}
//               onClick={() => handleOptionClick(idx)}
//             >
//               {option}
//             </button>
//           );
//         })}
//       </div>
//       {showAnswer && (
//         <button
//           onClick={handleNext}
//           style={{ marginTop: "20px", padding: "10px" }}
//         >
//           {currentQuestion + 1 === quiz.questions.length
//             ? "Finish Quiz"
//             : "Next Question"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default QuizScreen;

// import React, { useEffect, useState } from "react";
// import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
// import { db, auth } from "../../firebase/firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import QuizTimer from "./QuizTimer";
// import Button from "../ui/Button";
// import ProgressBar from "../ui/ProgressBar";
// import QuizResultModal from "./QuizResultModal";

// const QuizScreen = ({ quizId }) => {
//   const [quiz, setQuiz] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [quizFinished, setQuizFinished] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [showResultModal, setShowResultModal] = useState(false);
//   const navigate = useNavigate();

//   // Load user UID
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // Load quiz data from Firestore
//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         setLoading(true);
//         const quizRef = doc(db, "quizzes", quizId);
//         const quizSnap = await getDoc(quizRef);

//         if (quizSnap.exists()) {
//           setQuiz({
//             id: quizSnap.id,
//             ...quizSnap.data(),
//           });
//         } else {
//           setError(`Quiz with ID "${quizId}" not found`);
//         }
//       } catch (err) {
//         console.error("Error fetching quiz:", err);
//         setError("Failed to load quiz");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (quizId) {
//       fetchQuiz();
//     }
//   }, [quizId]);

//   // Timer logic
//   useEffect(() => {
//     if (quizFinished || !quiz) return;

//     if (timeLeft === 0) {
//       handleNext();
//       return;
//     }

//     const timerId = setInterval(() => {
//       setTimeLeft((t) => t - 1);
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft, quizFinished, quiz]);

//   const handleOptionSelect = (index) => {
//     if (showAnswer || !quiz) return;

//     setSelectedOption(index);
//     setShowAnswer(true);

//     const currentQuestion = quiz.questions[currentQuestionIndex];
//     if (index === currentQuestion.correctOption) {
//       setScore((s) => s + 1);
//     }
//   };

//   const handleNext = () => {
//     if (!quiz) return;

//     setShowAnswer(false);
//     setSelectedOption(null);
//     setTimeLeft(30);

//     if (currentQuestionIndex + 1 < quiz.questions.length) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     } else {
//       setQuizFinished(true);
//       setShowResultModal(true);
//     }
//   };

//   const handleSkip = () => {
//     if (!quiz) return;
//     handleNext();
//   };

//   const handleQuizComplete = async () => {
//     if (!userId || !quiz) {
//       return navigate("/");
//     }

//     const userRef = doc(db, "users", userId);
//     const userSnap = await getDoc(userRef);

//     // Calculate XP and badges
//     const xpEarned = score * 100;
//     const accuracy = Math.round((score / quiz.questions.length) * 100);
//     const isPerfectScore = score === quiz.questions.length;

//     try {
//       await updateDoc(userRef, {
//         xp: increment(xpEarned),
//         totalXP: increment(xpEarned),
//         quizzesCompleted: increment(1),
//         [`quizAttempts.${quiz.id}`]: increment(1),
//         [`quizScores.${quiz.id}`]: increment(score),
//         ...(isPerfectScore && { perfectScores: increment(1) }),
//       });

//       // Check for badge achievements
//       const userData = userSnap.data();
//       const newBadges = [...(userData?.badges || [])];

//       if (isPerfectScore && !newBadges.includes("Perfect Score")) {
//         newBadges.push("Perfect Score");
//         await updateDoc(userRef, { badges: newBadges });
//       }
//     } catch (error) {
//       console.error("Error updating user stats:", error);
//     } finally {
//       navigate("/");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   if (!quiz) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
//           No quiz data available
//         </div>
//       </div>
//     );
//   }

//   const currentQuestion = quiz.questions[currentQuestionIndex];
//   const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-3xl mx-auto p-4">
//         {/* Quiz Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
//           <QuizTimer initialTime={timeLeft} onTimeUp={handleNext} />
//         </div>

//         {/* Progress Bar */}
//         <div className="mb-6">
//           <div className="flex justify-between text-sm text-gray-600 mb-1">
//             <span>
//               Question {currentQuestionIndex + 1} of {quiz.questions.length}
//             </span>
//             <span>{Math.round(progress)}% Complete</span>
//           </div>
//           <ProgressBar progress={progress} />
//         </div>

//         {/* Question Card */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
//           <h2 className="text-xl font-medium text-gray-800 mb-4">
//             {currentQuestion.questionText}
//           </h2>

//           <div className="space-y-3">
//             {currentQuestion.options.map((option, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleOptionSelect(index)}
//                 disabled={showAnswer}
//                 className={`w-full text-left p-4 rounded-lg border transition-colors ${
//                   showAnswer
//                     ? index === currentQuestion.correctOption
//                       ? "border-green-500 bg-green-50"
//                       : selectedOption === index
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-200"
//                     : selectedOption === index
//                     ? "border-indigo-500 bg-indigo-50"
//                     : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <div
//                     className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
//                       showAnswer
//                         ? index === currentQuestion.correctOption
//                           ? "bg-green-500 text-white"
//                           : selectedOption === index
//                           ? "bg-red-500 text-white"
//                           : "bg-gray-200 text-gray-600"
//                         : selectedOption === index
//                         ? "bg-indigo-500 text-white"
//                         : "bg-gray-200 text-gray-600"
//                     }`}
//                   >
//                     {String.fromCharCode(65 + index)}
//                   </div>
//                   <span>{option}</span>
//                   {showAnswer && index === currentQuestion.correctOption && (
//                     <span className="ml-auto text-green-500">
//                       <i className="fas fa-check-circle"></i>
//                     </span>
//                   )}
//                   {showAnswer &&
//                     selectedOption === index &&
//                     index !== currentQuestion.correctOption && (
//                       <span className="ml-auto text-red-500">
//                         <i className="fas fa-times-circle"></i>
//                       </span>
//                     )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Feedback and Navigation */}
//         {showAnswer && (
//           <div
//             className={`p-4 rounded-lg mb-6 ${
//               selectedOption === currentQuestion.correctOption
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 {selectedOption === currentQuestion.correctOption ? (
//                   <i className="fas fa-check-circle text-green-500 text-xl mt-0.5"></i>
//                 ) : (
//                   <i className="fas fa-times-circle text-red-500 text-xl mt-0.5"></i>
//                 )}
//               </div>
//               <div className="ml-3">
//                 <h4 className="text-base font-medium">
//                   {selectedOption === currentQuestion.correctOption
//                     ? "Correct!"
//                     : "Incorrect!"}
//                 </h4>
//                 {selectedOption !== currentQuestion.correctOption && (
//                   <p className="text-sm mt-1">
//                     The correct answer is:{" "}
//                     {currentQuestion.options[currentQuestion.correctOption]}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex justify-between">
//           <Button
//             onClick={handleSkip}
//             variant="secondary"
//             disabled={currentQuestionIndex === 0}
//           >
//             Skip Question
//           </Button>
//           {showAnswer ? (
//             <Button onClick={handleNext}>
//               {currentQuestionIndex + 1 === quiz.questions.length
//                 ? "Finish Quiz"
//                 : "Next Question"}
//             </Button>
//           ) : (
//             <div className="text-gray-500 text-sm">
//               Select an answer to continue
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Result Modal */}
//       {showResultModal && (
//         <QuizResultModal
//           score={score}
//           totalQuestions={quiz.questions.length}
//           timeTaken={quiz.questions.length * 30 - timeLeft}
//           quizId={quiz.id}
//           onClose={handleQuizComplete}
//         />
//       )}
//     </div>
//   );
// };

// export default QuizScreen;

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore"; // Add increment import
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext"; // Use the auth context instead
import { useNavigate } from "react-router-dom";
import QuizTimer from "./QuizTimer";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";
import QuizResultModal from "./QuizResultModal";

const QuizScreen = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const { currentUser } = useAuth(); // Use auth context
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
  }, [currentUser, navigate]);

  // Load quiz data from Firestore
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setError("No quiz ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching quiz with ID:", quizId); // Debug log

        const quizRef = doc(db, "quizzes", quizId);
        const quizSnap = await getDoc(quizRef);

        if (quizSnap.exists()) {
          const quizData = {
            id: quizSnap.id,
            ...quizSnap.data(),
          };
          console.log("Quiz data loaded:", quizData); // Debug log
          setQuiz(quizData);
        } else {
          console.error("Quiz not found:", quizId); // Debug log
          setError(`Quiz with ID "${quizId}" not found`);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer logic - Fixed
  useEffect(() => {
    if (quizFinished || !quiz || showAnswer) return;

    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, quizFinished, quiz, showAnswer]);

  const handleOptionSelect = (index) => {
    if (showAnswer || !quiz) return;

    setSelectedOption(index);
    setShowAnswer(true);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (index === currentQuestion.correctOption) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (!quiz) return;

    setShowAnswer(false);
    setSelectedOption(null);
    setTimeLeft(30);

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      setShowResultModal(true);
    }
  };

  const handleSkip = () => {
    if (!quiz) return;
    handleNext();
  };

  const handleQuizComplete = async () => {
    if (!currentUser || !quiz) {
      navigate("/");
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      // Calculate XP and badges
      const xpEarned = score * 100;
      const isPerfectScore = score === quiz.questions.length;

      if (!userSnap.exists()) {
        // Create new user document
        const scorePercentage = Math.round((score / quiz.questions.length) * 100);
        const quizPerformance = [{
          quizId: quizId,
          quizTitle: quiz.title,
          category: quiz.category,
          score: score,
          totalQuestions: quiz.questions.length,
          percentage: scorePercentage,
          xpEarned: xpEarned,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString()
        }];

        await setDoc(userRef, {
          xp: xpEarned,
          totalXP: xpEarned,
          quizzesCompleted: 1,
          perfectScores: isPerfectScore ? 1 : 0,
          badges: isPerfectScore ? ["Perfect Score"] : [],
          quizPerformance: quizPerformance,
        });
      } else {
        // Update existing user document
        const userData = userSnap.data();
        const newBadges = [...(userData?.badges || [])];

        if (isPerfectScore && !newBadges.includes("Perfect Score")) {
          newBadges.push("Perfect Score");
        }

        // Add quiz performance data
        const quizPerformance = userData?.quizPerformance || [];
        const scorePercentage = Math.round((score / quiz.questions.length) * 100);
        
        quizPerformance.push({
          quizId: quizId,
          quizTitle: quiz.title,
          category: quiz.category,
          score: score,
          totalQuestions: quiz.questions.length,
          percentage: scorePercentage,
          xpEarned: xpEarned,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString()
        });

        await updateDoc(userRef, {
          xp: increment(xpEarned),
          totalXP: increment(xpEarned),
          quizzesCompleted: increment(1),
          ...(isPerfectScore && { perfectScores: increment(1) }),
          badges: newBadges,
          quizPerformance: quizPerformance,
        });

        // Update user rank history after XP change
        try {
          const { updateUserRankHistory } = await import('../../utils/rankUpdater');
          await updateUserRankHistory(currentUser.uid);
        } catch (error) {
          console.error("Error updating rank history:", error);
        }
      }
    } catch (error) {
      console.error("Error updating user stats:", error);
    } finally {
      navigate("/");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Loading Quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No quiz data
  if (!quiz) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No quiz data available</p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if quiz has questions
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>This quiz has no questions</p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        {/* Quiz Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
          <div className="text-lg font-semibold text-red-600">{timeLeft}s</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            {currentQuestion.questionText}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showAnswer}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  showAnswer
                    ? index === currentQuestion.correctOption
                      ? "border-green-500 bg-green-50"
                      : selectedOption === index
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                    : selectedOption === index
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      showAnswer
                        ? index === currentQuestion.correctOption
                          ? "bg-green-500 text-white"
                          : selectedOption === index
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-600"
                        : selectedOption === index
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                  {showAnswer && index === currentQuestion.correctOption && (
                    <span className="ml-auto text-green-500">✓</span>
                  )}
                  {showAnswer &&
                    selectedOption === index &&
                    index !== currentQuestion.correctOption && (
                      <span className="ml-auto text-red-500">✗</span>
                    )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback and Navigation */}
        {showAnswer && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              selectedOption === currentQuestion.correctOption
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {selectedOption === currentQuestion.correctOption ? (
                  <span className="text-green-500 text-xl">✓</span>
                ) : (
                  <span className="text-red-500 text-xl">✗</span>
                )}
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium">
                  {selectedOption === currentQuestion.correctOption
                    ? "Correct!"
                    : "Incorrect!"}
                </h4>
                {selectedOption !== currentQuestion.correctOption && (
                  <p className="text-sm mt-1">
                    The correct answer is:{" "}
                    {currentQuestion.options[currentQuestion.correctOption]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            onClick={handleSkip}
            variant="secondary"
            disabled={showAnswer}
          >
            Skip Question
          </Button>
          {showAnswer ? (
            <Button onClick={handleNext}>
              {currentQuestionIndex + 1 === quiz.questions.length
                ? "Finish Quiz"
                : "Next Question"}
            </Button>
          ) : (
            <div className="text-gray-500 text-sm">
              Select an answer to continue
            </div>
          )}
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && (
        <QuizResultModal
          score={score}
          totalQuestions={quiz.questions.length}
          timeTaken={quiz.questions.length * 30 - timeLeft}
          quizId={quiz.id}
          onClose={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default QuizScreen;

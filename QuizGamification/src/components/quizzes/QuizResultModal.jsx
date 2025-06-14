// // // src/components/quizzes/QuizResultModal.jsx
// // import { useEffect } from "react";
// // import { doc, updateDoc, increment } from "firebase/firestore";
// // import { db, auth } from "../../firebase/firebaseConfig";
// // import Button from "../ui/Button";

// import Button from "../ui/Button";

// // const QuizResultModal = ({
// //   score,
// //   totalQuestions,
// //   timeTaken,
// //   quizId,
// //   onClose,
// // }) => {
// //   const xpEarned = score * 10;
// //   const accuracy = Math.round((score / totalQuestions) * 100);

// //   useEffect(() => {
// //     const updateUserStats = async () => {
// //       const user = auth.currentUser;
// //       if (!user) return;

// //       const userRef = doc(db, "users", user.uid);

// //       try {
// //         await updateDoc(userRef, {
// //           xp: increment(xpEarned),
// //           totalXP: increment(xpEarned),
// //           weeklyXP: increment(xpEarned),
// //           monthlyXP: increment(xpEarned),
// //           quizzesCompleted: increment(1),
// //           [`quizAttempts.${quizId}`]: increment(1),
// //           [`quizScores.${quizId}`]: increment(score),
// //           ...(accuracy === 100 && { perfectScores: increment(1) }),
// //         });

// //         // Check for badge achievements
// //         const userDoc = await getDoc(userRef);
// //         const userData = userDoc.data();

// //         // Example badge checks
// //         if (
// //           userData.quizzesCompleted >= 10 &&
// //           !userData.badges?.includes("Quiz Master")
// //         ) {
// //           await updateDoc(userRef, {
// //             badges: [...(userData.badges || []), "Quiz Master"],
// //           });
// //         }
// //       } catch (error) {
// //         console.error("Error updating user stats:", error);
// //       }
// //     };

// //     updateUserStats();
// //   }, []);

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //       <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
// //         <h2 className="text-2xl font-bold text-center mb-6">Quiz Results 🎉</h2>

// //         <div className="grid grid-cols-2 gap-4 mb-6">
// //           <div className="bg-indigo-50 p-4 rounded-lg text-center">
// //             <p className="text-sm text-indigo-600">Score</p>
// //             <p className="text-3xl font-bold">
// //               {score}/{totalQuestions}
// //             </p>
// //           </div>
// //           <div className="bg-green-50 p-4 rounded-lg text-center">
// //             <p className="text-sm text-green-600">Accuracy</p>
// //             <p className="text-3xl font-bold">{accuracy}%</p>
// //           </div>
// //           <div className="bg-yellow-50 p-4 rounded-lg text-center">
// //             <p className="text-sm text-yellow-600">Time Taken</p>
// //             <p className="text-3xl font-bold">{timeTaken}s</p>
// //           </div>
// //           <div className="bg-purple-50 p-4 rounded-lg text-center">
// //             <p className="text-sm text-purple-600">XP Earned</p>
// //             <p className="text-3xl font-bold">+{xpEarned}</p>
// //           </div>
// //         </div>

// //         {accuracy === 100 && (
// //           <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 p-3 rounded-lg mb-4 flex items-center">
// //             <i className="fas fa-trophy text-xl mr-2"></i>
// //             <span className="font-medium">
// //               Perfect Score! You earned a badge!
// //             </span>
// //           </div>
// //         )}

// //         <div className="flex justify-center">
// //           <Button onClick={onClose} className="px-8">
// //             Back to Quizzes
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default QuizResultModal;

// const QuizResultModal = ({ score, totalQuestions, timeTaken, onClose }) => {
//   const xpEarned = score * 100;
//   const accuracy = Math.round((score / totalQuestions) * 100);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
//         <h2 className="text-2xl font-bold text-center mb-6">Quiz Results 🎉</h2>

//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div className="bg-indigo-50 p-4 rounded-lg text-center">
//             <p className="text-sm text-indigo-600">Score</p>
//             <p className="text-3xl font-bold">
//               {score}/{totalQuestions}
//             </p>
//           </div>
//           <div className="bg-green-50 p-4 rounded-lg text-center">
//             <p className="text-sm text-green-600">Accuracy</p>
//             <p className="text-3xl font-bold">{accuracy}%</p>
//           </div>
//           <div className="bg-yellow-50 p-4 rounded-lg text-center">
//             <p className="text-sm text-yellow-600">Time Taken</p>
//             <p className="text-3xl font-bold">{timeTaken}s</p>
//           </div>
//           <div className="bg-purple-50 p-4 rounded-lg text-center">
//             <p className="text-sm text-purple-600">XP Earned</p>
//             <p className="text-3xl font-bold">+{xpEarned}</p>
//           </div>
//         </div>

//         {accuracy === 100 && (
//           <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 p-3 rounded-lg mb-4 flex items-center">
//             <i className="fas fa-trophy text-xl mr-2"></i>
//             <span className="font-medium">
//               Perfect Score! You earned a badge!
//             </span>
//           </div>
//         )}

//         <div className="flex justify-center">
//           <Button onClick={onClose} className="px-8">
//             Back to Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizResultModal;
import { useState } from "react";
import Button from "../ui/Button";

const QuizResultModal = ({ score, totalQuestions, timeTaken, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const xpEarned = score * 100;
  const accuracy = Math.round((score / totalQuestions) * 100);

  const handleBackToDashboard = async () => {
    setIsLoading(true);

    // Add a small delay to show the loader (optional)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Call the onClose function
    onClose();

    // Reset loading state (in case the modal doesn't unmount immediately)
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Results 🎉</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-lg text-center">
            <p className="text-sm text-indigo-600">Score</p>
            <p className="text-3xl font-bold">
              {score}/{totalQuestions}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600">Accuracy</p>
            <p className="text-3xl font-bold">{accuracy}%</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-sm text-yellow-600">Time Taken</p>
            <p className="text-3xl font-bold">{timeTaken}s</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-600">XP Earned</p>
            <p className="text-3xl font-bold">+{xpEarned}</p>
          </div>
        </div>

        {accuracy === 100 && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 p-3 rounded-lg mb-4 flex items-center">
            <i className="fas fa-trophy text-xl mr-2"></i>
            <span className="font-medium">
              Perfect Score! You earned a badge!
            </span>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={handleBackToDashboard}
            className="px-8 relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Back to Dashboard"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultModal;

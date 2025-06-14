// src/components/badges/BadgesList.jsx
import { useUserData } from "../../hooks/useUserData";

const BadgesList = () => {
  const { userData } = useUserData();

  const badges = [
    {
      id: 1,
      name: "Math Wizard",
      description: "Complete 10 math quizzes",
      progress: userData?.mathQuizzesCompleted
        ? Math.min(userData.mathQuizzesCompleted * 10, 100)
        : 0,
      icon: "fa-square-root-variable",
    },
    {
      id: 2,
      name: "Science Explorer",
      description: "Answer 50 science questions correctly",
      progress: userData?.scienceCorrectAnswers
        ? Math.min(userData.scienceCorrectAnswers * 2, 100)
        : 0,
      icon: "fa-flask",
    },
    {
      id: 3,
      name: "History Buff",
      description: "Achieve 90% in 5 history quizzes",
      progress: userData?.historyHighScores
        ? Math.min(userData.historyHighScores * 20, 100)
        : 0,
      icon: "fa-landmark",
    },
    {
      id: 4,
      name: "Quiz Master",
      description: "Complete 100 quizzes total",
      progress: userData?.totalQuizzesCompleted || 0,
      icon: "fa-trophy",
    },
    {
      id: 5,
      name: "Perfect Score",
      description: "Get 100% on any quiz",
      progress: userData?.perfectScores ? 100 : 0,
      icon: "fa-star",
    },
    {
      id: 6,
      name: "Speed Demon",
      description: "Complete a quiz in record time",
      progress: userData?.fastQuizzes ? 100 : 0,
      icon: "fa-bolt",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`bg-white rounded-xl shadow-md p-6 border ${
            badge.progress === 100 ? "border-yellow-300" : "border-gray-100"
          } transition-all hover:shadow-lg`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                badge.progress === 100
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <i className={`fas ${badge.icon}`}></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {badge.name}
              </h3>
              <p className="text-sm text-gray-500">{badge.description}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className={`h-2 rounded-full ${
                badge.progress === 100 ? "bg-yellow-400" : "bg-indigo-600"
              }`}
              style={{ width: `${badge.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{badge.progress}% Complete</span>
            {badge.progress === 100 ? (
              <span className="text-yellow-600 font-medium">Earned!</span>
            ) : (
              <span className="text-indigo-600 font-medium">
                {badge.progress < 50 ? "Just started" : "Almost there!"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BadgesList;

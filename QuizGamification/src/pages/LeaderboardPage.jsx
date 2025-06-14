// src/pages/LeaderboardPage.jsx
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import NavTabs from "../components/common/NavTabs";
import TopRanked from "../components/leaderboard/TopRanked";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useUserData } from "../hooks/useUserData";
import PageLoader from "../components/ui/PageLoader";

const LeaderboardPage = () => {
  const [timeRange, setTimeRange] = useState("all"); // Default to all-time
  const { leaderboardData, loading } = useLeaderboard(timeRange);
  const { userData, loading: userLoading } = useUserData();

  // Auto-refresh leaderboard every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || userLoading) {
    return <PageLoader message="Loading leaderboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs activeTab="leaderboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Current User Rank Display */}
          {userData && userData.rank && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {userData.displayName?.charAt(0) || userData.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Your Current Rank</h3>
                    <p className="text-sm text-gray-600">
                      {userData.displayName || userData.email?.split('@')[0] || 'You'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">#{userData.rank}</div>
                  <div className="text-sm text-gray-500">{userData.totalXP || userData.xp || 0} XP</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
            <div className="flex space-x-2 items-center">
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-1 text-sm rounded-full font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <i className="fas fa-refresh mr-1"></i>
                Refresh
              </button>
              <button
                onClick={() => setTimeRange("week")}
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  timeRange === "week"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  timeRange === "month"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeRange("all")}
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  timeRange === "all"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Debug info */}
          {/* {process.env.NODE_ENV === "development" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Debug Info:
              </h3>
              <p className="text-sm text-yellow-700">
                Time Range: {timeRange} | Users Found: {leaderboardData.length}
              </p>
              {leaderboardData.slice(0, 3).map((user, i) => (
                <p key={i} className="text-xs text-yellow-600">
                  {i + 1}. {user.name}: {user.points} pts (XP: {user.xp}, Total:{" "}
                  {user.totalXP})
                </p>
              ))}
            </div>
          )} */}

          <TopRanked leaderboardData={leaderboardData} />
          <LeaderboardTable data={leaderboardData.slice(3)} />
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;

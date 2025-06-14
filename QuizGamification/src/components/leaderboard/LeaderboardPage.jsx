import { useState } from "react";
import Header from "../components/common/Header";
import NavTabs from "../components/common/NavTabs";
import TopRanked from "../components/leaderboard/TopRanked";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import { useLeaderboard } from "../hooks/useLeaderboard";

const LeaderboardPage = () => {
  const [timeRange, setTimeRange] = useState("week");
  const { leaderboardData, loading } = useLeaderboard(timeRange);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs activeTab="leaderboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
            <div className="flex space-x-2">
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

          <TopRanked leaderboardData={leaderboardData} />
          <LeaderboardTable data={leaderboardData.slice(3)} />
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;

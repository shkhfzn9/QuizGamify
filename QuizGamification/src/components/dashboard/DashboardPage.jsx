import { useUserData } from "../hooks/useUserData";
import Header from "../components/common/Header";
import NavTabs from "../components/common/NavTabs";
import StatsCards from "../components/dashboard/StatsCards";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import Suggestions from "../components/dashboard/Suggestions";
import StreakCounter from "../components/achievements/StreakCounter";
import LevelProgress from "../components/achievements/LevelProgress";

const DashboardPage = () => {
  const { userData, loading } = useUserData();

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
      <NavTabs activeTab="dashboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StatsCards userData={userData} />
            <PerformanceChart />
            <Suggestions />
          </div>

          <div className="space-y-8">
            <StreakCounter />
            <LevelProgress />
            <DailyChallengeCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

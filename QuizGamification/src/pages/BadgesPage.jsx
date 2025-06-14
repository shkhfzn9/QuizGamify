// src/pages/BadgesPage.jsx
import Header from "../components/common/Header";
import NavTabs from "../components/common/NavTabs";
import BadgesList from "../components/badges/BadgesList";
import { useUserData } from "../hooks/useUserData";

const BadgesPage = () => {
  const { userData } = useUserData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs activeTab="badges" />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Achievements
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">
                {userData?.badges?.length || 0}/24 Badges Earned
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${((userData?.badges?.length || 0) / 24) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <BadgesList />

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">
                  Unlock Premium Badges
                </h3>
                <p className="opacity-90">
                  Complete special challenges to earn exclusive rewards!
                </p>
              </div>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                View Premium Challenges
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BadgesPage;

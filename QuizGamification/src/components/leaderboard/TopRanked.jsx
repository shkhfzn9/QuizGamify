// src/components/leaderboard/TopRanked.jsx
const TopRanked = ({ leaderboardData }) => {
  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Second Place */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-center order-2 md:order-1">
        <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center mb-3">
          <span className="text-xl font-bold text-gray-700">
            {topThree[1]?.avatar || "2"}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <i className="fas fa-medal text-gray-400 text-xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          {topThree[1]?.name || "Second Place"}
        </h3>
        <p className="text-indigo-600 font-bold">
          {topThree[1]?.points || 0} pts
        </p>
      </div>

      {/* First Place */}
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl shadow-md p-6 border border-amber-200 flex flex-col items-center transform scale-110 order-1 md:order-2">
        <div className="w-20 h-20 rounded-full bg-amber-200 border-4 border-amber-300 flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-amber-700">
            {topThree[0]?.avatar || "1"}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
          <i className="fas fa-crown text-amber-500 text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          {topThree[0]?.name || "Top Performer"}
        </h3>
        <p className="text-indigo-600 font-bold text-lg">
          {topThree[0]?.points || 0} pts
        </p>
      </div>

      {/* Third Place */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-center order-3">
        <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center mb-3">
          <span className="text-xl font-bold text-gray-700">
            {topThree[2]?.avatar || "3"}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <i className="fas fa-medal text-amber-700 text-xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          {topThree[2]?.name || "Third Place"}
        </h3>
        <p className="text-indigo-600 font-bold">
          {topThree[2]?.points || 0} pts
        </p>
      </div>
    </div>
  );
};

export default TopRanked;

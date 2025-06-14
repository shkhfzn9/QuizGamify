// src/components/dashboard/StatsCards.jsx
import { useMemo } from 'react';
import SkeletonLoader from '../ui/SkeletonLoader';

const StatsCards = ({ userData, loading = false }) => {
  // Calculate percentage change from last week
  const weeklyChange = useMemo(() => {
    if (!userData?.weeklyStats) {
      return { percentage: 0, isPositive: true, hasData: false };
    }

    const currentXP = userData.xp || 0;
    const lastWeekXP = userData.weeklyStats.lastWeekXP || 0;
    
    if (lastWeekXP === 0) {
      return { percentage: 100, isPositive: true, hasData: currentXP > 0 };
    }

    const change = ((currentXP - lastWeekXP) / lastWeekXP) * 100;
    return {
      percentage: Math.abs(Math.round(change)),
      isPositive: change >= 0,
      hasData: true
    };
  }, [userData]);

  // Calculate quizzes completed this week
  const weeklyQuizzes = useMemo(() => {
    if (!userData?.quizPerformance || !Array.isArray(userData.quizPerformance)) {
      return { count: 0, hasData: false };
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const thisWeekQuizzes = userData.quizPerformance.filter(performance => {
      // Handle both ISO string and date object formats
      const completionDate = typeof performance.timestamp === 'string' 
        ? new Date(performance.timestamp)
        : performance.timestamp?.toDate ? 
          performance.timestamp.toDate() : 
          new Date(performance.timestamp);
      
      return completionDate >= oneWeekAgo;
    });

    return {
      count: thisWeekQuizzes.length,
      hasData: userData.quizPerformance.length > 0
    };
  }, [userData]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonLoader type="stats" count={3} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Total Points</h3>
          <i className="fas fa-star text-yellow-400 text-xl"></i>
        </div>
        <p className="text-3xl font-bold text-indigo-600">
          {userData?.xp || 0}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {weeklyChange.hasData ? (
            <>
              <i className={`fas ${weeklyChange.isPositive ? 'fa-arrow-up' : 'fa-arrow-down'} ${weeklyChange.isPositive ? 'text-green-500' : 'text-red-500'} mr-1`}></i>
              <span className={`${weeklyChange.isPositive ? 'text-green-500' : 'text-red-500'} font-medium`}>
                {weeklyChange.percentage}%
              </span> from last week
            </>
          ) : (
            <span className="text-gray-400">No data from last week</span>
          )}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Quizzes Completed
          </h3>
          <i className="fas fa-check-circle text-green-500 text-xl"></i>
        </div>
        <p className="text-3xl font-bold text-indigo-600">
          {userData?.quizzesCompleted || 0}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {weeklyQuizzes.hasData ? (
            <>
              <span className="text-indigo-500 font-medium">
                {weeklyQuizzes.count} {weeklyQuizzes.count === 1 ? 'new' : 'new'}
              </span> this week
            </>
          ) : (
            <span className="text-gray-400">No quizzes this week</span>
          )}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Current Rank</h3>
          <i className="fas fa-medal text-amber-500 text-xl"></i>
        </div>
        <p className="text-3xl font-bold text-indigo-600">
          #{userData?.rank || "N/A"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {userData?.rankChange ? (
            <>
              <i className={`${userData.rankChange.icon} text-${userData.rankChange.color}-500 mr-1`}></i>
              <span className={`text-${userData.rankChange.color}-500 font-medium`}>
                {userData.rankChange.text}
              </span>
            </>
          ) : (
            <span className="text-gray-400">Rank tracking available soon</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default StatsCards;

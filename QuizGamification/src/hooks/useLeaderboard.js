// src/hooks/useLeaderboard.js
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const useLeaderboard = (timeRange = 'week') => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        console.log(`Fetching leaderboard for timeRange: ${timeRange}`);
        
        // Get all users sorted by totalXP (we'll filter by time on client side)
        const q = query(
          collection(db, 'users'),
          orderBy('totalXP', 'desc')
        );

        const querySnapshot = await getDocs(q);
        
        // Calculate date ranges
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const allUsers = querySnapshot.docs.map((doc, index) => {
          const userData = doc.data();
          
          // Calculate time-based points from quiz performance
          let timeFilteredPoints = 0;
          const quizPerformance = userData.quizPerformance || [];
          
          if (timeRange === 'week') {
            // Count XP from quizzes taken in the last week
            timeFilteredPoints = quizPerformance
              .filter(quiz => new Date(quiz.timestamp) >= oneWeekAgo)
              .reduce((total, quiz) => total + (quiz.xpEarned || 0), 0);
          } else if (timeRange === 'month') {
            // Count XP from quizzes taken in the last month
            timeFilteredPoints = quizPerformance
              .filter(quiz => new Date(quiz.timestamp) >= oneMonthAgo)
              .reduce((total, quiz) => total + (quiz.xpEarned || 0), 0);
          } else {
            // All time - use total XP
            timeFilteredPoints = userData.totalXP || userData.xp || 0;
          }
          
          return {
            id: doc.id,
            ...userData,
            name: userData.displayName || userData.email?.split('@')[0] || 'Anonymous',
            points: timeFilteredPoints,
            avatar: userData.displayName?.charAt(0) || userData.email?.charAt(0) || 'U',
            change: index === 0 ? 'same' : ['up', 'down', 'same'][index % 3],
            rank: index + 1,
            timeRange: timeRange
          };
        });

        // Filter out users with 0 points for week/month views and sort by points
        const filteredUsers = allUsers
          .filter(user => timeRange === 'all' || user.points > 0)
          .sort((a, b) => b.points - a.points)
          .slice(0, 10)
          .map((user, index) => ({
            ...user,
            rank: index + 1
          }));

        console.log(`Leaderboard data for ${timeRange}:`, filteredUsers);
        setLeaderboardData(filteredUsers);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeRange]);

  return { leaderboardData, loading };
};
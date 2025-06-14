// src/hooks/useUserData.js
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from "../context/AuthContext";

export const useUserData = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const calculateWeeklyStats = (data) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get last week's XP from stored data or calculate if not available
    const lastWeekXP = data.lastWeekXP || 0;
    const currentXP = data.xp || 0;
    
    // If no previous week data exists, store current XP as baseline
    if (!data.lastWeekXP && !data.weeklyStatsLastUpdated) {
      return {
        lastWeekXP: currentXP,
        weeklyStatsLastUpdated: now.toISOString(),
        shouldUpdate: true
      };
    }

    // Check if we need to update weekly stats (if more than a week has passed)
    const lastUpdated = data.weeklyStatsLastUpdated ? new Date(data.weeklyStatsLastUpdated) : new Date(0);
    const shouldUpdate = now.getTime() - lastUpdated.getTime() > 7 * 24 * 60 * 60 * 1000;

    return {
      lastWeekXP: shouldUpdate ? currentXP : lastWeekXP,
      weeklyStatsLastUpdated: shouldUpdate ? now.toISOString() : data.weeklyStatsLastUpdated,
      shouldUpdate
    };
  };

  const calculateUserRank = async (userTotalXP) => {
    try {
      // Get all users ordered by totalXP
      const q = query(collection(db, 'users'), orderBy('totalXP', 'desc'));
      const querySnapshot = await getDocs(q);
      
      let rank = 1;
      for (const doc of querySnapshot.docs) {
        const docData = doc.data();
        if (doc.id === currentUser.uid) {
          break;
        }
        if ((docData.totalXP || 0) > userTotalXP) {
          rank++;
        }
      }
      
      return rank;
    } catch (error) {
      console.error('Error calculating user rank:', error);
      return null;
    }
  };

  const calculateRankChange = (currentRank, previousRank) => {
    // If no previous rank data, show neutral message for new users
    if (!previousRank && currentRank) {
      return {
        direction: 'new',
        amount: 0,
        text: 'New ranking',
        icon: 'fas fa-star',
        color: 'indigo'
      };
    }
    
    if (!previousRank || !currentRank) return null;
    
    const change = previousRank - currentRank; // Positive means rank improved (went up)
    
    if (change > 0) {
      return {
        direction: 'up',
        amount: change,
        text: `Up ${change} position${change > 1 ? 's' : ''}`,
        icon: 'fas fa-arrow-up',
        color: 'green'
      };
    } else if (change < 0) {
      return {
        direction: 'down',
        amount: Math.abs(change),
        text: `Down ${Math.abs(change)} position${Math.abs(change) > 1 ? 's' : ''}`,
        icon: 'fas fa-arrow-down',
        color: 'red'
      };
    } else {
      return {
        direction: 'same',
        amount: 0,
        text: 'No change',
        icon: 'fas fa-minus',
        color: 'gray'
      };
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const userTotalXP = data.totalXP || data.xp || 0;
          const rank = await calculateUserRank(userTotalXP);
          
          // Calculate weekly stats
          const weeklyStats = calculateWeeklyStats(data);
          
          // Update Firestore if weekly stats need updating
          if (weeklyStats.shouldUpdate) {
            try {
              await updateDoc(doc(db, 'users', currentUser.uid), {
                lastWeekXP: weeklyStats.lastWeekXP,
                weeklyStatsLastUpdated: weeklyStats.weeklyStatsLastUpdated
              });
            } catch (error) {
              console.error('Error updating weekly stats:', error);
            }
          }
          
          // Initialize rank tracking if not done yet
          if (!data.hasOwnProperty('previousRank')) {
            try {
              const { initializeRankTrackingForUser } = await import('../utils/initializeRankTracking');
              await initializeRankTrackingForUser(currentUser.uid);
              // Refetch data after initialization
              const updatedUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
              if (updatedUserDoc.exists()) {
                const updatedData = updatedUserDoc.data();
                const rankChange = calculateRankChange(rank, updatedData.previousRank);
                setUserData({
                  ...updatedData,
                  rank: rank,
                  rankChange: rankChange,
                  weeklyStats: {
                    lastWeekXP: weeklyStats.lastWeekXP,
                    weeklyStatsLastUpdated: weeklyStats.weeklyStatsLastUpdated
                  }
                });
              }
              return;
            } catch (error) {
              console.error('Error initializing rank tracking:', error);
            }
          }
          
          const previousRank = data.previousRank || null;
          const rankChange = calculateRankChange(rank, previousRank);
          
          setUserData({
            ...data,
            rank: rank,
            previousRank: previousRank,
            rankChange: rankChange,
            weeklyStats: {
              lastWeekXP: weeklyStats.lastWeekXP,
              weeklyStatsLastUpdated: weeklyStats.weeklyStatsLastUpdated
            }
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return { userData, loading };
};
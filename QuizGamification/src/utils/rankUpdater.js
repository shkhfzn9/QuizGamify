// src/utils/rankUpdater.js
import { doc, updateDoc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const updateUserRankHistory = async (userId) => {
  try {
    // Get current user data
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data();
    const currentRank = await calculateUserRank(userId, userData.totalXP || userData.xp || 0);
    
    // Update previousRank and current rank
    await updateDoc(doc(db, 'users', userId), {
      previousRank: userData.rank || currentRank,
      rank: currentRank,
      lastRankUpdate: new Date().toISOString()
    });
    
    console.log(`Updated rank history for user ${userId}: ${userData.rank || 'N/A'} -> ${currentRank}`);
  } catch (error) {
    console.error('Error updating user rank history:', error);
  }
};

const calculateUserRank = async (userId, userTotalXP) => {
  try {
    const q = query(collection(db, 'users'), orderBy('totalXP', 'desc'));
    const querySnapshot = await getDocs(q);
    
    let rank = 1;
    for (const doc of querySnapshot.docs) {
      const docData = doc.data();
      if (doc.id === userId) {
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

// Function to update all users' rank history (can be called periodically)
export const updateAllUsersRankHistory = async () => {
  try {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    
    const updatePromises = querySnapshot.docs.map(doc => 
      updateUserRankHistory(doc.id)
    );
    
    await Promise.all(updatePromises);
    console.log('Updated rank history for all users');
  } catch (error) {
    console.error('Error updating all users rank history:', error);
  }
};

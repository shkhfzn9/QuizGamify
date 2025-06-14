// src/utils/initializeRankTracking.js
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Initialize rank tracking for existing users who don't have previousRank
export const initializeRankTrackingForAllUsers = async () => {
  try {
    console.log('Initializing rank tracking for all users...');
    
    // Get all users ordered by totalXP
    const q = query(collection(db, 'users'), orderBy('totalXP', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const updatePromises = [];
    
    querySnapshot.docs.forEach((userDoc, index) => {
      const userData = userDoc.data();
      const currentRank = index + 1;
      
      // Only update if user doesn't have rank tracking initialized
      if (!userData.hasOwnProperty('previousRank')) {
        updatePromises.push(
          updateDoc(doc(db, 'users', userDoc.id), {
            rank: currentRank,
            previousRank: currentRank, // Set same as current for initial setup
            lastRankUpdate: new Date().toISOString(),
            rankTrackingInitialized: true
          })
        );
      }
    });
    
    await Promise.all(updatePromises);
    console.log(`Initialized rank tracking for ${updatePromises.length} users`);
    
    return { success: true, usersUpdated: updatePromises.length };
  } catch (error) {
    console.error('Error initializing rank tracking:', error);
    return { success: false, error: error.message };
  }
};

// Initialize rank tracking for a single user
export const initializeRankTrackingForUser = async (userId) => {
  try {
    // Calculate current rank for this user
    const q = query(collection(db, 'users'), orderBy('totalXP', 'desc'));
    const querySnapshot = await getDocs(q);
    
    let currentRank = 1;
    let userFound = false;
    
    for (const userDoc of querySnapshot.docs) {
      if (userDoc.id === userId) {
        userFound = true;
        break;
      }
      currentRank++;
    }
    
    if (userFound) {
      await updateDoc(doc(db, 'users', userId), {
        rank: currentRank,
        previousRank: currentRank,
        lastRankUpdate: new Date().toISOString(),
        rankTrackingInitialized: true
      });
      
      console.log(`Initialized rank tracking for user ${userId} at rank ${currentRank}`);
      return { success: true, rank: currentRank };
    }
    
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error initializing rank tracking for user:', error);
    return { success: false, error: error.message };
  }
};

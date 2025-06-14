// Upload sample quiz data to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

// Firebase config - you may need to update this
const firebaseConfig = {
  // Add your Firebase config here
  // For now, we'll assume it's configured in the existing app
};

// Read sample data
const sampleData = JSON.parse(fs.readFileSync('./sample_quiz_upload.json', 'utf8'));

console.log('Please run this from the browser console instead:');
console.log('');
console.log('// Copy this code to browser console:');
console.log('');
console.log(`const sampleData = ${JSON.stringify(sampleData, null, 2)};`);
console.log('');
console.log(`
// Run this in browser console:
import { doc, setDoc } from 'firebase/firestore';
import { db } from './src/firebase/firebaseConfig.js';

const uploadData = async () => {
  for (const [quizId, quizData] of Object.entries(sampleData)) {
    try {
      const quizRef = doc(db, "quizzes", quizId);
      await setDoc(quizRef, quizData);
      console.log(\`✅ Uploaded: \${quizData.title}\`);
    } catch (error) {
      console.error(\`❌ Error uploading \${quizId}:\`, error);
    }
  }
  console.log("Upload complete!");
};

uploadData();
`);

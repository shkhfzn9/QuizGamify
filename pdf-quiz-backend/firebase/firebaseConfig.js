const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

exports.saveQuizToFirestore = async (quiz) => {
  try {
    const docRef = await db.collection('quizzes').add(quiz);
    return docRef.id;
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    throw error;
  }
};

exports.uploadPdfToStorage = async (filePath, quizId) => {
  try {
    const destination = `quizzes/${quizId}/source.pdf`;
    await bucket.upload(filePath, {
      destination: destination,
      metadata: { contentType: 'application/pdf' }
    });
    
    // Get public URL
    const [url] = await bucket.file(destination).getSignedUrl({
      action: 'read',
      expires: '03-09-2491' // Far future date
    });
    
    return url;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

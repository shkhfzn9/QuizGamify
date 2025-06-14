import { db } from "../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";

// 👇 This is your quiz content
const quizData = [
  // Math Quiz
  {
    title: "Basic Algebra Quiz",
    category: "Math",
    difficulty: "easy",
    questions: [
      {
        questionText: "What is 2 + 2?",
        options: ["1", "2", "3", "4"],
        correctOption: 3,
      },
      {
        questionText: "Solve for x: x + 3 = 5",
        options: ["1", "2", "3", "4"],
        correctOption: 1,
      },
      {
        questionText: "What is 5 × 6?",
        options: ["11", "25", "30", "56"],
        correctOption: 2,
      },
      {
        questionText: "Simplify: 2(x + 3)",
        options: ["2x + 6", "2x + 3", "x + 6", "2x + 9"],
        correctOption: 0,
      },
      {
        questionText: "What is the square root of 49?",
        options: ["6", "7", "8", "9"],
        correctOption: 1,
      },
      {
        questionText: "If a = 3 and b = 4, what is a² + b²?",
        options: ["12", "18", "25", "49"],
        correctOption: 2,
      },
      {
        questionText: "What is 100 divided by 4?",
        options: ["20", "25", "30", "40"],
        correctOption: 1,
      },
      {
        questionText: "Find the value of x: 3x = 15",
        options: ["3", "4", "5", "6"],
        correctOption: 2,
      },
      {
        questionText: "What is 10% of 200?",
        options: ["10", "15", "20", "25"],
        correctOption: 2,
      },
      {
        questionText: "What is the area of a rectangle with length 5 and width 3?",
        options: ["15", "8", "10", "18"],
        correctOption: 0,
      },
    ],
  },

  // Science Quiz
  {
    title: "Basic Science Quiz",
    category: "Science",
    difficulty: "easy",
    questions: [
      {
        questionText: "What planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        correctOption: 1,
      },
      {
        questionText: "What is H2O commonly known as?",
        options: ["Salt", "Hydrogen", "Water", "Oxygen"],
        correctOption: 2,
      },
      {
        questionText: "Which organ pumps blood through the body?",
        options: ["Lungs", "Liver", "Heart", "Brain"],
        correctOption: 2,
      },
      {
        questionText: "How many legs does an insect have?",
        options: ["4", "6", "8", "10"],
        correctOption: 1,
      },
      {
        questionText: "What gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctOption: 1,
      },
    ],
  },

  // Web Development Quiz
  {
    title: "Intro to Web Development",
    category: "Web Development",
    difficulty: "medium",
    questions: [
      {
        questionText: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language",
          "None of the above",
        ],
        correctOption: 0,
      },
      {
        questionText: "What is the correct HTML tag for the largest heading?",
        options: ["<head>", "<h6>", "<h1>", "<heading>"],
        correctOption: 2,
      },
      {
        questionText: "Which property is used to change the background color in CSS?",
        options: ["color", "background-color", "bgColor", "background"],
        correctOption: 1,
      },
      {
        questionText: "Inside which HTML element do we put the JavaScript?",
        options: ["<js>", "<javascript>", "<script>", "<code>"],
        correctOption: 2,
      },
      {
        questionText: "Which of the following is a JavaScript framework?",
        options: ["Laravel", "React", "Django", "Flask"],
        correctOption: 1,
      },
    ],
  },
];


// 👇 This function uploads the quiz to Firestore
export const uploadQuiz = async () => {
  try {
    // 'quizzes' is your collection name, 'algebra-basic' is the document ID
    const quizRef = doc(collection(db, "quizzes"), "algebra-basic");
    await setDoc(quizRef, quizData);
    console.log("✅ Quiz uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading quiz:", error);
  }
};



// export const uploadQuiz = async () => {
//   try {
//     for (const quiz of quizData) {
//       const docId = quiz.title.toLowerCase().replace(/\s+/g, "-"); // e.g., basic-algebra-quiz
//       const quizRef = doc(db, "quizzes", docId);
//       await setDoc(quizRef, quiz); // ✅ each quiz is an object
//       console.log(`✅ Uploaded quiz: ${quiz.title}`);
//     }
//   } catch (error) {
//     console.error("❌ Error uploading quiz:", error);
//   }
// };
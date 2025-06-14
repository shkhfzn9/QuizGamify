/**
 * Dashboard Component - Main Home Page After Login
 *
 * This is the central hub where users see their progress and available quizzes.
 * Think of it like the main menu of a video game - it shows your stats, achievements,
 * and what you can do next.
 *
 * Features:
 * - Displays user's level, XP (experience points), and badges
 * - Shows recommended quizzes (first 3)
 * - Lists all available quizzes
 * - Allows navigation to individual quizzes
 */

// Import React hooks for state management and side effects
import { useEffect, useState } from "react";
// Import Firebase Firestore functions for database operations
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// Import our Firebase configuration
import { db, auth } from "../firebaseConfig";
// Import Firebase auth function to monitor login status
import { onAuthStateChanged } from "firebase/auth";
// Import React Router hook for navigation
import { useNavigate } from "react-router-dom";

/**
 * Dashboard Component Function
 *
 * This component manages and displays the user's dashboard with their progress
 * and available quizzes. It fetches data from Firebase and renders different sections.
 */
const Dashboard = () => {
  // STATE VARIABLES - Data that can change and trigger re-renders

  // Array of all quiz objects loaded from the database
  // Each quiz has id, title, category, difficulty, and questions
  const [quizzes, setQuizzes] = useState([]);

  // Object containing user's progress data (level, XP, badges)
  // null initially until we load it from the database
  const [userData, setUserData] = useState(null);

  // Boolean flag indicating if we're still loading data from Firebase
  // Prevents showing incomplete data while fetching
  const [loading, setLoading] = useState(true);

  // Hook for programmatically navigating to different pages
  const navigate = useNavigate();

  /**
   * Fetch User Progress Data
   *
   * This function retrieves the current user's progress from the database.
   * It gets their level, XP points, and earned badges to display on the dashboard.
   *
   * Think of this like checking your player profile in a game to see your current stats.
   *
   * Parameters:
   * - uid: The user's unique identifier (like a player ID)
   */
  const fetchUserData = async (uid) => {
    // Try-catch for error handling - attempt the operation but handle any problems
    try {
      // Create a reference to the user's document in the "users" collection
      // This is like saying "go to the users folder and find the file with this ID"
      const userDoc = await getDoc(doc(db, "users", uid));

      // Check if the document actually exists in the database
      if (userDoc.exists()) {
        // Extract the data from the document and update our state
        // .data() gets the actual content (level, XP, badges, etc.)
        setUserData(userDoc.data());
      }
    } catch (error) {
      // If something goes wrong, log the error for debugging
      // This helps developers identify problems but doesn't crash the app
      console.error("Error fetching user data:", error);
    }
  };

  /**
   * Fetch All Available Quizzes
   *
   * This function retrieves all quizzes from the database so users can see
   * what's available to play. It's like getting a list of all games in an arcade.
   *
   * The function transforms the raw database documents into JavaScript objects
   * that are easier to work with in our React component.
   */
  const fetchQuizzes = async () => {
    // Try-catch for error handling
    try {
      // Get all documents from the "quizzes" collection
      // collection() creates a reference to the entire quizzes folder
      // getDocs() actually fetches all the documents in that collection
      const querySnapshot = await getDocs(collection(db, "quizzes"));

      // Transform the raw Firebase documents into usable JavaScript objects
      // querySnapshot.docs is an array of document snapshots
      const data = querySnapshot.docs.map((doc) => ({
        // Each quiz object will have:
        id: doc.id, // The document's unique ID
        ...doc.data(), // All the quiz data (title, questions, etc.)
      }));
      // The spread operator (...) takes all properties from doc.data() and includes them
      // This is like copying all the contents of one box into another

      // Update our state with the processed quiz data
      setQuizzes(data);
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      console.error("Error fetching quizzes:", error);
    }
  };

  /**
   * useEffect Hook - Initialize Dashboard Data
   *
   * This runs when the component first loads and sets up a listener for authentication changes.
   * It's like having a security guard who checks if someone is logged in and then loads their
   * personal dashboard data.
   *
   * How it works:
   * 1. Sets up a listener for authentication state changes
   * 2. When a user is detected, fetches both user data and quizzes simultaneously
   * 3. Updates the loading state when everything is done
   */
  useEffect(() => {
    // Set up authentication state listener
    // This function runs whenever someone logs in, logs out, or when the page loads
    onAuthStateChanged(auth, async (user) => {
      // Check if there's a logged-in user
      if (user) {
        // Use Promise.all to fetch user data and quizzes at the same time
        // This is more efficient than waiting for one, then starting the other
        // Think of it like sending two people to get different things simultaneously
        // instead of sending one person to get both things sequentially
        await Promise.all([fetchUserData(user.uid), fetchQuizzes()]);
      }

      // We're done loading, whether user was found or not
      // This allows the component to render (either with data or empty state)
      setLoading(false);
    });
  }, []); // Empty dependency array means this only runs once when component mounts

  /**
   * Loading State Check
   *
   * While we're fetching data from Firebase, show a loading message instead of
   * trying to render incomplete data. This prevents errors and improves user experience.
   *
   * Think of this like a "please wait" sign while a store is getting ready to open.
   */
  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  /**
   * Render Dashboard UI
   *
   * This creates the visual dashboard that users see after logging in.
   * It displays user progress, achievements, and available quizzes in organized sections.
   * The layout is like a game menu with different cards showing different information.
   */
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome {userData?.displayName || "Student"} 🎓</h1>

      <div
        style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px" }}
      >
        <h3>Level: {userData?.level || 1}</h3>
        <p>XP: {userData?.xp || 0}</p>
      </div>

      <div
        style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px" }}
      >
        {/* Optional chaining (?.) safely accesses nested properties */}
        {/* If userData exists, try to access badges array, then get its length */}
        {/* The || 0 provides a fallback value if the result is null/undefined */}
        <h3>Badges Earned: {userData?.badges?.length || 0}</h3>

        {/* join(", ") converts an array into a string with commas between items */}
        {/* Example: ["Beginner", "Expert"] becomes "Beginner, Expert" */}
        <p>Badges: {userData?.badges?.join(", ") || "No badges yet"}</p>
      </div>

      {/* Quiz Suggestions Section - Shows only the first 3 quizzes */}
      <div style={{ marginTop: "20px" }}>
        <h2>Quiz Suggestions 🔥</h2>

        {/* Array.slice(0, 3) creates a new array with only the first 3 items */}
        {/* slice(startIndex, endIndex) - starts at 0, stops before index 3 */}
        {/* This gives us items at positions 0, 1, and 2 (first 3 items) */}
        {quizzes.slice(0, 3).map((quiz) => (
          <div
            /* The key prop helps React identify which items have changed */
            /* React uses keys to efficiently update the DOM when the list changes */
            /* Always use a unique identifier like quiz.id, never use array index */
            key={quiz.id}
            style={{
              /* Inline styles are objects with CSS properties in camelCase */
              /* marginBottom becomes margin-bottom in actual CSS */
              marginBottom: "10px" /* Space between quiz cards */,
              padding: "10px" /* Inner spacing within each card */,
              border: "1px solid #eee" /* Light gray border around each card */,
            }}
          >
            {/* Display quiz information by accessing object properties */}
            <h3>{quiz.title}</h3>
            <p>Category: {quiz.category}</p>
            <p>Difficulty: {quiz.difficulty}</p>

            {/* Event handler function - called when button is clicked */}
            {/* Arrow function () => allows us to pass parameters to navigate */}
            {/* Template literal `${quiz.id}` inserts the quiz ID into the URL */}
            <button onClick={() => navigate(`/quiz/${quiz.id}`)}>
              Start Quiz
            </button>
          </div>
        ))}
      </div>

      {/* All Quizzes Section - Shows every quiz in the array */}
      <div style={{ marginTop: "40px" }}>
        <h2>All Available Quizzes 📚</h2>

        {/* Array.map() transforms each quiz object into a JSX element */}
        {/* map() calls the function for every item in the array */}
        {/* It returns a new array of JSX elements that React can render */}
        {quizzes.map((quiz) => (
          <div
            /* Each rendered item in a list needs a unique key prop */
            /* This helps React track changes and update efficiently */
            key={quiz.id}
            style={{
              /* Inline styles applied to each quiz card */
              marginBottom: "10px" /* Vertical space between cards */,
              padding: "10px" /* Internal spacing inside each card */,
              border:
                "1px solid #eee" /* Subtle border for visual separation */,
            }}
          >
            {/* Display quiz properties - title, category, difficulty */}
            <h3>{quiz.title}</h3>
            <p>Category: {quiz.category}</p>
            <p>Difficulty: {quiz.difficulty}</p>

            {/* Optional chaining to safely access nested array length */}
            {/* quiz.questions?.length means: if quiz.questions exists, get its length */}
            {/* || 0 provides fallback if questions array doesn't exist */}
            <p>Total Questions: {quiz.questions?.length || 0}</p>

            {/* Click handler for navigation - programmatic routing */}
            {/* navigate() function comes from useNavigate hook (React Router) */}
            {/* Template literal creates URL like "/quiz/123" where 123 is quiz.id */}
            <button onClick={() => navigate(`/quiz/${quiz.id}`)}>
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

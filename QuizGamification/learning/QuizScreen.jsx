// Import React and hooks we need for managing component state and side effects
import React, { useEffect, useState } from "react";
// Import Firebase Firestore functions for database operations
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
// Import our Firebase configuration (database and authentication)
import { db, auth } from "../../firebaseConfig";
// Import Firebase auth function to monitor authentication state changes
import { onAuthStateChanged } from "firebase/auth";
// Import React Router hook for programmatic navigation
import { useNavigate } from "react-router-dom";

/**
 * QuizScreen Component
 *
 * This is the main quiz-taking interface where users answer questions.
 * It handles the entire quiz experience including:
 * - Loading quiz data from the database
 * - Managing the timer for each question
 * - Tracking user's score and progress
 * - Updating user's XP and achievements when quiz is completed
 *
 * Props:
 * - quizId: The unique identifier of the quiz to display
 */
const QuizScreen = ({ quizId }) => {
  // STATE VARIABLES - These store data that can change during the quiz

  // Stores the complete quiz data (title, questions, etc.) from the database
  const [quiz, setQuiz] = useState(null);

  // Tracks which question we're currently showing (starts at 0 for first question)
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Stores which answer option the user clicked (null means no option selected yet)
  const [selectedOption, setSelectedOption] = useState(null);

  // Boolean flag - true when we're showing the correct/incorrect answer feedback
  const [showAnswer, setShowAnswer] = useState(false);

  // Tracks how many questions the user answered correctly
  const [score, setScore] = useState(0);

  // Countdown timer for each question (starts at 30 seconds)
  const [timeLeft, setTimeLeft] = useState(30);

  // Boolean flag - true when all questions are completed
  const [quizFinished, setQuizFinished] = useState(false);

  // Stores the current user's unique ID from Firebase Authentication
  const [userId, setUserId] = useState(null);

  // Hook for programmatically navigating to different pages
  const navigate = useNavigate();

  // ============================================================================
  // USEEFFECT HOOK #1: Monitor User Authentication Status
  // ============================================================================
  //
  // WHAT IS useEffect?
  // - useEffect is a React "hook" (special function) that lets us run code at specific times
  // - Think of it like an event listener that watches for changes and reacts to them
  // - It's called a "side effect" because it does something outside of just displaying the UI
  //
  // WHEN DOES THIS useEffect RUN?
  // - This runs ONCE when the component first loads (because of the empty [] at the end)
  // - It sets up a "listener" that continuously watches if the user logs in or out
  //
  // WHY DO WE NEED THIS?
  // - We need to know WHO is taking the quiz so we can save their progress and XP
  // - Firebase handles user login/logout, and we need to stay updated about the user's status
  //
  useEffect(() => {
    // WHAT IS onAuthStateChanged?
    // - This is a Firebase function that "listens" for authentication changes
    // - Whenever a user logs in, logs out, or their login expires, this function runs
    // - Think of it like a security guard that tells us "someone new just walked in" or "someone just left"

    // WHAT IS unsubscribe?
    // - onAuthStateChanged returns a function that we can call to "stop listening"
    // - We store this function in a variable called "unsubscribe"
    // - It's like having a remote control to turn off the security guard when we don't need them anymore
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // This function runs every time the user's login status changes

      // WHAT IS THE 'if' STATEMENT DOING?
      // - We check if 'user' exists (meaning someone is logged in)
      // - If user exists, we save their unique ID (called 'uid') to our state
      // - If user is null/undefined (nobody logged in), we don't do anything
      if (user) {
        // WHAT IS user.uid?
        // - Every user in Firebase gets a unique identifier (like a social security number)
        // - 'uid' stands for "User Identifier" - it's a long random string like "abc123def456"
        // - We need this ID to save the user's quiz results and XP to the database
        setUserId(user.uid);
      }
    });

    // WHAT IS THE RETURN STATEMENT?
    // - useEffect can return a "cleanup function" that runs when the component is destroyed
    // - Think of it like cleaning up your room before moving out
    // - We call unsubscribe() to stop listening for auth changes (prevents memory leaks)
    // - This is important because if we don't clean up, the listener keeps running even after we leave this page
    return () => unsubscribe();
  }, []); // WHAT DOES THE EMPTY [] MEAN?
  // - This is called the "dependency array"
  // - Empty [] means "only run this effect once when the component first loads"
  // - If we put variables inside [], the effect would run again whenever those variables change

  // ============================================================================
  // USEEFFECT HOOK #2: Load Quiz Data from Firebase Database
  // ============================================================================
  //
  // WHAT DOES THIS useEffect DO?
  // - This fetches (downloads) the quiz questions and data from Firebase
  // - It's like going to a library and getting a specific book by its ID number
  //
  // WHEN DOES THIS useEffect RUN?
  // - It runs when the component first loads
  // - It also runs again if the quizId changes (that's what [quizId] means at the bottom)
  //
  // WHY DO WE NEED THIS?
  // - We need the quiz questions, options, and correct answers to display the quiz
  // - All this data is stored in Firebase, so we need to fetch it before we can show anything
  //
  useEffect(() => {
    // WHAT IS AN ASYNC FUNCTION?
    // - "async" means "asynchronous" - the function can wait for slow operations (like database calls)
    // - Think of it like ordering food at a restaurant - you place your order and wait for it to be ready
    // - While waiting, you don't freeze up; you can still talk and do other things
    // - Database operations take time (maybe 1-2 seconds), so we use async/await to handle the waiting

    const fetchQuiz = async () => {
      // WHAT IS A TRY/CATCH BLOCK?
      // - "try" means "attempt to do this code, but be ready for errors"
      // - "catch" means "if something goes wrong, handle the error gracefully"
      // - Think of it like trying to catch a ball - you try to catch it, but if you miss, you handle it
      // - This prevents the app from crashing if the database is down or the quiz doesn't exist

      try {
        // STEP 1: Create a reference to the specific quiz document
        // WHAT IS doc()?
        // - doc() creates a "reference" or "pointer" to a specific document in Firebase
        // - Think of it like writing an address on an envelope
        // - Parameters: doc(database, collection_name, document_id)
        // - "db" is our Firebase database connection
        // - "quizzes" is the collection (like a folder) where all quizzes are stored
        // - "quizId" is the unique ID of the specific quiz we want
        const quizRef = doc(db, "quizzes", quizId);

        // STEP 2: Actually fetch the document from Firebase
        // WHAT IS await?
        // - "await" means "wait for this operation to complete before continuing"
        // - getDoc() goes to Firebase and downloads the quiz data
        // - This might take 1-2 seconds, so we wait for it to finish
        // - Without "await", the code would continue immediately and quizSnap would be empty
        const quizSnap = await getDoc(quizRef);

        // STEP 3: Check if the quiz actually exists
        // WHAT IS quizSnap.exists()?
        // - Sometimes we ask for a quiz that doesn't exist (wrong ID, deleted quiz, etc.)
        // - exists() returns true if the document was found, false if it wasn't
        // - It's like checking if the book you asked for is actually on the library shelf
        if (quizSnap.exists()) {
          // STEP 4: Extract the data and save it to our state
          // WHAT IS quizSnap.data()?
          // - The document snapshot contains metadata AND the actual data
          // - .data() extracts just the useful content (quiz title, questions, etc.)
          // - setQuiz() saves this data to our component's state so we can use it in the UI
          setQuiz(quizSnap.data());
        } else {
          // WHAT HAPPENS IF THE QUIZ DOESN'T EXIST?
          // - We log an error message to help developers debug the problem
          // - The user will see "Loading Quiz..." forever (not ideal, but prevents crashes)
          // - In a real app, we might show a "Quiz not found" message to the user
          console.error("Quiz not found:", quizId);
        }
      } catch (err) {
        // WHAT IS THE CATCH BLOCK FOR?
        // - If ANYTHING goes wrong in the try block, this code runs
        // - Examples: no internet connection, Firebase is down, permission denied
        // - We log the error so developers can see what went wrong
        // - The app continues running instead of crashing
        console.error("Error fetching quiz:", err);
      }
    };

    // ACTUALLY CALL THE FUNCTION
    // We defined the fetchQuiz function above, but we need to actually call it
    // Think of it like writing a recipe (defining the function) vs actually cooking (calling the function)
    fetchQuiz();
  }, [quizId]); // WHAT DOES [quizId] MEAN?
  // - This is the "dependency array" - it tells React when to re-run this effect
  // - Whenever quizId changes, this effect will run again
  // - This is important because if we navigate to a different quiz, we need to load new data
  // - If quizId stays the same, this effect won't run again (efficiency)

  // ============================================================================
  // USEEFFECT HOOK #3: Timer Logic for Quiz Questions
  // ============================================================================
  //
  // WHAT DOES THIS useEffect DO?
  // - This creates a countdown timer for each quiz question (30 seconds per question)
  // - It automatically moves to the next question when time runs out
  // - It stops the timer when the quiz is finished
  //
  // WHEN DOES THIS useEffect RUN?
  // - It runs every time 'timeLeft' or 'quizFinished' changes
  // - So it runs every second as the timer counts down
  // - It also runs when we move to a new question (timeLeft resets to 30)
  //
  // WHY DO WE NEED THIS?
  // - We want to add time pressure to make the quiz more challenging
  // - We need to automatically advance if the user doesn't answer in time
  // - We need to display a live countdown to the user
  //
  useEffect(() => {
    // EARLY RETURN #1: Stop timer if quiz is over
    // WHAT IS AN EARLY RETURN?
    // - Sometimes we want to exit a function early based on a condition
    // - If quizFinished is true, we don't want the timer to keep running
    // - "return" immediately exits the function without running the rest of the code
    if (quizFinished) return;

    // EARLY RETURN #2: Move to next question if time is up
    // WHAT HAPPENS WHEN timeLeft REACHES 0?
    // - We call handleNext() to move to the next question
    // - Then we return early to avoid setting up a new timer
    // - This simulates the user clicking "Next" when time runs out
    if (timeLeft === 0) {
      handleNext();
      return;
    }

    // SET UP THE TIMER
    // WHAT IS setInterval()?
    // - setInterval() runs a function repeatedly at regular intervals
    // - Think of it like a metronome that ticks every second
    // - First parameter: the function to run every interval
    // - Second parameter: how often to run it (1000 milliseconds = 1 second)
    const timerId = setInterval(() => {
      // WHAT DOES THIS ARROW FUNCTION DO?
      // - Arrow functions are a shorter way to write functions
      // - () => { ... } is the same as function() { ... }
      // - This function runs every second to decrease the timer

      // WHAT IS setTimeLeft((t) => Math.max(t - 1, 0))?
      // - This is called a "state updater function"
      // - Instead of setTimeLeft(timeLeft - 1), we use a function
      // - The function receives the current value 't' and returns the new value
      // - Math.max(t - 1, 0) means "subtract 1, but never go below 0"
      // - Examples: Math.max(5 - 1, 0) = 4, Math.max(1 - 1, 0) = 0, Math.max(0 - 1, 0) = 0
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);

    // CLEANUP FUNCTION
    // WHAT IS THE RETURN STATEMENT DOING?
    // - Every time this useEffect runs, it creates a new timer
    // - But we need to clean up the old timer first, or we'd have multiple timers running!
    // - clearInterval() stops the timer from running
    // - This cleanup function runs automatically before the next useEffect run
    // - Think of it like turning off the old alarm clock before setting a new one
    return () => clearInterval(timerId);
  }, [timeLeft, quizFinished]); // WHAT DOES [timeLeft, quizFinished] MEAN?
  // - This effect runs whenever timeLeft OR quizFinished changes
  // - timeLeft changes every second (30, 29, 28, 27...)
  // - quizFinished changes when the quiz ends
  // - This is why the timer updates in real-time

  // ============================================================================
  // EVENT HANDLER FUNCTION: Handle User Clicking an Answer Option
  // ============================================================================
  //
  // WHAT IS AN EVENT HANDLER?
  // - An event handler is a function that runs when something happens (like a click)
  // - Think of it like a doorbell - when someone presses it, it triggers an action
  // - In this case, when a user clicks an answer button, this function runs
  //
  // WHAT DOES THIS FUNCTION DO?
  // - Records which answer the user clicked
  // - Checks if the answer is correct and updates the score
  // - Shows the correct/incorrect answer feedback with colors
  // - Prevents the user from clicking again after they've already answered
  //
  // WHAT IS THE 'index' PARAMETER?
  // - When we call this function, we pass it a number (0, 1, 2, or 3)
  // - This number represents which answer option the user clicked
  // - For example: if there are 4 options A, B, C, D, they have indexes 0, 1, 2, 3
  //
  const handleOptionClick = (index) => {
    // PREVENT MULTIPLE CLICKS
    // WHAT IS showAnswer?
    // - showAnswer is a boolean (true/false) that tracks if we're showing the answer feedback
    // - If it's true, it means the user already clicked and we're showing green/red colors
    // - We don't want them to click again and change their answer
    // - This is like saying "no take-backs!" after someone makes their choice
    if (showAnswer) return;

    // RECORD THE USER'S CHOICE
    // WHAT IS setSelectedOption(index)?
    // - We save which option the user clicked (0, 1, 2, or 3) to our state
    // - This lets us highlight their choice in red if it's wrong
    // - We need to remember their choice so we can show it to them
    setSelectedOption(index);

    // SHOW THE ANSWER FEEDBACK
    // WHAT IS setShowAnswer(true)?
    // - This changes showAnswer from false to true
    // - This triggers the UI to show colors: green for correct, red for wrong
    // - It also makes the "Next Question" button appear
    // - Think of it like flipping a switch to turn on the answer reveal
    setShowAnswer(true);

    // CHECK IF THE ANSWER IS CORRECT
    // WHAT IS correctIndex?
    // - Every quiz question has a "correctOption" property that tells us the right answer
    // - For example, if the correct answer is option B, correctIndex would be 1
    // - quiz.questions[currentQuestion] gets the current question object
    // - .correctOption gets the index of the correct answer from that question
    const correctIndex = quiz.questions[currentQuestion].correctOption;

    // UPDATE SCORE IF CORRECT
    // WHAT IS THE if STATEMENT DOING?
    // - We compare the user's choice (index) with the correct answer (correctIndex)
    // - If they match, the user got it right!
    // - === means "exactly equal to" (stricter than ==)
    if (index === correctIndex) {
      // WHAT IS setScore((s) => s + 1)?
      // - This is another "state updater function" like we saw with the timer
      // - 's' represents the current score value
      // - s + 1 means "add 1 to the current score"
      // - We use this pattern instead of setScore(score + 1) to avoid stale state issues
      // - Think of it like telling React "whatever the score is now, add 1 to it"
      setScore((s) => s + 1);
    }
    // NOTE: If the answer is wrong, we don't do anything to the score (it stays the same)
  };

  // ============================================================================
  // EVENT HANDLER FUNCTION: Handle Moving to Next Question
  // ============================================================================
  //
  // WHAT DOES THIS FUNCTION DO?
  // - Resets the UI for the next question
  // - Moves to the next question OR finishes the quiz if we're at the end
  // - Gets called when user clicks "Next Question" OR when timer runs out
  //
  // WHY IS THIS A SEPARATE FUNCTION?
  // - We need this logic in two places: when user clicks Next AND when timer expires
  // - Instead of duplicating code, we put it in one function and call it from both places
  // - This is called "DRY" - Don't Repeat Yourself
  //
  const handleNext = () => {
    // RESET THE UI FOR THE NEXT QUESTION
    // WHAT ARE WE RESETTING?
    // - We need to clear the previous question's state before showing the next one
    // - Think of it like clearing a whiteboard before writing new content

    // HIDE THE ANSWER FEEDBACK
    // WHAT IS setShowAnswer(false)?
    // - This turns off the green/red color highlighting from the previous question
    // - The next question should start with no colors showing
    setShowAnswer(false);

    // CLEAR THE SELECTED OPTION
    // WHAT IS setSelectedOption(null)?
    // - This forgets which option the user clicked on the previous question
    // - null means "no option selected" (fresh start for the new question)
    setSelectedOption(null);

    // RESET THE TIMER
    // WHAT IS setTimeLeft(30)?
    // - This gives the user a fresh 30 seconds for the next question
    // - Each question gets the same amount of time
    setTimeLeft(30);

    // MOVE TO NEXT QUESTION OR FINISH QUIZ
    // WHAT IS THIS if/else DOING?
    // - We need to check if there are more questions left
    // - If yes, move to the next question
    // - If no, finish the quiz

    // CHECK IF THERE ARE MORE QUESTIONS
    // WHAT IS currentQuestion + 1 < quiz.questions.length?
    // - currentQuestion is the index of the current question (starts at 0)
    // - quiz.questions.length is the total number of questions
    // - Example: if there are 5 questions (length = 5), the indexes are 0, 1, 2, 3, 4
    // - If currentQuestion = 3, then 3 + 1 = 4, and 4 < 5, so there's one more question
    // - If currentQuestion = 4, then 4 + 1 = 5, and 5 < 5 is false, so we're done
    if (currentQuestion + 1 < quiz.questions.length) {
      // MOVE TO THE NEXT QUESTION
      // WHAT IS setCurrentQuestion((q) => q + 1)?
      // - Another state updater function!
      // - 'q' represents the current question index
      // - q + 1 moves us to the next question
      // - Example: if we're on question 0, this makes it question 1
      setCurrentQuestion((q) => q + 1);
    } else {
      // NO MORE QUESTIONS - FINISH THE QUIZ
      // WHAT IS setQuizFinished(true)?
      // - This tells our component that the quiz is over
      // - This will hide the quiz questions and show the final score screen
      // - It also stops the timer (remember the useEffect that checks quizFinished?)
      setQuizFinished(true);
    }
  };

  // ============================================================================
  // ASYNC EVENT HANDLER FUNCTION: Handle Quiz Completion & Save Results
  // ============================================================================
  //
  // WHAT DOES THIS FUNCTION DO?
  // - Calculates XP earned based on the user's score
  // - Updates the user's total XP, level, and badges in the database
  // - Awards special badges (like "Perfect Score") if earned
  // - Navigates back to the home screen
  //
  // WHY IS THIS FUNCTION ASYNC?
  // - We need to read from and write to the Firebase database
  // - Database operations take time (network requests), so we use async/await
  // - We must wait for the database operations to complete before navigating away
  //
  // WHEN IS THIS FUNCTION CALLED?
  // - When the user clicks "Go Back to Dashboard" after finishing the quiz
  //
  const handleFinish = async () => {
    // SAFETY CHECK: Make sure we have required data
    // WHAT IS !userId || !quiz?
    // - The ! symbol means "NOT" - so !userId means "if userId is NOT available"
    // - || means "OR" - so this checks if EITHER userId OR quiz is missing
    // - We need both pieces of data to save the results properly
    // - If either is missing, we skip saving and just go home
    if (!userId || !quiz) {
      console.warn("No user or quiz, skipping update");
      return navigate("/"); // Navigate home without saving
    }

    // GET THE USER'S CURRENT DATA FROM DATABASE
    // WHAT IS doc(db, "users", userId)?
    // - Creates a reference to the user's document in the "users" collection
    // - Think of it like looking up someone's file in a filing cabinet
    // - userId is the unique identifier we got from Firebase Authentication
    const userRef = doc(db, "users", userId);

    // WHAT IS await getDoc(userRef)?
    // - Downloads the user's current data from Firebase
    // - We need their current XP and badges so we can add to them
    // - await means "wait for this to complete before continuing"
    const userSnap = await getDoc(userRef);

    // ========================================================================
    // CALCULATE NEW XP, LEVEL, AND BADGES
    // ========================================================================

    // CALCULATE XP EARNED
    // WHAT IS score * 100?
    // - Each correct answer is worth 100 XP
    // - If user got 3 out of 5 questions right, they earn 3 * 100 = 300 XP
    // - This gives users a sense of progression and achievement
    const xpEarned = score * 100;

    // CALCULATE NEW TOTAL XP
    // WHAT IS (userSnap.data()?.xp || 0) + xpEarned?
    // - userSnap.data() gets the user's current data from the database
    // - The ? is called "optional chaining" - it safely accesses properties
    // - If the user document doesn't exist, userSnap.data() would be undefined
    // - The ?. means "if the left side exists, get the property, otherwise return undefined"
    // - || 0 means "if the result is undefined/null, use 0 instead"
    // - So this gets the user's current XP (or 0 if they're new) and adds the earned XP
    const newTotalXP = (userSnap.data()?.xp || 0) + xpEarned;

    // CALCULATE NEW LEVEL
    // WHAT IS Math.floor(newTotalXP / 500) + 1?
    // - We want users to level up every 500 XP
    // - Math.floor() rounds down to the nearest whole number
    // - Examples: Math.floor(499 / 500) = 0, Math.floor(500 / 500) = 1, Math.floor(1200 / 500) = 2
    // - We add 1 because levels start at 1, not 0 (level 1, level 2, etc.)
    const newLevel = Math.floor(newTotalXP / 500) + 1;

    // CALCULATE NEW BADGES
    // WHAT IS [...(userSnap.data()?.badges || [])]?
    // - This is called the "spread operator" (...)
    // - It creates a copy of an array instead of modifying the original
    // - userSnap.data()?.badges gets the user's current badges (if any)
    // - || [] means "if badges is undefined, use an empty array instead"
    // - [...currentBadges] creates a new array with all the existing badges
    // - Think of it like making a photocopy of a list so you can add items without changing the original
    const newBadges = [...(userSnap.data()?.badges || [])];

    // CHECK IF USER EARNED "PERFECT SCORE" BADGE
    // WHAT IS THIS if STATEMENT CHECKING?
    // - score === quiz.questions.length checks if user got ALL questions right
    // - !newBadges.includes("Perfect Score") checks if they DON'T already have this badge
    // - && means "AND" - both conditions must be true
    // - We only want to award the badge once, not every time they get a perfect score
    if (
      score === quiz.questions.length &&
      !newBadges.includes("Perfect Score")
    ) {
      // WHAT IS newBadges.push("Perfect Score")?
      // - push() adds a new item to the end of an array
      // - This adds the "Perfect Score" badge to their collection
      // - In a real app, we might have many different badges to earn
      newBadges.push("Perfect Score");
    }

    // LOG THE CHANGES FOR DEBUGGING
    // WHAT IS console.log()?
    // - This prints information to the browser's developer console
    // - It helps developers see what's happening and debug issues
    // - In production, we might remove these logs
    console.log({
      before: userSnap.exists() ? userSnap.data() : "(no doc)",
      xpEarned,
      newTotalXP,
      newLevel,
      newBadges,
    });

    // ========================================================================
    // SAVE THE NEW DATA TO FIREBASE
    // ========================================================================

    // CHECK IF USER DOCUMENT EXISTS
    // WHAT IS userSnap.exists()?
    // - When we try to get a document that doesn't exist, Firebase returns a snapshot
    // - exists() tells us if the document was actually found
    // - New users might not have a document yet, so we need to create one
    if (!userSnap.exists()) {
      // CREATE A NEW USER DOCUMENT
      // WHAT IS await setDoc(userRef, {...})?
      // - setDoc() creates a brand new document in Firebase
      // - We use this for users who are taking their first quiz
      // - The second parameter is an object with all the data to save
      // - await means "wait for this database write to complete"
      await setDoc(userRef, {
        xp: newTotalXP,
        level: newLevel,
        badges: newBadges,
      });
    } else {
      // UPDATE THE EXISTING USER DOCUMENT
      // WHAT IS await updateDoc(userRef, {...})?
      // - updateDoc() modifies an existing document in Firebase
      // - We use this for users who already have a profile
      // - It only updates the fields we specify, leaving other fields unchanged
      // - await means "wait for this database write to complete"
      await updateDoc(userRef, {
        xp: newTotalXP,
        level: newLevel,
        badges: newBadges,
      });
    }

    // NAVIGATE BACK TO HOME SCREEN
    // WHAT IS navigate("/")?
    // - This uses React Router to programmatically change the URL
    // - "/" refers to the home/dashboard page
    // - We only do this AFTER the database write completes (because of await above)
    // - This ensures the user's progress is saved before they leave the quiz screen
    navigate("/");
  };

  // ============================================================================
  // CONDITIONAL RENDERING: What to Show Based on App State
  // ============================================================================
  //
  // WHAT IS CONDITIONAL RENDERING?
  // - React components can show different content based on conditions
  // - Think of it like choosing what to wear based on the weather
  // - We use if statements and return statements to control what the user sees
  //

  // LOADING STATE: Show loading message while quiz data is being fetched
  // WHAT IS !quiz?
  // - The ! means "NOT" - so !quiz means "if quiz is NOT available"
  // - When the component first loads, quiz is null because we haven't fetched it yet
  // - This prevents errors from trying to display questions that don't exist yet
  // - The return statement immediately exits the function and shows the loading message
  if (!quiz) return <div>Loading Quiz…</div>;

  // QUIZ FINISHED STATE: Show final score and results
  // WHAT IS THE quizFinished CHECK?
  // - If quizFinished is true, we show the completion screen instead of questions
  // - This happens after the user answers all questions
  if (quizFinished) {
    return (
      <div style={{ padding: "20px" }}>
        {/* WHAT IS JSX? */}
        {/* - JSX looks like HTML but it's actually JavaScript */}
        {/* - React converts this into actual HTML elements */}
        {/* - We can embed JavaScript expressions using curly braces {} */}

        <h2>Quiz Finished 🎉</h2>

        {/* DISPLAY THE USER'S SCORE */}
        {/* WHAT IS {score} / {quiz.questions.length}? */}
        {/* - The curly braces {} let us put JavaScript variables into our HTML */}
        {/* - score is how many questions they got right */}
        {/* - quiz.questions.length is the total number of questions */}
        {/* - This shows something like "3 / 5" meaning 3 correct out of 5 total */}
        <p>
          Your Score: {score} / {quiz.questions.length}
        </p>

        {/* DISPLAY XP EARNED */}
        {/* WHAT IS {score * 100}? */}
        {/* - We calculate XP by multiplying correct answers by 100 */}
        {/* - The curly braces evaluate this math expression */}
        {/* - If score is 3, this shows "XP Earned: 300" */}
        <p>XP Earned: {score * 100}</p>

        {/* BUTTON TO GO HOME */}
        {/* WHAT IS onClick={handleFinish}? */}
        {/* - onClick is an event handler that runs when the button is clicked */}
        {/* - We pass our handleFinish function (without parentheses!) */}
        {/* - When clicked, it will save the user's progress and navigate home */}
        <button onClick={handleFinish}>Go Back to Dashboard</button>
      </div>
    );
  }

  // QUIZ ACTIVE STATE: Show current question and options
  // WHAT IS const question = quiz.questions[currentQuestion]?
  // - quiz.questions is an array of all the questions
  // - currentQuestion is the index (0, 1, 2, etc.) of which question we're showing
  // - This gets the specific question object we need to display
  // - For example, if currentQuestion is 1, this gets the second question
  const question = quiz.questions[currentQuestion];

  return (
    <div style={{ padding: "20px" }}>
      {/* QUIZ TITLE */}
      {/* WHAT IS {quiz.title}? */}
      {/* - This displays the name of the quiz (like "JavaScript Basics" or "Math Quiz") */}
      {/* - It comes from the quiz data we fetched from Firebase */}
      <h2>{quiz.title}</h2>

      {/* TIMER DISPLAY */}
      {/* WHAT IS Time Left: {timeLeft}s? */}
      {/* - timeLeft is our countdown timer state (starts at 30) */}
      {/* - This shows something like "Time Left: 25s" */}
      {/* - The 's' is just regular text for "seconds" */}
      <p>Time Left: {timeLeft}s</p>

      {/* QUESTION TEXT */}
      {/* WHAT IS Q{currentQuestion + 1}: {question.questionText}? */}
      {/* - currentQuestion + 1 shows the question number (we add 1 because arrays start at 0) */}
      {/* - question.questionText is the actual question from the database */}
      {/* - This shows something like "Q1: What is 2 + 2?" */}
      <h3>
        Q{currentQuestion + 1}: {question.questionText}
      </h3>

      {/* ANSWER OPTIONS */}
      <div>
        {/* WHAT IS question.options.map()? */}
        {/* - question.options is an array of possible answers like ["A", "B", "C", "D"] */}
        {/* - .map() is a JavaScript method that creates a new array by transforming each item */}
        {/* - Think of it like applying a function to every item in a list */}
        {/* - For each option, we create a button element */}
        {question.options.map((option, idx) => {
          // CREATE STYLING FOR EACH BUTTON
          // WHAT IS let style = {}?
          // - We start with an empty style object (no special styling)
          // - We'll modify this based on whether answers are being shown
          let style = {};

          // ADD COLORS WHEN SHOWING ANSWERS
          // WHAT IS THE showAnswer CHECK?
          // - showAnswer becomes true after the user clicks an option
          // - This is when we want to highlight correct/incorrect answers
          if (showAnswer) {
            // HIGHLIGHT THE CORRECT ANSWER IN GREEN
            // WHAT IS idx === question.correctOption?
            // - idx is the index of this option (0, 1, 2, 3)
            // - question.correctOption tells us which index is correct
            // - If they match, this is the right answer, so make it green
            if (idx === question.correctOption) {
              style = { backgroundColor: "green", color: "#fff" };
            }
            // HIGHLIGHT THE USER'S WRONG ANSWER IN RED
            // WHAT IS idx === selectedOption?
            // - selectedOption remembers which button the user clicked
            // - If this option matches what they clicked AND it's not the correct answer,
            //   then this is their wrong choice, so make it red
            else if (idx === selectedOption) {
              style = { backgroundColor: "red", color: "#fff" };
            }
          }

          // CREATE THE BUTTON ELEMENT
          return (
            <button
              // WHAT IS key={idx}?
              // - React needs a unique "key" for each item in a list
              // - This helps React keep track of which buttons are which
              // - We use the index (idx) as the key since it's unique for each option
              key={idx}
              // WHAT IS style={{ ...style, margin: "5px", padding: "10px" }}?
              // - This combines our dynamic style (colors) with fixed styles (spacing)
              // - ...style is the "spread operator" - it copies all properties from the style object
              // - Then we add margin and padding for consistent button sizing
              // - Think of it like "use whatever colors we decided on, plus always add spacing"
              style={{ ...style, margin: "5px", padding: "10px" }}
              // WHAT IS onClick={() => handleOptionClick(idx)}?
              // - This is an "arrow function" that calls handleOptionClick when clicked
              // - We wrap it in () => because we need to pass the idx parameter
              // - Without the arrow function, handleOptionClick would run immediately
              // - The idx tells our function which option was clicked (0, 1, 2, or 3)
              onClick={() => handleOptionClick(idx)}
            >
              {/* WHAT IS {option}? */}
              {/* - This displays the text of the answer choice */}
              {/* - For example, if option is "Paris", the button text will be "Paris" */}
              {option}
            </button>
          );
        })}
      </div>

      {/* NEXT QUESTION BUTTON (only show after answering) */}
      {/* WHAT IS {showAnswer && (...)? */}
      {/* - This is called "conditional rendering with logical AND" */}
      {/* - && means "if the left side is true, show the right side" */}
      {/* - So this button only appears after the user has clicked an answer */}
      {/* - Before they answer, showAnswer is false, so nothing is shown */}
      {showAnswer && (
        <button
          onClick={handleNext}
          style={{ marginTop: "20px", padding: "10px" }}
        >
          {/* DYNAMIC BUTTON TEXT */}
          {/* WHAT IS currentQuestion + 1 === quiz.questions.length ? "Finish Quiz" : "Next Question"? */}
          {/* - This is a "ternary operator" - a short way to write if/else */}
          {/* - condition ? valueIfTrue : valueIfFalse */}
          {/* - We check if this is the last question */}
          {/* - If yes, button says "Finish Quiz", if no, button says "Next Question" */}
          {/* - currentQuestion + 1 is the current question number (1, 2, 3...) */}
          {/* - quiz.questions.length is the total number of questions */}
          {currentQuestion + 1 === quiz.questions.length
            ? "Finish Quiz"
            : "Next Question"}
        </button>
      )}
    </div>
  );
};

export default QuizScreen;

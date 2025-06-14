/**
 * Login Component - User Authentication Form
 *
 * This component creates a login form where users can enter their email and password
 * to sign into the application. It handles form submission, communicates with Firebase
 * for authentication, and redirects users after successful login.
 *
 * Think of this like a digital doorman - it checks your credentials and either
 * lets you into the building (app) or tells you there's a problem.
 */

// Import React and the useState hook for managing component state
import React, { useState } from "react";
// Import Firebase function for signing in users with email and password
import { signInWithEmailAndPassword } from "firebase/auth";
// Import our Firebase authentication configuration
import { auth } from "../../firebaseConfig";
// Import React Router hook for programmatic navigation
import { useNavigate } from "react-router-dom";

/**
 * Login Component Function
 *
 * This is a functional component that renders a login form and handles user authentication.
 * It manages form state, handles form submission, and provides user feedback.
 */
const Login = () => {
  // STATE VARIABLES - Data that can change during user interaction

  // Stores the email address entered by the user
  // Initial value is empty string, updated when user types in email field
  const [email, setEmail] = useState("");

  // Stores the password entered by the user
  // Initial value is empty string, updated when user types in password field
  const [password, setPassword] = useState("");

  // Stores messages to display to the user (success or error messages)
  // Initial value is empty string, updated based on login attempt results
  const [message, setMessage] = useState("");

  // Hook for programmatically navigating to different pages after login
  const navigate = useNavigate();

  /**
   * Handle Login Form Submission
   *
   * This function runs when the user clicks the "Login" button or presses Enter.
   * It's an async function because it needs to wait for Firebase to check the credentials.
   *
   * Think of this like a security guard checking your ID card - it takes a moment
   * to verify your identity before deciding whether to let you in.
   *
   * Parameters:
   * - e: The form submission event object
   */
  const handleLogin = async (e) => {
    // Prevent the default form submission behavior
    // By default, forms reload the page when submitted - we don't want that in React
    // Think of this like telling the browser "I'll handle this myself, don't do your usual thing"
    e.preventDefault();

    // Try-catch block for error handling
    // "try" means "attempt to do this, but be ready if something goes wrong"
    // "catch" means "if something goes wrong, do this instead"
    try {
      // Attempt to sign in the user with Firebase
      // This is an async operation - it takes time to communicate with Firebase servers
      // It's like sending a letter and waiting for a response
      await signInWithEmailAndPassword(auth, email, password);

      // If we get here, login was successful
      // Display a success message to the user
      setMessage("✅ Logged in successfully!");

      // Redirect the user to the dashboard page
      // This is like opening the door after successful authentication
      navigate("/dashboard");
    } catch (error) {
      // If login fails, we end up here
      // Display the error message to help the user understand what went wrong
      // Template literal (backticks) allows us to insert the error message into our string
      setMessage(`❌ ${error.message}`);
    }
  };

  /**
   * Render the Login Form UI
   *
   * This creates the user interface that users see and interact with.
   * It includes form fields for email/password and handles user input.
   *
   * The form uses "controlled components" - React manages all the input values
   * instead of letting the browser handle them directly.
   */
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

// Export the Login component so it can be imported and used in other files
// "default" means this is the main component this file provides
export default Login;

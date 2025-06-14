/**
 * AuthContext.jsx - Authentication Context Provider
 * 
 * This file creates a "broadcasting system" for user authentication information.
 * Think of it like a radio station that broadcasts whether someone is logged in or not,
 * and all components in our app can "tune in" to listen to this information.
 * 
 * Why do we need this?
 * - Without this, every component would need to check individually if user is logged in
 * - This creates a single source of truth for authentication across the entire app
 * - It prevents "prop drilling" (passing user data through many component layers)
 */

// Import React and the hooks we need
import React, { createContext, useState, useEffect, useContext } from "react";
// Import Firebase function that monitors authentication state changes
import { onAuthStateChanged } from "firebase/auth";
// Import our Firebase authentication configuration
import { auth } from "../firebaseConfig";

/**
 * Create the Authentication Context
 * 
 * Think of createContext like creating a new radio frequency.
 * This "frequency" will broadcast authentication information to any component that wants to listen.
 * Initially, this context contains no data (it's like a silent radio station).
 */
const AuthContext = createContext();

/**
 * AuthProvider Component - The Radio Station
 * 
 * This component is like a radio station that broadcasts authentication information.
 * It wraps around our entire app and provides authentication data to all child components.
 * 
 * Props:
 * - children: All the components that will have access to authentication data
 *   (This is a special React prop that represents nested components)
 */
export const AuthProvider = ({ children }) => {
  // STATE VARIABLES - Data that this "radio station" broadcasts
  
  // Stores information about the currently logged-in user (null if no one is logged in)
  const [currentUser, setCurrentUser] = useState(null);
  
  // Boolean flag to track if we're still checking who's logged in
  // This prevents components from trying to access user data before it's loaded
  const [loading, setLoading] = useState(true);

  /**
   * useEffect Hook - Set up the Authentication Listener
   * 
   * This is like setting up equipment to automatically detect when someone logs in or out.
   * It runs once when the component starts and then "listens" for authentication changes.
   * 
   * How it works:
   * 1. Firebase continuously monitors if someone is logged in
   * 2. Whenever the login status changes, Firebase calls our function
   * 3. We update our state with the new user information
   * 4. This automatically updates all components listening to our context
   */
  useEffect(() => {
    // onAuthStateChanged is like subscribing to Firebase's "login status updates"
    // It gives us a function to unsubscribe later (like canceling a subscription)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // This function runs every time the authentication state changes
      // 'user' will be an object with user info if logged in, or null if logged out
      
      // Update our state with the current user (or null if logged out)
      setCurrentUser(user);
      
      // We're done loading - components can now safely check the user status
      setLoading(false);
    });

    // Cleanup function - runs when component unmounts (app shuts down)
    // This is like canceling our subscription to prevent memory leaks
    // Think of it like hanging up the phone when you're done with a call
    return () => unsubscribe();
  }, []); // Empty dependency array means this only runs once when component mounts

  /**
   * Return the Provider Component
   * 
   * This is where we actually "broadcast" our authentication data.
   * Any component wrapped inside this Provider can access the currentUser data.
   * 
   * The pattern is:
   * <AuthContext.Provider value={data we want to share}>
   *   <Components that need access to this data />
   * </AuthContext.Provider>
   */
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {/* Conditional rendering - only show children when we're done loading */}
      {/* This prevents components from trying to use user data before it's ready */}
      {/* Think of it like waiting for your internet to connect before opening a website */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Custom Hook - Easy Way to Access Authentication Data
 * 
 * This is a custom hook that makes it easy for components to access authentication data.
 * Instead of components having to import useContext and AuthContext separately,
 * they can just use this simple hook.
 * 
 * Think of it like a remote control - it gives you easy access to the "radio station"
 * without having to manually tune to the right frequency.
 * 
 * Usage in other components:
 * const { currentUser } = useAuth();
 * 
 * This is much simpler than:
 * const { currentUser } = useContext(AuthContext);
 */
export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useState, useEffect, useContext } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase/firebaseConfig";

// /**
//  * Creates an authentication context to share user data across components
//  */
// const AuthContext = createContext();

// /**
//  * AuthProvider component that manages authentication state
//  * Wraps the entire app to provide auth context to all components
//  */
// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true); // Track initial auth state loading

//   // Effect to listen for auth state changes
//   useEffect(() => {
//     // Subscribe to auth state changes
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user); // Update current user
//       setLoading(false); // Mark loading as complete
//     });

//     // Cleanup function to unsubscribe when component unmounts
//     return () => unsubscribe();
//   }, []);

//   // Provide auth context to children
//   return (
//     <AuthContext.Provider value={{ currentUser, loading }}>
//       {/* Only render children when not loading */}
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// /**
//  * Custom hook to easily access auth context
//  * Usage: const { currentUser } = useAuth();
//  */
// export const useAuth = () => useContext(AuthContext);
// src/context/AuthContext.jsx

// import React, { createContext, useState, useEffect, useContext } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase/firebaseConfig";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

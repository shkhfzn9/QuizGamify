// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import PrivateRoute from "./components/common/PrivateRoute";
// import DashboardPage from "./pages/DashboardPage";
// import LeaderboardPage from "./pages/LeaderboardPage";
// import BadgesPage from "./pages/BadgesPage";
// import QuizzesPage from "./pages/QuizzesPage";
// import AuthPage from "./pages/AuthPage";
// import UploadQuizPage from "./pages/UploadQuizPage";
// import QuizPageWrapper from "./components/quizzes/QuizPageWrapper";

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<AuthPage type="login" />} />
//           <Route path="/register" element={<AuthPage type="register" />} />

//           <Route
//             path="/"
//             element={
//               <PrivateRoute>
//                 <DashboardPage />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/leaderboard"
//             element={
//               <PrivateRoute>
//                 <LeaderboardPage />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/badges"
//             element={
//               <PrivateRoute>
//                 <BadgesPage />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/quizzes"
//             element={
//               <PrivateRoute>
//                 <QuizzesPage />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/upload"
//             element={
//               <PrivateRoute>
//                 <UploadQuizPage />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/quiz/:id"
//             element={
//               <PrivateRoute>
//                 <QuizPageWrapper />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./components/common/PrivateRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import BadgesPage from "./pages/BadgesPage.jsx";
import QuizzesPage from "./pages/QuizzesPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import UploadQuizPage from "./pages/UploadQuizPage.jsx";
import QuizPageWrapper from "./components/quizzes/QuizPageWrapper.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<AuthPage type="login" />} />
            <Route path="/register" element={<AuthPage type="register" />} />

            {/* Private Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <PrivateRoute>
                  <LeaderboardPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/badges"
              element={
                <PrivateRoute>
                  <BadgesPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/quizzes"
              element={
                <PrivateRoute>
                  <QuizzesPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <UploadQuizPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/quiz/:id"
              element={
                <PrivateRoute>
                  <QuizPageWrapper />
                </PrivateRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;

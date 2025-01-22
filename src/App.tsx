import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/About";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Navbar from "./components/Navbar";
import FlashMessage from "./hooks/FlashMessage";
import Dashboard from "./components/dashboard/Dashboard";
import VerifyCode from "./pages/verifyCode/VerifyCode";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import ReportsTest from "./components/ReportsTest";
import MyAccount from "./components/profile/MyAccount";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import PasswordChecker from "./components/passwordChecker/PasswordChecker";
import LoadingScreen from "./components/LoadingScreen";
import ResetPassword from "./components/resetpwd/ResetPassword";

const App: React.FC = () => {
  const { flashMessage, flashType, clearFlashMessage, isAuthenticated, userProfile, isLoadingProfile } = useAuth();


  if (isLoadingProfile) {
    return <LoadingScreen />; // Affiche un écran de chargement
  }

  return (
    <Router>
      {/* Navbar affichant l'avatar uniquement si l'utilisateur est authentifié */}
      <Navbar />
      {flashMessage && (
        <FlashMessage
          message={flashMessage}
          type={flashType || "info"}
          onClose={clearFlashMessage}
        />
      )}
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/check" element={<PasswordChecker />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Routes accessibles uniquement pour les utilisateurs connectés */}
        <Route
          path="/home"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              {userProfile ? (
                <Dashboard
                  userProfile={{
                    ...userProfile,
                    avatar: userProfile.avatar || "/path/to/default-avatar.png", // Fournir une valeur par défaut
                  }}
                />
              ) : (
                <p>Chargement du profil...</p>
              )}
            </ProtectedRoute>

          }
        />
        <Route
          path="/my-account"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/login">
              <MyAccount />
            </ProtectedRoute>
          }
        />

        {/* Routes accessibles uniquement pour les non-connectés */}
        <Route
          path="/login"
          element={
            <ProtectedRoute condition={!isAuthenticated} redirectTo="/home">
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRoute condition={!isAuthenticated} redirectTo="/home">
              <Signup />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        {/* Routes diverses */}
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/rep" element={<ReportsTest />} />

        {/* Page 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
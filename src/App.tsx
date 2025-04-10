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
import MyAccount from "./components/profile/MyAccount";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import PasswordChecker from "./components/passwordChecker/PasswordChecker";
import LoadingScreen from "./components/LoadingScreen";
import ResetPassword from "./components/resetpwd/ResetPassword";
import DashboardBrand from "./components/dashboard-brands/DashbordBrand";
import BrandLogin from "./pages/brand/BrandLogin";
import BrandList from "./components/admin/brandList/BrandList";
import BrandDashboard from "./components/brand-dashboard/BrandDashboard";
import NavbarBrand from "./components/NavbarBrand";
//import { AuthProvider } from "./contexts/AuthContext"; // Importer AuthProvider ici

const App: React.FC = () => {
  const {
    flashMessage,
    flashType,
    userType,
    clearFlashMessage,
    isAuthenticated,
    userProfile,
    isLoadingProfile,
  } = useAuth();


    //const navigate = useNavigate();

 /*    if (!isAuthenticated) {
      navigate("/login", { replace: true }); // Redirection automatique vers la page de login
    } */
  if (isLoadingProfile) {
    return <LoadingScreen />; // Affiche un écran de chargement
  }

  return (
    <Router>
      {/* AuthProvider doit être ici, à l'intérieur de Router */}
      {/* <AuthProvider> */}
      {/* Navbar affichant l'avatar uniquement si l'utilisateur est authentifié */}
      {userType === "brand" ? <NavbarBrand /> : <Navbar />}

      {/* Afficher le message flash si présent */}
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
            <ProtectedRoute
              condition={isAuthenticated && userType === "user"} // Assure que seul un "user" accède à cette route
              redirectTo="/brand-dash" // Redirige vers /brand-dash si l'utilisateur est une marque
            >
              {userProfile ? (
                <Dashboard
                  userProfile={{
                    ...userProfile,
                    avatar: userProfile.avatar || "/path/to/default-avatar.png",
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

        <Route
          path="/brand-dash"
          element={
            <ProtectedRoute condition={isAuthenticated} redirectTo="/brand-login">
              <BrandDashboard />
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

        {/* Route protégée pour la page brand-dash */}
        <Route
          path="/brand-dash"
          element={
            <ProtectedRoute
              condition={isAuthenticated && userType === "brand"} // Assure que seul une marque peut accéder à cette route
              redirectTo="/home" // Redirige vers /home si l'utilisateur n'est pas une marque
            >
              <BrandDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/brand-login" element={<BrandLogin />} />

        <Route path="/dashboard-brand" element={<DashboardBrand />} />
        <Route
          path="/admin/brands"
          element={
            <ProtectedRoute condition={userProfile?.role === "admin"} redirectTo="/home">
              <BrandList />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
      </Routes>
      {/*   </AuthProvider> */}
    </Router>
  );
};

export default App;

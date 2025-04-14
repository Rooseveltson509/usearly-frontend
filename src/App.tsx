import React from "react";
import { Routes, Route } from "react-router-dom"; // ✅ on enlève BrowserRouter ici
import About from "./pages/About";
import Navbar from "./components/Navbar";
import FlashMessage from "./hooks/FlashMessage";
import Dashboard from "./components/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import MyAccount from "./components/profile/MyAccount";
import LoadingScreen from "./components/LoadingScreen";
import DashboardBrand from "./components/dashboard-brands/DashbordBrand";
import BrandList from "./components/admin/brandList/BrandList";
import BrandDashboard from "./components/brand-dashboard/BrandDashboard";
import NavbarBrand from "./components/NavbarBrand";
import {
  BrandProfile,
  BrandReports,
  BrandRewards,
  BrandStatistics,
  BrandLogin,
} from "./pages/brand";
import {
  ForgotPassword,
  Home,
  Login,
  PasswordChecker,
  ResetPassword,
  Signup,
  VerifyCode,
} from "./pages";

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

  if (isLoadingProfile) {
    return <LoadingScreen />;
  }

  return (
    <>
      {userType === "brand" ? <NavbarBrand /> : <Navbar />}

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
        <Route path="/about" element={<About />} />
        <Route path="/check" element={<PasswordChecker />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />

        {/* Routes user classique */}
        <Route
          path="/home"
          element={
            <ProtectedRoute
              condition={isAuthenticated && userType === "user"}
              redirectTo={userType === "brand" ? "/brand-dash" : "/login"}
            >
              <Dashboard
                userProfile={{
                  ...userProfile!,
                  avatar: userProfile?.avatar || "/path/to/default-avatar.png",
                }}
              />
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
          path="/login"
          element={
            <ProtectedRoute
              condition={!isAuthenticated}
              redirectTo={userType === "brand" ? "/brand-dash" : "/home"}
            >
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <ProtectedRoute
              condition={!isAuthenticated}
              redirectTo={userType === "brand" ? "/brand-dash" : "/home"}
            >
              <Signup />
            </ProtectedRoute>
          }
        />

        {/* Routes brand uniquement */}
        <Route
          path="/brand-login"
          element={
            <ProtectedRoute condition={!isAuthenticated} redirectTo="/brand-dash">
              <BrandLogin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand-dash"
          element={
            <ProtectedRoute
              condition={isAuthenticated && userType === "brand"}
              redirectTo="/brand-login"
            >
              <BrandDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-brand"
          element={
            <ProtectedRoute
              condition={isAuthenticated && userType === "brand"}
              redirectTo="/brand-login"
            >
              <DashboardBrand />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand-reports"
          element={
            <ProtectedRoute
              condition={isAuthenticated && userType === "brand"}
              redirectTo="/brand-login"
            >
              <BrandReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand-statistics"
          element={
            <ProtectedRoute
              condition={isAuthenticated && userType === "brand"}
              redirectTo="/brand-login"
            >
              <BrandStatistics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand-rewards"
          element={
            <ProtectedRoute
              condition={isAuthenticated && userType === "brand"}
              redirectTo="/brand-login"
            >
              <BrandRewards />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand-profile"
          element={
            <ProtectedRoute
              condition={isAuthenticated && userType === "brand"}
              redirectTo="/brand-login"
            >
              <BrandProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin uniquement */}
        <Route
          path="/admin/brands"
          element={
            <ProtectedRoute
              condition={isAuthenticated && userProfile?.role === "admin"}
              redirectTo="/home"
            >
              <BrandList />
            </ProtectedRoute>
          }
        />

        {/* Route catch-all */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </>
  );
};

export default App;

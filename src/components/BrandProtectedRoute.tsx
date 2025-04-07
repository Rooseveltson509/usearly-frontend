/* import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@src/contexts/AuthContext";

const BrandProtectedRoute = () => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated || userType !== "brand") {
    return <Navigate to="/login" replace />; // 🔥 Redirige vers login si pas une marque
  }

  return <Outlet />;
};

export default BrandProtectedRoute; */

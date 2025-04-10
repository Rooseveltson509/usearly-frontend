import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@src/contexts/AuthContext";

const ProtectedBrandRoute = () => {
  const { isAuthenticated, userType } = useAuth();

  // Si l'utilisateur est authentifié mais n'est pas une marque, il est redirigé sans être déconnecté
  if (isAuthenticated && userType !== "brand") {
    return <Navigate to="/home" replace />; // Redirige vers le tableau de bord classique ou une autre page
  }

  // Si non authentifié ou si l'utilisateur est une marque, continue vers la route
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirige l'utilisateur vers la page de login s'il n'est pas authentifié
  }

  return <Outlet />;
};

export default ProtectedBrandRoute;

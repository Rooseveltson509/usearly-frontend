import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
  allowedRoles?: ("user" | "brand")[]; // Les rôles autorisés (marque ou utilisateur classique)
  condition?: boolean; // Condition pour les anciennes routes
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo,
  allowedRoles,
  condition,
}) => {
  const { isAuthenticated, userType } = useAuth();

  // Si une condition est définie, alors on peut l'utiliser pour une logique de validation
  if (condition !== undefined) {
    return condition ? <>{children}</> : <Navigate to={redirectTo} />;
  }

  // Si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    console.warn("🚫 Accès refusé, redirection vers :", redirectTo);
    return <Navigate to={redirectTo} />;
  }

  // Vérification du rôle de l'utilisateur
  if (allowedRoles && userType && !allowedRoles.includes(userType)) {
    // Si l'utilisateur essaie d'accéder à une page réservée à un autre rôle
    console.warn(
      `🚫 Accès refusé, redirection vers ${redirectTo} car le rôle ${userType} n'est pas autorisé`
    );
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
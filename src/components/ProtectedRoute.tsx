import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
  allowedRoles?: ("user" | "brand")[]; // Ajout des rôles autorisés
  condition?: boolean; // Condition pour les anciennes routes
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo,
  allowedRoles,
  condition,
}) => {
  const { isAuthenticated, userType } = useAuth();

  console.log("🔍 ProtectedRoute - isAuthenticated:", isAuthenticated);
  console.log("🔍 ProtectedRoute - userType:", userType);

  if (condition !== undefined) {
    return condition ? <>{children}</> : <Navigate to={redirectTo} />;
  }

  if (
    !isAuthenticated ||
    !userType ||
    (allowedRoles && !allowedRoles.includes(userType))
  ) {
    console.warn("🚫 Accès refusé, redirection vers :", redirectTo);
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};


export default ProtectedRoute;

/* import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
  condition: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo,
  condition,
}) => {
  return condition ? <>{children}</> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute; */

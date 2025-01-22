import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
  condition: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo, condition }) => {
  return condition ? <>{children}</> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;

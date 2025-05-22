// filepath: c:\Users\PRAJNA SHETTY\user-access-management\user-access-management\frontend\src\components\ProtectedRoute.tsx
// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  isAuthenticated: boolean;
  requiredRole?: string; // Make requiredRole optional as not all protected routes need a specific role
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated, requiredRole }) => {
  const userRole = localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Optional: redirect to a generic unauthorized page or show a message
    return (
      <div>
        <h3>Access Denied: You do not have the required permissions.</h3>
        <p>Your role: {userRole || 'Not logged in'}. Required role: {requiredRole}</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

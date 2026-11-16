import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0d12] text-amber-500">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (allowedRoles.includes('ADMIN')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (allowedRoles.includes('KITCHEN')) {
      return <Navigate to="/kitchen/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin has superuser access to everything
  if (role === 'ADMIN') {
    return children;
  }

  // Check role match
  if (allowedRoles && !allowedRoles.includes(role)) {
    // If Kitchen user tries to access unauthorized pages, send to /kitchen
    if (role === 'KITCHEN') {
      return <Navigate to="/kitchen" replace />;
    }
    // If Customer tries to access staff pages, send to /menu
    return <Navigate to="/menu" replace />;
  }

  return children;
};

export default ProtectedRoute;


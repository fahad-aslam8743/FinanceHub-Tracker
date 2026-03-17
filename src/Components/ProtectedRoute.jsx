import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }
if (!session) {
    console.log("No session found, redirecting to login...");
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
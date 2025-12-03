import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  
  if (isAuthenticated === false && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Učitavanje...
      </div>
    );
  }

  
  const token = localStorage.getItem("accessToken");
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

 
  return children;
}
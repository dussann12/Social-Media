import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { JSX } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
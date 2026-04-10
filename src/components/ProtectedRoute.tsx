// Garde de route : redirige si non connecté ou mauvais rôle

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Chargement...</div>;
  if (!user)   return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return <>{children}</>;
};

export default ProtectedRoute;

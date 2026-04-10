// Contexte d'authentification : state, login, logout, refreshUser

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import type { User, AuthContextType } from "../types";

// ── Création du contexte ──────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Hook d'accès au contexte ─────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
};

// ── Provider ─────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupère l'utilisateur depuis l'API (utile après upload CV)
  const refreshUser = async () => {
    const saved = localStorage.getItem("token");
    if (!saved) return;
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      logout();
    }
  };

  // Restaure la session au chargement de la page
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser  = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

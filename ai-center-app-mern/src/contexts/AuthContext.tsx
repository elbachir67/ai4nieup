import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../config/api";

interface User {
  id: string;
  email: string;
  token: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
  hasCompletedAssessment: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  checkAssessmentStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser).isAdmin : false;
  });
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  const checkAssessmentStatus = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${api.assessments}/history`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        const assessments = await response.json();
        setHasCompletedAssessment(assessments && assessments.length > 0);
      }
    } catch (error) {
      console.error("Error checking assessment status:", error);
    }
  };

  useEffect(() => {
    if (user) {
      checkAssessmentStatus();
    } else {
      setHasCompletedAssessment(false);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(api.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const userData = {
        id: data.user.id,
        email: data.user.email,
        token: data.token,
        isAdmin: data.user.isAdmin,
      };

      setUser(userData);
      setIsAdmin(userData.isAdmin);
      localStorage.setItem("user", JSON.stringify(userData));

      // Vérifier le statut de l'évaluation après la connexion
      await checkAssessmentStatus();
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setIsAdmin(false);
    setHasCompletedAssessment(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        isAdmin,
        hasCompletedAssessment,
        signIn,
        signOut,
        checkAssessmentStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

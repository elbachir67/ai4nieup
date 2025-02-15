import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../config/api';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser).isAdmin : false;
  });

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${api.auth}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setIsAdmin(data.user.isAdmin);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
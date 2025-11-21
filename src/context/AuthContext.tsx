import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../services/authService';


interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session on mount
    const storedUser = localStorage.getItem('careConnectUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('careConnectUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('careConnectUser', JSON.stringify(userData));
    // Also set the legacy admin flag if it's an admin, for backward compatibility during migration
    if (userData.role === 'admin') {
      localStorage.setItem('adminAuth', 'true');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('careConnectUser');
    localStorage.removeItem('adminAuth');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

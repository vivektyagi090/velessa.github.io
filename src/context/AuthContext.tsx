import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const existing = authService.getCurrentUser();
    setUser(existing);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authenticatedUser = await authService.login(email, password);
      setUser(authenticatedUser);
      showToast(`Welcome back to Velessa, ${authenticatedUser.firstName}.`, 'success', 'Welcome');
      return true;
    } catch {
      showToast('Authentication failed. Please check credentials.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const newUser = await authService.register(firstName, lastName, email, password);
      setUser(newUser);
      showToast(`Welcome to the Velessa Circle, ${firstName}.`, 'success', 'Membership Confirmed');
      return true;
    } catch {
      showToast('Registration could not be completed.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    showToast('You have been signed out.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

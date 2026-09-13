import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, GoogleAuthResult } from '../types/user';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOtp: (phoneNumber: string, otpCode: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string, phoneNumber: string, otpCode: string) => Promise<boolean>;
  googleLogin: (credential: string) => Promise<GoogleAuthResult>;
  completeGoogleRegistration: (tempToken: string, phoneNumber: string, otpCode: string) => Promise<boolean>;
  checkoutVerifyPhone: (phoneNumber: string, otpCode: string, firstName: string, lastName: string, email: string) => Promise<User>;
  updateProfile: (data: { firstName: string; lastName: string; phoneNumber?: string; otpCode?: string }) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const cached = authService.getCurrentUser();
      if (cached) {
        setUser(cached);
      }
      try {
        const fresh = await authService.fetchMe();
        if (fresh) {
          setUser(fresh);
        } else if (!authService.getToken()) {
          setUser(null);
        }
      } catch {
        // network issue: keep cached user if offline
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authenticatedUser = await authService.login(email, password);
      setUser(authenticatedUser);
      showToast(`Welcome back to Velessa, ${authenticatedUser.firstName}.`, 'success', 'Welcome');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      showToast(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOtp = async (phoneNumber: string, otpCode: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authenticatedUser = await authService.loginWithOtp(phoneNumber, otpCode);
      setUser(authenticatedUser);
      showToast(`Welcome back to Velessa, ${authenticatedUser.firstName}.`, 'success', 'Mobile OTP Verified');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Mobile OTP login failed.';
      showToast(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, phoneNumber: string, otpCode: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const newUser = await authService.register(firstName, lastName, email, password, phoneNumber, otpCode);
      setUser(newUser);
      showToast(`Welcome to the Velessa Circle, ${firstName}. Mobile number verified.`, 'success', 'Membership Confirmed');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
      showToast(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (credential: string): Promise<GoogleAuthResult> => {
    try {
      setIsLoading(true);
      const result = await authService.googleLogin(credential);

      if (!result.requiresPhoneVerification && result.user) {
        setUser(result.user);
        showToast(`Welcome to Velessa, ${result.user.firstName}.`, 'success', 'Google Sign-in Confirmed');
      }

      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google authentication failed.';
      showToast(message, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completeGoogleRegistration = async (tempToken: string, phoneNumber: string, otpCode: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const verifiedUser = await authService.verifyGooglePhone(tempToken, phoneNumber, otpCode);
      setUser(verifiedUser);
      showToast(`Welcome to the Velessa Circle, ${verifiedUser.firstName}. Mobile number verified.`, 'success', 'Privé Circle Activated');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Mobile OTP verification failed.';
      showToast(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { firstName: string; lastName: string; phoneNumber?: string; otpCode?: string }): Promise<User> => {
    try {
      setIsLoading(true);
      const updated = await authService.updateProfile(data);
      setUser(updated);
      showToast('Patron profile updated successfully.', 'success', 'Profile Updated');
      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.';
      showToast(message, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkoutVerifyPhone = async (phoneNumber: string, otpCode: string, firstName: string, lastName: string, email: string): Promise<User> => {
    try {
      setIsLoading(true);
      const authenticatedUser = await authService.checkoutVerifyPhone(phoneNumber, otpCode, firstName, lastName, email);
      setUser(authenticatedUser);
      showToast(`Welcome to Velessa Circle, ${authenticatedUser.firstName}. Mobile number verified!`, 'success', 'Verified & Logged In');
      return authenticatedUser;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Mobile verification failed.';
      showToast(message, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    showToast('You have been signed out successfully.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithOtp,
        register,
        googleLogin,
        completeGoogleRegistration,
        checkoutVerifyPhone,
        updateProfile,
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

import { User, GoogleAuthResult, SendOtpResult } from '../types/user';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5286/api';
const AUTH_USER_KEY = 'velessa_current_user';
const AUTH_TOKEN_KEY = 'velessa_auth_token';

interface BackendAuthResponse {
  token?: string | null;
  user?: User | null;
  requiresPhoneVerification: boolean;
  tempToken?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  message?: string;
}

export const authService = {
  getToken(): string | null {
    return getStorageItem<string | null>(AUTH_TOKEN_KEY, null);
  },

  getCurrentUser(): User | null {
    return getStorageItem<User | null>(AUTH_USER_KEY, null);
  },

  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Invalid email or password credentials.');
    }

    const data: BackendAuthResponse = await res.json();
    if (data.token && data.user) {
      setStorageItem(AUTH_TOKEN_KEY, data.token);
      setStorageItem(AUTH_USER_KEY, data.user);
      return data.user;
    }

    throw new Error('Authentication response was incomplete.');
  },

  async loginWithOtp(phoneNumber: string, otpCode: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/login-with-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, otpCode }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Mobile OTP login failed.');
    }

    const data: BackendAuthResponse = await res.json();
    if (data.token && data.user) {
      setStorageItem(AUTH_TOKEN_KEY, data.token);
      setStorageItem(AUTH_USER_KEY, data.user);
      return data.user;
    }

    throw new Error('Authentication response was incomplete.');
  },

  async register(firstName: string, lastName: string, email: string, password: string, phoneNumber: string, otpCode: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, phoneNumber, otpCode }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration could not be completed.');
    }

    const data: BackendAuthResponse = await res.json();
    if (data.token && data.user) {
      setStorageItem(AUTH_TOKEN_KEY, data.token);
      setStorageItem(AUTH_USER_KEY, data.user);
      return data.user;
    }

    throw new Error('Registration response was incomplete.');
  },

  async registerShopkeeper(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    storeName?: string;
    storeLocation?: string;
    gstin?: string;
  }): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/register-shopkeeper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Merchant registration could not be completed.');
    }

    const resData: BackendAuthResponse = await res.json();
    if (resData.token && resData.user) {
      setStorageItem(AUTH_TOKEN_KEY, resData.token);
      setStorageItem(AUTH_USER_KEY, resData.user);
      return resData.user;
    }

    throw new Error('Merchant registration response was incomplete.');
  },

  async checkoutVerifyPhone(phoneNumber: string, otpCode: string, firstName: string, lastName: string, email: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/checkout-verify-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, otpCode, firstName, lastName, email }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Phone verification failed.');
    }

    const data: BackendAuthResponse = await res.json();
    if (data.token && data.user) {
      setStorageItem(AUTH_TOKEN_KEY, data.token);
      setStorageItem(AUTH_USER_KEY, data.user);
      return data.user;
    }

    throw new Error('Verification response was incomplete.');
  },

  async googleLogin(credential: string): Promise<GoogleAuthResult> {
    const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Google authentication failed.');
    }

    const data: BackendAuthResponse = await res.json();

    if (data.requiresPhoneVerification) {
      return {
        requiresPhoneVerification: true,
        tempToken: data.tempToken || undefined,
        email: data.email || undefined,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
      };
    }

    if (data.token && data.user) {
      setStorageItem(AUTH_TOKEN_KEY, data.token);
      setStorageItem(AUTH_USER_KEY, data.user);
      return {
        requiresPhoneVerification: false,
        token: data.token,
        user: data.user,
      };
    }

    throw new Error('Unexpected response during Google sign-in.');
  },

  async sendOtp(phoneNumber: string, tempToken?: string): Promise<SendOtpResult> {
    const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, tempToken }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Unable to dispatch verification OTP.');
    }

    return await res.json();
  },

  async verifyGooglePhone(tempToken: string, phoneNumber: string, otpCode: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/verify-google-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tempToken, phoneNumber, otpCode }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Invalid or expired OTP code.');
    }

    const data: BackendAuthResponse = await res.json();
    if (data.token && data.user) {
      setStorageItem(AUTH_TOKEN_KEY, data.token);
      setStorageItem(AUTH_USER_KEY, data.user);
      return data.user;
    }

    throw new Error('Failed to finalize verified account.');
  },

  async fetchMe(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        this.logout();
        return null;
      }

      const user: User = await res.json();
      setStorageItem(AUTH_USER_KEY, user);
      return user;
    } catch {
      return null;
    }
  },

  async forgotPassword(identifier: string): Promise<{ success: boolean; message: string; isMobile: boolean; phoneNumber?: string; devOtp?: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Unable to process password reset request.');
    }

    return await res.json();
  },

  async verifyResetOtp(identifier: string, otpCode: string): Promise<{ success: boolean; message: string; resetToken?: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/verify-reset-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, otpCode }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Invalid or expired OTP code.');
    }

    return await res.json();
  },

  async resetPassword(
    payload: { resetToken?: string; identifier?: string; otpCode?: string },
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resetToken: payload.resetToken,
        identifier: payload.identifier,
        otpCode: payload.otpCode,
        newPassword,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Password reset failed.');
    }

    return await res.json();
  },

  async updateProfile(data: { firstName: string; lastName: string; phoneNumber?: string; otpCode?: string }): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('You must be signed in to update your profile.');
    }

    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Unable to update profile.');
    }

    const updatedUser: User = await res.json();
    setStorageItem(AUTH_USER_KEY, updatedUser);
    return updatedUser;
  },

  async logout(): Promise<void> {
    removeStorageItem(AUTH_TOKEN_KEY);
    removeStorageItem(AUTH_USER_KEY);
    try {
      window.localStorage.removeItem('velessa_saved_shipping_address');
      for (let i = window.localStorage.length - 1; i >= 0; i--) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith('velessa_saved_shipping_address')) {
          window.localStorage.removeItem(key);
        }
      }
    } catch {
      // Storage unavailable or restricted
    }
  }
};

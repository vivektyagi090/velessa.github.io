export interface User {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  phoneNumber?: string;
  isPhoneVerified?: boolean;
  avatar?: string;
  avatarUrl?: string;
  memberSince: string;
  tier: 'Velessa Circle' | 'Privé Gold' | 'Haute Joaillerie VIP' | string;
  role?: string;
  lastLoginAtUtc?: string | null;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface GoogleAuthResult {
  requiresPhoneVerification: boolean;
  user?: User;
  token?: string;
  tempToken?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface SendOtpResult {
  success: boolean;
  message: string;
  expirySeconds: number;
  devOtp?: string;
}

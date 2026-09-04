export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  memberSince: string;
  tier: 'Velessa Circle' | 'Privé Gold' | 'Haute Joaillerie VIP';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

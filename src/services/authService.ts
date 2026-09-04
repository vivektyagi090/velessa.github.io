import { User } from '../types/user';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

const AUTH_USER_KEY = 'velessa_current_user';

export const authService = {
  getCurrentUser(): User | null {
    return getStorageItem<User | null>(AUTH_USER_KEY, null);
  },

  async login(email: string, _password: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 300));
    // Provide realistic user session
    const user: User = {
      id: 'usr-108',
      email,
      firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      lastName: 'Sterling',
      memberSince: '2025',
      tier: 'Privé Gold'
    };
    setStorageItem(AUTH_USER_KEY, user);
    return user;
  },

  async register(firstName: string, lastName: string, email: string, _password: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 350));
    const user: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email,
      firstName,
      lastName,
      memberSince: new Date().getFullYear().toString(),
      tier: 'Velessa Circle'
    };
    setStorageItem(AUTH_USER_KEY, user);
    return user;
  },

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
    removeStorageItem(AUTH_USER_KEY);
  }
};

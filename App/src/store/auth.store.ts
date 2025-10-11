import { create } from 'zustand';
import { api } from '@services/api';
import { secureStorage } from '@utils/secureStorage';
import { config } from '@/src/config';
import { DEMO_CREDENTIALS } from '@/src/constants/demo-credentials';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'owner';
  profileImage?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'owner';
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,

  initialize: async () => {
    try {
      const [token, userData] = await Promise.all([
        secureStorage.getAuthToken(),
        secureStorage.getUserData(),
      ]);

      if (token && userData) {
        set({ isAuthenticated: true, token, user: userData, isLoading: false });
      } else {
        set({ isAuthenticated: false, token: null, user: null, isLoading: false });
      }
    } catch (error) {
      set({ isAuthenticated: false, token: null, user: null, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Check if using demo credentials
      if (email === DEMO_CREDENTIALS.student.email && password === DEMO_CREDENTIALS.student.password) {
        console.log('Using demo student credentials');
        const mockUser: User = {
          id: 's1',
          name: 'Demo Student',
          email: email,
          role: 'student',
          profileImage: undefined
        };
        const mockToken = 'mock-token-student';

        // Store mock data
        await Promise.all([
          secureStorage.setAuthToken(mockToken),
          secureStorage.setUserData(mockUser),
        ]);

        // Update store state
        set({ 
          isAuthenticated: true, 
          token: mockToken, 
          user: mockUser, 
          isLoading: false 
        });
        return;
      } 
      
      if (email === DEMO_CREDENTIALS.owner.email && password === DEMO_CREDENTIALS.owner.password) {
        console.log('Using demo owner credentials');
        const mockUser: User = {
          id: 'o1',
          name: 'Demo Owner',
          email: email,
          role: 'owner',
          profileImage: undefined
        };
        const mockToken = 'mock-token-owner';

        // Store mock data
        await Promise.all([
          secureStorage.setAuthToken(mockToken),
          secureStorage.setUserData(mockUser),
        ]);

        // Update store state
        set({ 
          isAuthenticated: true, 
          token: mockToken, 
          user: mockUser, 
          isLoading: false 
        });
        return;
      }

      // If credentials don't match demo accounts
      throw new Error('Invalid credentials. Please use the demo credentials provided.');
    } catch (error: any) {
      set({ isLoading: false });
      throw error instanceof Error ? error : new Error(error?.message || 'Login failed. Please try again.');
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true });
      
      const endpoint = data.role === 'student' 
        ? '/auth/student/signup'
        : '/auth/owner/signup';

      const response = await api.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }

      const { accessToken: token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      await Promise.all([
        secureStorage.setAuthToken(token),
        secureStorage.setUserData(user),
      ]);

      set({ isAuthenticated: true, token, user, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw error instanceof Error ? error : new Error(error?.message || 'Registration failed. Please try again.');
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await api.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await secureStorage.clearAuth();
      set({
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false,
      });
    }
  },

  updateUser: async (userData) => {
    try {
      set({ isLoading: true });
      const response = await api.request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to update profile');
      }

      const updatedUser = { ...get().user, ...response.data.user };
      await secureStorage.setUserData(updatedUser);
      set({ user: updatedUser, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw error instanceof Error ? error : new Error(error?.message || 'Failed to update profile');
    }
  },
}));
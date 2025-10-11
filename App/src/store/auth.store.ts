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

      // For testing: Check demo credentials
      if (email === DEMO_CREDENTIALS.student.email && password === DEMO_CREDENTIALS.student.password) {
        console.log('Using demo student credentials');
        
        // Create mock user data
        const mockUser: User = {
          id: '1',
          name: 'Demo Student',
          email: email,
          role: 'student',
          profileImage: undefined
        };
        
        const mockToken = 'mock-token-for-testing';

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

      // If not using demo credentials, try real API
      const payload = {
        identifier: email,
        password,
        role: 'student'
      };

      console.log('Login attempt with:', { identifier: email, role: 'student' });

      const response = await api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('Response from /auth/login:', JSON.stringify(response));

      if (!response?.data) {
        throw new Error('Invalid response format from server');
      }

      const { accessToken, user } = response.data;

      if (!accessToken || !user) {
        throw new Error('Missing token or user data in response');
      }

      // Ensure we have the required user fields
      const userData: User = {
        id: user.id || user._id, // Handle both id formats
        name: user.name,
        email: user.email,
        role: user.role || 'student', // Default to student if role is missing
        profileImage: user.profileImage
      };

      await Promise.all([
        secureStorage.setAuthToken(accessToken),
        secureStorage.setUserData(userData),
      ]);

      set({ isAuthenticated: true, token: accessToken, user: userData, isLoading: false });
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
import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@store/auth.store';
import { secureStorage } from '@/src/utils/secureStorage';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const segments = useSegments() as string[];
  const router = useRouter();
  const authStore = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load stored auth state
        const [token, userData] = await Promise.all([
          secureStorage.getAuthToken(),
          secureStorage.getUserData(),
        ]);

        if (token && userData) {
          authStore.login(userData.email, token);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    };

    initialize();
  }, []);

  // Handle protected routes and navigation
  useEffect(() => {
    if (authStore.isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inLandingGroup = segments[0] === '(landing)';

    const navigate = () => {
      try {
        // Not authenticated -> Landing or Auth pages only
        if (!authStore.isAuthenticated && !inAuthGroup && !inLandingGroup) {
          console.log('Redirecting to landing...');
          router.replace('/(landing)');
          return;
        }

        // Authenticated -> Redirect to home
        if (authStore.isAuthenticated && (inAuthGroup || inLandingGroup)) {
          console.log('User authenticated, redirecting...');
          const route = authStore.user?.role === 'student' ? '/(drawer)/home' : '/(drawer)/home';
          router.replace(route);
          return;
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };

    navigate();
  }, [authStore.isAuthenticated, authStore.isLoading, segments, router, authStore.user?.role]);

  return <>{children}</>;
}
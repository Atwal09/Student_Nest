import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/components/providers/auth-provider';

import { useEffect } from 'react';
import { useNavigationStore, useAuthStore } from '@store';

export const unstable_settings = {
  initialRouteName: '(landing)',
  routes: {
    '(landing)': {
      screens: {
        index: 'Landing',
      },
    },
    '(auth)': {
      screens: {
        'student/login': 'Student Login',
        'student/signup': 'Student Registration',
        'owner/login': 'Owner Login',
        'owner/signup': 'Owner Registration',
      },
    },
    '(drawer)': {
      screens: {
        'home': 'Home',
        'room-sharing': 'Room Sharing',
        'bookings': 'My Bookings',
        'visiting': 'Visiting Schedule',
        'negotiations': 'Negotiations',
        'saved': 'Saved Rooms',
        'messages': 'Messages',
        'profile': 'Profile',
      },
    },
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(landing)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(drawer)" />
            <Stack.Screen 
              name="modal" 
              options={{ 
                headerShown: true,
                presentation: 'modal', 
                title: 'Modal' 
              }} 
            />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

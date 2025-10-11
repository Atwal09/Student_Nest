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
};

// Prevent flashing loading screen
const SUPPRESS_NAVIGATION_BAR_WARINING = true;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
              animation: 'fade',
            }}
          >
            <Stack.Screen 
              name="(landing)" 
              options={{ animation: 'fade' }} 
            />
            <Stack.Screen 
              name="(auth)" 
              options={{ animation: 'fade' }} 
            />
            <Stack.Screen 
              name="(drawer)" 
              options={{ animation: 'fade' }} 
            />
            <Stack.Screen 
              name="modal" 
              options={{ 
                headerShown: true,
                presentation: 'modal', 
                title: 'Modal',
                animation: 'slide_from_bottom',
              }} 
            />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
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

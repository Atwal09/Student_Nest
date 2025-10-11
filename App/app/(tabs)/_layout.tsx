import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@store/auth.store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const user = useAuthStore(state => state.user);
  const isStudent = user?.role === 'student';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      {isStudent ? (
        <>
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="room-sharing"
            options={{
              title: 'Shared',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="messages"
            options={{
              title: 'Messages',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
            }}
          />
        </>
      ) : (
        <>
          <Tabs.Screen
            name="properties"
            options={{
              title: 'Properties',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="building.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="booking-requests"
            options={{
              title: 'Requests',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="messages"
            options={{
              title: 'Messages',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
            }}
          />
        </>
      )}
    </Tabs>
  );
}

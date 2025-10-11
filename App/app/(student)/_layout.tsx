import { Drawer } from 'expo-router/drawer';
import { Tabs } from 'expo-router/tabs';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/theme';

export default function StudentPortalLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer>
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          drawerLabel: 'Home',
        }}
      />
      {/* Drawer screens */}
      <Drawer.Screen
        name="room-browser"
        options={{
          drawerLabel: 'Room Browser',
        }}
      />
      <Drawer.Screen
        name="my-bookings"
        options={{
          drawerLabel: 'My Bookings',
        }}
      />
      <Drawer.Screen
        name="visiting-schedule"
        options={{
          drawerLabel: 'Visiting Schedule',
        }}
      />
      <Drawer.Screen
        name="room-sharing"
        options={{
          drawerLabel: 'Room Sharing Network',
        }}
      />
      <Drawer.Screen
        name="negotiations"
        options={{
          drawerLabel: 'Negotiations',
        }}
      />
      <Drawer.Screen
        name="saved"
        options={{
          drawerLabel: 'Saved',
        }}
      />
      <Drawer.Screen
        name="messages"
        options={{
          drawerLabel: 'Messages',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
        }}
      />
    </Drawer>
  );
}
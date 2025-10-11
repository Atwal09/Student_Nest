import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/theme';

export default function OwnerPortalLayout() {
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
        name="my-properties"
        options={{
          drawerLabel: 'My Properties',
        }}
      />
      <Drawer.Screen
        name="booking-requests"
        options={{
          drawerLabel: 'Booking Requests',
        }}
      />
      <Drawer.Screen
        name="visit-requests"
        options={{
          drawerLabel: 'Visit Requests',
        }}
      />
      <Drawer.Screen
        name="negotiations"
        options={{
          drawerLabel: 'Negotiations',
        }}
      />
      <Drawer.Screen
        name="post-property"
        options={{
          drawerLabel: 'Post Property',
        }}
      />
      <Drawer.Screen
        name="payments"
        options={{
          drawerLabel: 'Payments & Revenue',
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
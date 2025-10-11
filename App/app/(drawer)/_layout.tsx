import { Drawer } from 'expo-router/drawer';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuthStore } from '@store/auth.store';
import 'react-native-gesture-handler';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const user = useAuthStore(state => state.user);
  const isStudent = user?.role === 'student';

  const commonScreens = [
    { name: 'messages', title: 'Messages', icon: 'message' },
    { name: 'profile', title: 'Profile', icon: 'person' },
  ];

  const studentScreens = [
    { name: 'home', title: 'Room Browser', icon: 'house' },
    { name: 'bookings', title: 'My Bookings', icon: 'calendar' },
    { name: 'visiting', title: 'Visiting Schedule', icon: 'clock' },
    { name: 'room-sharing', title: 'Room Sharing Network', icon: 'person.2' },
    { name: 'negotiations', title: 'Negotiations', icon: 'hand.thumbsup' },
    { name: 'saved', title: 'Saved', icon: 'bookmark' },
  ];

  const ownerScreens = [
    { name: 'properties', title: 'My Properties', icon: 'building' },
    { name: 'booking-requests', title: 'Booking Requests', icon: 'doc.text' },
    { name: 'visit-requests', title: 'Visit Requests', icon: 'calendar' },
    { name: 'negotiations', title: 'Negotiations', icon: 'hand.thumbsup' },
    { name: 'post-property', title: 'Post Property', icon: 'plus' },
    { name: 'payments', title: 'Payments & Revenue', icon: 'creditcard' },
  ];

  const screens = isStudent ? studentScreens : ownerScreens;

  return (
    <ThemedView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme].background,
          },
          headerTintColor: Colors[colorScheme].text,
          drawerStyle: {
            backgroundColor: Colors[colorScheme].background,
          },
          drawerLabelStyle: {
            color: Colors[colorScheme].text,
          },
          drawerActiveTintColor: Colors[colorScheme].tint,
        }}>
        {/* Main screens based on user role */}
        {screens.map((screen) => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            options={{
              title: screen.title,
              drawerIcon: ({ color }) => (
                <IconSymbol name={`${screen.icon}.fill`} size={24} color={color} />
              ),
            }}
          />
        ))}

        {/* Common screens */}
        {commonScreens.map((screen) => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            options={{
              title: screen.title,
              drawerIcon: ({ color }) => (
                <IconSymbol name={`${screen.icon}.fill`} size={24} color={color} />
              ),
            }}
          />
        ))}
      </Drawer>
    </ThemedView>
  );
}
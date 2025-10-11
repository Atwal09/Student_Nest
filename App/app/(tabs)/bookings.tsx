import React from 'react';
import { ScrollView, View } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BookingsScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'My Bookings',
          headerShown: true,
        }}
      />
      <ScrollView>
        {/* Active Bookings */}
        <View style={{ padding: 16 }}>
          <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            Active Bookings
          </ThemedText>
          {/* TODO: Add ActiveBookingsList component */}
        </View>

        {/* Pending Applications */}
        <View style={{ padding: 16 }}>
          <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            Pending Applications
          </ThemedText>
          {/* TODO: Add ApplicationsList component */}
        </View>

        {/* Booking History */}
        <View style={{ padding: 16 }}>
          <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            Booking History
          </ThemedText>
          {/* TODO: Add BookingHistoryList component */}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SavedScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Saved Rooms',
          headerShown: true,
        }}
      />
      <ScrollView>
        {/* Saved Categories */}
        <View style={{ padding: 16 }}>
          <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            Saved Rooms
          </ThemedText>
          {/* TODO: Add SavedRoomList component */}
        </View>

        {/* Recent Views */}
        <View style={{ padding: 16 }}>
          <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            Recently Viewed
          </ThemedText>
          {/* TODO: Add RecentRoomList component */}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
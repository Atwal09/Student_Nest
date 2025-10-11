import React from 'react';
import { ScrollView, View } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ChatScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: 'Messages',
          headerShown: true,
        }}
      />
      <ScrollView>
        {/* Recent Chats */}
        <View style={{ padding: 16 }}>
          {/* TODO: Add ChatList component */}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
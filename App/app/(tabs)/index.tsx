import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore } from '@store/auth.store';
import { Button } from '@/components/ui/button';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImage}>
            {/* TODO: Add profile image component */}
          </View>
          <ThemedText style={styles.name}>{user?.name || 'Student'}</ThemedText>
          <ThemedText style={styles.email}>{user?.email}</ThemedText>
        </View>

        {/* Profile Sections */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          {/* TODO: Add personal info section */}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
          {/* TODO: Add preferences section */}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
          {/* TODO: Add settings section */}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button 
            onPress={logout}
            variant="destructive"
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  logoutContainer: {
    padding: 16,
    marginTop: 20,
  },
});

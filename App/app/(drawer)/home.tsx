import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchBar } from '@/components/ui/search-bar';
import { FilterChips } from '@/components/ui/filter-chips';
import { RoomCard } from '@/components/ui/room-card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { mockRooms, roomFilters } from '@/src/constants/mock-data';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
  const [refreshing, setRefreshing] = useState(false);

  // Filter rooms based on search query and selected filters
  const filteredRooms = mockRooms.filter(room => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        room.title.toLowerCase().includes(query) ||
        room.location.address.toLowerCase().includes(query) ||
        room.location.city.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Handle filter selection
  const handleFilterToggle = (filterId: string) => {
    if (filterId === 'all') {
      setSelectedFilters(['all']);
    } else {
      const newFilters = selectedFilters.filter(id => id !== 'all');
      if (newFilters.includes(filterId)) {
        newFilters.splice(newFilters.indexOf(filterId), 1);
      } else {
        newFilters.push(filterId);
      }
      setSelectedFilters(newFilters.length ? newFilters : ['all']);
    }
  };

  // Handle refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Find Your Perfect Room',
          headerLargeTitle: true,
          headerSearchBarOptions: {
            placeholder: 'Search rooms...',
          },
        }}
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme].text}
          />
        }>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by location, price, or features..."
            onFilterPress={() => {/* TODO: Show filter modal */}}
          />
        </View>

        {/* Filters */}
        <FilterChips
          filters={roomFilters}
          selectedIds={selectedFilters}
          onToggle={handleFilterToggle}
        />

        {/* Room Listings */}
        <View style={styles.listContainer}>
          {filteredRooms.length === 0 ? (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                No rooms found. Try adjusting your filters.
              </ThemedText>
            </View>
          ) : (
            filteredRooms.map(room => (
              <RoomCard
                key={room.id}
                id={room.id}
                title={room.title}
                price={room.price}
                location={room.location.address}
                imageUrl={`${room.images[0]}?w=800&q=80`}
                rating={room.rating}
                tags={room.amenities.slice(0, 2)}
                onSave={() => {/* TODO: Implement save functionality */}}
              />
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  listContainer: {
    padding: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
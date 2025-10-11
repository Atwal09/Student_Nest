import { View, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { SearchBar } from '@/components/ui/search-bar';
import { FilterChips } from '@/components/ui/filter-chips';
import { RoomCard } from '@/components/ui/room-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockRooms } from '@/src/constants/mock-data';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SearchBar 
        placeholder="Search rooms..." 
        onSearch={(text) => console.log('Search:', text)} 
      />
      <FilterChips 
        filters={['Nearby', 'Best Deals', 'Featured']}
        onFilterSelect={(filter) => console.log('Selected filter:', filter)}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Available Rooms
          </ThemedText>
          {mockRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onPress={() => console.log('Room selected:', room.id)}
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
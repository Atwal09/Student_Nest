import { View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';

export default function RoomSharingScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Room Sharing Network
          </ThemedText>
          
          <Button 
            title="Post Sharing Request"
            onPress={() => console.log('Post sharing request')}
            style={{ marginBottom: 16 }}
          />

          <ThemedText style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            Potential Roommates
          </ThemedText>
          
          {/* Roommate matches will be rendered here */}
          <ThemedText style={{ color: 'gray' }}>
            No matches found yet. Post a sharing request to find roommates!
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
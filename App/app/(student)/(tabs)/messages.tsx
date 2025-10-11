import { View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

type ChatPreview = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
};

const mockChats: ChatPreview[] = [
  {
    id: '1',
    name: 'John Owner',
    lastMessage: 'Yes, the room is still available',
    timestamp: '10:30 AM',
    unread: true,
  },
  {
    id: '2',
    name: 'Alice Potential Roommate',
    lastMessage: 'I\'m interested in sharing the apartment',
    timestamp: 'Yesterday',
    unread: false,
  },
];

export default function MessagesScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {mockChats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
              onPress={() => console.log('Open chat:', chat.id)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ fontSize: 16, fontWeight: chat.unread ? 'bold' : 'normal' }}>
                  {chat.name}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: 'gray' }}>
                  {chat.timestamp}
                </ThemedText>
              </View>
              <ThemedText
                style={{
                  marginTop: 4,
                  color: chat.unread ? 'black' : 'gray',
                }}
                numberOfLines={1}
              >
                {chat.lastMessage}
              </ThemedText>
              {chat.unread && (
                <View style={{
                  position: 'absolute',
                  right: 16,
                  top: 16,
                  backgroundColor: '#007AFF',
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                }} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
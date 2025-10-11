import { View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';

type Request = {
  id: string;
  type: 'booking' | 'visit';
  propertyName: string;
  studentName: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
};

const mockRequests: Request[] = [
  {
    id: '1',
    type: 'booking',
    propertyName: 'Sunset Apartments Room 301',
    studentName: 'John Doe',
    date: '2023-10-15',
    status: 'pending',
  },
  {
    id: '2',
    type: 'visit',
    propertyName: 'Student Housing Block B',
    studentName: 'Jane Smith',
    date: '2023-10-16 14:00',
    status: 'approved',
  },
];

export default function RequestsScreen() {
  const renderRequest = (request: Request) => {
    const statusColor = {
      pending: '#FFC107',
      approved: '#4CAF50',
      rejected: '#F44336',
    }[request.status];

    return (
      <View
        key={request.id}
        style={{
          padding: 16,
          backgroundColor: 'white',
          borderRadius: 8,
          marginBottom: 16,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <ThemedText style={{ fontSize: 16, fontWeight: 'bold' }}>
            {request.type === 'booking' ? '🏠 Booking Request' : '👀 Visit Request'}
          </ThemedText>
          <ThemedText style={{ color: statusColor, textTransform: 'capitalize' }}>
            {request.status}
          </ThemedText>
        </View>

        <ThemedText style={{ marginBottom: 4 }}>
          {request.propertyName}
        </ThemedText>
        <ThemedText style={{ color: 'gray', marginBottom: 8 }}>
          by {request.studentName}
        </ThemedText>
        <ThemedText style={{ color: 'gray', marginBottom: 12 }}>
          {request.date}
        </ThemedText>

        {request.status === 'pending' && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              onPress={() => console.log('Approve request:', request.id)}
              style={{ flex: 1, backgroundColor: '#4CAF50' }}
            >
              Approve
            </Button>
            <Button
              onPress={() => console.log('Reject request:', request.id)}
              style={{ flex: 1, backgroundColor: '#F44336' }}
            >
              Reject
            </Button>
          </View>
        )}
      </View>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Requests
        </ThemedText>
        {mockRequests.map(renderRequest)}
      </ScrollView>
    </ThemedView>
  );
}
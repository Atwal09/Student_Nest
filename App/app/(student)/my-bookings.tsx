import { View, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';

type Booking = {
  id: string;
  propertyName: string;
  status: 'active' | 'pending' | 'completed';
  checkIn: string;
  checkOut: string;
  price: number;
};

const mockBookings: Booking[] = [
  {
    id: '1',
    propertyName: 'Sunset Apartments Room 301',
    status: 'active',
    checkIn: '2023-09-01',
    checkOut: '2024-08-31',
    price: 15000,
  },
  {
    id: '2',
    propertyName: 'Student Housing Block B',
    status: 'pending',
    checkIn: '2023-10-01',
    checkOut: '2024-09-30',
    price: 12000,
  },
];

export default function MyBookingsScreen() {
  const renderBooking = (booking: Booking) => {
    const statusColor = {
      active: '#4CAF50',
      pending: '#FFC107',
      completed: '#9E9E9E',
    }[booking.status];

    return (
      <View
        key={booking.id}
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
        <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>
          {booking.propertyName}
        </ThemedText>
        
        <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <ThemedText style={{ color: 'gray' }}>Check-in</ThemedText>
            <ThemedText>{booking.checkIn}</ThemedText>
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={{ color: 'gray' }}>Check-out</ThemedText>
            <ThemedText>{booking.checkOut}</ThemedText>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: statusColor,
                marginRight: 8,
              }}
            />
            <ThemedText style={{ textTransform: 'capitalize' }}>
              {booking.status}
            </ThemedText>
          </View>
          <ThemedText style={{ fontWeight: 'bold' }}>
            ₹{booking.price}/month
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <ThemedText style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          My Bookings
        </ThemedText>
        {mockBookings.map(renderBooking)}
      </ScrollView>
    </ThemedView>
  );
}
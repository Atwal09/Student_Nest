import { View, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/ui/room-card';

type Property = {
  id: string;
  name: string;
  address: string;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
  images: string[];
};

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Sunset Apartments Room 301',
    address: '123 College Street, Campus Area',
    price: 15000,
    status: 'available',
    images: ['https://example.com/room1.jpg'],
  },
  {
    id: '2',
    name: 'Student Housing Block B',
    address: '456 University Road',
    price: 12000,
    status: 'occupied',
    images: ['https://example.com/room2.jpg'],
  },
];

export default function PropertiesScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>
              My Properties
            </ThemedText>
            <Link href="/post-property" asChild>
              <Button>Add New Property</Button>
            </Link>
          </View>

          {mockProperties.map((property) => (
            <View
              key={property.id}
              style={{
                marginBottom: 16,
                backgroundColor: 'white',
                borderRadius: 8,
                overflow: 'hidden',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <RoomCard
                key={property.id}
                title={property.name}
                address={property.address}
                price={property.price}
                imageUrl={property.images[0]}
                onPress={() => console.log('Property selected:', property.id)}
              />
              <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#eee' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <ThemedText style={{ 
                    textTransform: 'capitalize',
                    color: {
                      available: '#4CAF50',
                      occupied: '#FFC107',
                      maintenance: '#F44336',
                    }[property.status]
                  }}>
                    {property.status}
                  </ThemedText>
                  <Button onPress={() => console.log('Edit property:', property.id)}>
                    Edit
                  </Button>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
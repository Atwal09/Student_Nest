import { View, ScrollView, TextInput } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PostPropertyScreen() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    price: '',
    description: '',
    amenities: '',
    rules: '',
  });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const inputStyle = {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  };

  const labelStyle = {
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginBottom: 8,
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
          Post New Property
        </ThemedText>

        <ThemedText style={labelStyle}>Property Name</ThemedText>
        <TextInput
          style={inputStyle}
          placeholder="Enter property name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <ThemedText style={labelStyle}>Address</ThemedText>
        <TextInput
          style={[inputStyle, { height: 80 }]}
          placeholder="Enter complete address"
          multiline
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
        />

        <ThemedText style={labelStyle}>Monthly Rent (₹)</ThemedText>
        <TextInput
          style={inputStyle}
          placeholder="Enter monthly rent"
          keyboardType="numeric"
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
        />

        <ThemedText style={labelStyle}>Description</ThemedText>
        <TextInput
          style={[inputStyle, { height: 120 }]}
          placeholder="Describe your property"
          multiline
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
        />

        <ThemedText style={labelStyle}>Amenities</ThemedText>
        <TextInput
          style={[inputStyle, { height: 80 }]}
          placeholder="List available amenities (e.g., WiFi, AC, Parking)"
          multiline
          value={formData.amenities}
          onChangeText={(text) => setFormData({ ...formData, amenities: text })}
        />

        <ThemedText style={labelStyle}>Rules</ThemedText>
        <TextInput
          style={[inputStyle, { height: 80 }]}
          placeholder="Enter house rules"
          multiline
          value={formData.rules}
          onChangeText={(text) => setFormData({ ...formData, rules: text })}
        />

        <Button 
          onPress={handleSubmit}
          style={{ marginTop: 24, backgroundColor: '#4CAF50' }}
        >
          Post Property
        </Button>
      </ScrollView>
    </ThemedView>
  );
}
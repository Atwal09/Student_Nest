import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link } from 'expo-router';

interface RoomCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  rating?: number;
  tags: string[];
  isSaved?: boolean;
  onSave?: () => void;
}

export function RoomCard({
  id,
  title,
  price,
  location,
  imageUrl,
  rating,
  tags,
  isSaved,
  onSave,
}: RoomCardProps) {
  const colorScheme = useColorScheme();

  return (
    <Link href={`/(drawer)/room/${id}` as any} asChild>
      <Pressable>
        <View style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? 'light'].secondaryBackground }
        ]}>
          {/* Room Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            {onSave && (
              <Pressable
                style={styles.saveButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onSave();
                }}>
                <IconSymbol
                  name={isSaved ? 'heart.fill' : 'heart'}
                  size={24}
                  color={isSaved ? Colors.light.tint : Colors[colorScheme ?? 'light'].text}
                />
              </Pressable>
            )}
          </View>

          {/* Room Details */}
          <View style={styles.details}>
            <View style={styles.header}>
              <ThemedText style={styles.title} numberOfLines={1}>
                {title}
              </ThemedText>
              {rating && (
                <View style={styles.rating}>
                  <IconSymbol name="star.fill" size={16} color="#FFB800" />
                  <ThemedText style={styles.ratingText}>{rating}</ThemedText>
                </View>
              )}
            </View>

            <View style={styles.location}>
              <IconSymbol name="mappin" size={16} color={Colors[colorScheme ?? 'light'].text} />
              <ThemedText style={styles.locationText} numberOfLines={1}>
                {location}
              </ThemedText>
            </View>

            <View style={styles.footer}>
              <ThemedText style={styles.price}>
                ₹{price.toLocaleString()}<ThemedText style={styles.perMonth}>/month</ThemedText>
              </ThemedText>
              <View style={styles.tags}>
                {tags.slice(0, 2).map((tag, index) => (
                  <View 
                    key={index}
                    style={[
                      styles.tag,
                      { backgroundColor: Colors[colorScheme ?? 'light'].border }
                    ]}>
                    <ThemedText style={styles.tagText}>{tag}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  details: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  perMonth: {
    fontSize: 14,
    opacity: 0.7,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
  },
});
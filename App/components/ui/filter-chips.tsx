import React from 'react';
import { ScrollView, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface FilterChip {
  id: string;
  label: string;
}

interface FilterChipsProps {
  filters: FilterChip[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function FilterChips({ filters, selectedIds, onToggle }: FilterChipsProps) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {filters.map((filter) => {
        const isSelected = selectedIds.includes(filter.id);
        return (
          <Pressable
            key={filter.id}
            onPress={() => onToggle(filter.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? Colors[colorScheme].tint
                  : Colors[colorScheme].secondaryBackground,
              },
            ]}>
            <ThemedText
              style={[
                styles.label,
                {
                  color: isSelected
                    ? '#FFFFFF'
                    : Colors[colorScheme].text,
                },
              ]}>
              {filter.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
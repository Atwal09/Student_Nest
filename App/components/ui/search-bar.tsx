import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Search...',
}: SearchBarProps) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <View style={[
      styles.container,
      { backgroundColor: Colors[colorScheme].secondaryBackground }
    ]}>
      <IconSymbol
        name="magnifyingglass"
        size={20}
        color={Colors[colorScheme].icon}
        style={styles.searchIcon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors[colorScheme].icon}
        style={[
          styles.input,
          { color: Colors[colorScheme].text }
        ]}
      />
      {onFilterPress && (
        <Pressable
          onPress={onFilterPress}
          style={({ pressed }) => [
            styles.filterButton,
            pressed && styles.filterButtonPressed,
          ]}>
          <IconSymbol
            name="slider.horizontal.3"
            size={20}
            color={Colors[colorScheme].icon}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  filterButton: {
    marginLeft: 8,
    padding: 4,
  },
  filterButtonPressed: {
    opacity: 0.7,
  },
});
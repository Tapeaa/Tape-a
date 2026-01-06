import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/config';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function Switch({ value, onValueChange }: SwitchProps) {
  return (
    <TouchableOpacity
      style={[styles.container, value && styles.containerActive]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      <View style={[styles.thumb, value && styles.thumbActive]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  containerActive: {
    backgroundColor: Colors.primary,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
    transform: [{ translateX: 0 }],
  },
  thumbActive: {
    transform: [{ translateX: 20 }],
  },
});

import React from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View, TextInputProps as RNTextInputProps } from 'react-native';
import { Colors, Spacing } from '../constants/config';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: object;
}

export default function TextInput({ label, error, style, containerStyle, ...props }: TextInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.mutedForeground}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    backgroundColor: Colors.background,
    color: Colors.foreground,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: Spacing.xs,
  },
});

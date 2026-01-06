import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, Typography, Spacing } from '../constants/config';

type AuthWelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AuthWelcome'
>;

interface Props {
  navigation: AuthWelcomeScreenNavigationProp;
}

export default function AuthWelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>TĀPE'A</Text>

        <Text style={styles.subtitle}>Votre application de transport</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('AuthLogin')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('AuthRegister')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl * 3,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.logoGreen,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 48,
    height: 48,
  },
  title: {
    ...Typography.h1,
    fontSize: 48,
    color: Colors.foreground,
    marginBottom: Spacing.md,
    letterSpacing: -1,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: Spacing.xl * 3,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 320,
    gap: Spacing.md,
  },
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.yellowButton,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground,
  },
  registerButton: {
    width: '100%',
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground,
  },
});

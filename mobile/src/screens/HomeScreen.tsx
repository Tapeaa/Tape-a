import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { Colors, Typography, Spacing } from '../constants/config';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { client, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // La navigation sera gérée automatiquement par AppNavigator
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Bienvenue {client?.firstName || ''} {client?.lastName || ''} !
        </Text>

        <Text style={styles.subtitle}>
          Page d'accueil - TĀPE'A
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Numéro de téléphone</Text>
          <Text style={styles.infoValue}>{client?.phone || 'N/A'}</Text>
        </View>

        <Text style={styles.note}>
          Cette page sera complétée avec la carte Google Maps et les fonctionnalités de commande dans les prochaines phases.
        </Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  logo: {
    height: 75,
    width: 'auto',
    aspectRatio: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  welcomeText: {
    ...Typography.h2,
    fontSize: 28,
    color: Colors.foreground,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.muted,
    marginBottom: Spacing.xl,
  },
  infoCard: {
    backgroundColor: Colors.input,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.foreground,
  },
  note: {
    ...Typography.small,
    color: Colors.muted,
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  logoutButton: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.yellowButton,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground,
  },
});

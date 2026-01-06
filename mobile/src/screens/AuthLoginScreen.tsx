import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput as RNTextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { Colors, Typography, Spacing } from '../constants/config';
import TextInput from '../components/TextInput';

type AuthLoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AuthLogin'
>;

interface Props {
  navigation: AuthLoginScreenNavigationProp;
}

const loginSchema = z.object({
  phone: z
    .string()
    .min(6, 'Minimum 6 chiffres')
    .max(8, 'Maximum 8 chiffres')
    .regex(/^\d+$/, 'Uniquement des chiffres'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AuthLoginScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const phone = `+689${data.phone.replace(/\s/g, '')}`;
      const result = await login(phone, data.password);

      if (result.success) {
        // La navigation sera gérée automatiquement par AppNavigator
        // car isAuthenticated sera mis à jour
      } else {
        Alert.alert('Erreur de connexion', result.error || 'Identifiants incorrects');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Connexion</Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.phoneInputContainer}>
                <Text style={styles.label}>Numéro de téléphone</Text>
                <View style={styles.phoneInputWrapper}>
                  <View style={styles.phonePrefix}>
                    <Text style={styles.phonePrefixText}>PF</Text>
                    <Text style={styles.phonePrefixCode}>+689</Text>
                  </View>
                  <RNTextInput
                    style={styles.phoneInput}
                    placeholder="87 12 34 56"
                    placeholderTextColor={Colors.mutedForeground}
                    keyboardType="numeric"
                    maxLength={8}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Mot de passe"
                placeholder="Votre mot de passe"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              // Navigation vers mot de passe oublié - à implémenter plus tard
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <View style={styles.registerLink}>
            <Text style={styles.registerLinkText}>Pas encore de compte ? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AuthRegister')}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLinkButton}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  backButton: {
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.foreground,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl * 3,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.logoGreen,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    ...Typography.h2,
    fontSize: 32,
    color: Colors.foreground,
    marginBottom: Spacing.xl * 2,
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.foreground,
    marginBottom: Spacing.xs,
  },
  phoneInputContainer: {
    marginBottom: Spacing.md,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.input,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  phonePrefixText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.foreground,
  },
  phonePrefixCode: {
    fontSize: 14,
    color: Colors.muted,
  },
  phoneInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.foreground,
    paddingHorizontal: Spacing.md,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: Spacing.xs,
  },
  submitButton: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.yellowButton,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground,
  },
  linkButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: Colors.muted,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  registerLinkText: {
    fontSize: 14,
    color: Colors.muted,
  },
  registerLinkButton: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.yellowButton,
  },
});

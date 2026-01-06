import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput as RNTextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { Colors, Typography, Spacing } from '../constants/config';
import TextInput from '../components/TextInput';
import Switch from '../components/Switch';

type AuthRegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AuthRegister'
>;

interface Props {
  navigation: AuthRegisterScreenNavigationProp;
}

const registerSchema = z
  .object({
    phone: z
      .string()
      .min(6, 'Minimum 6 chiffres')
      .max(8, 'Maximum 8 chiffres')
      .regex(/^\d+$/, 'Uniquement des chiffres'),
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
    password: z.string().min(6, 'Minimum 6 caractères'),
    confirmPassword: z.string().min(1, 'Confirmez le mot de passe'),
    acceptTerms: z.boolean().refine((val) => val === true, 'Vous devez accepter les conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthRegisterScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { register: authRegister } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phone: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const phone = `+689${data.phone.replace(/\s/g, '')}`;
      const result = await authRegister(phone, data.firstName, data.lastName, data.password);

      if (result.success) {
        // La navigation sera gérée automatiquement par AppNavigator
        // car isAuthenticated sera mis à jour
      } else {
        Alert.alert('Erreur d\'inscription', result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
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
        <Text style={styles.title}>Créer un compte</Text>

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
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nom"
                placeholder="Votre nom"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Prénom"
                placeholder="Votre prénom"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Mot de passe"
                placeholder="Minimum 6 caractères"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirmer le mot de passe"
                placeholder="Confirmez votre mot de passe"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <View style={styles.termsContainer}>
                <View style={styles.termsRow}>
                  <Text style={styles.termsText}>
                    J'accepte les{' '}
                    <Text style={styles.termsLink}>conditions d'utilisation</Text>
                  </Text>
                  <Switch value={value} onValueChange={onChange} />
                </View>
                {errors.acceptTerms && (
                  <Text style={styles.errorText}>{errors.acceptTerms.message}</Text>
                )}
              </View>
            )}
          />

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Inscription...' : "S'inscrire"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Déjà un compte ? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AuthLogin')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLinkButton}>Se connecter</Text>
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
  title: {
    ...Typography.h3,
    fontSize: 24,
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
  termsContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: Colors.foreground,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.yellowButton,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  submitButton: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.yellowButton,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl * 2,
  },
  loginLinkText: {
    fontSize: 14,
    color: Colors.muted,
  },
  loginLinkButton: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.yellowButton,
  },
});

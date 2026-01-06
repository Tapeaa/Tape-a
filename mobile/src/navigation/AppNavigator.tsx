import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthWelcomeScreen from '../screens/AuthWelcomeScreen';
import AuthLoginScreen from '../screens/AuthLoginScreen';
import AuthRegisterScreen from '../screens/AuthRegisterScreen';
import HomeScreen from '../screens/HomeScreen';

export type RootStackParamList = {
  AuthWelcome: undefined;
  AuthLogin: undefined;
  AuthRegister: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Pour le moment, on retourne null pendant le chargement
    // Plus tard, on pourra ajouter un écran de chargement
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        {isAuthenticated ? (
          // Utilisateur authentifié : afficher l'écran d'accueil
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // Utilisateur non authentifié : afficher les écrans d'authentification
          <>
            <Stack.Screen name="AuthWelcome" component={AuthWelcomeScreen} />
            <Stack.Screen name="AuthLogin" component={AuthLoginScreen} />
            <Stack.Screen name="AuthRegister" component={AuthRegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

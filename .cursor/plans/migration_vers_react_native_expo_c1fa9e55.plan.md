---
name: Migration vers React Native Expo
overview: "Migration de la web app vers React Native/Expo - Phase 1 Frontend uniquement : 4 pages (choix connexion/inscription, connexion, inscription, accueil) avec toute la logique frontend (navigation, contexte, validation). Basé sur les fichiers existants de la web app."
todos:
  - id: setup-dependencies
    content: Installer les dépendances React Navigation, AsyncStorage, react-hook-form, zod dans mobile/package.json
    status: completed
  - id: create-auth-context
    content: Créer mobile/src/context/AuthContext.tsx adapté de la web app avec logique frontend (sans appels API réels pour le moment)
    status: completed
    dependencies:
      - setup-dependencies
  - id: create-navigation
    content: Créer mobile/src/navigation/AppNavigator.tsx avec stack navigation pour les écrans d'authentification
    status: completed
    dependencies:
      - setup-dependencies
  - id: create-welcome-screen
    content: Créer mobile/src/screens/AuthWelcomeScreen.tsx en reproduisant le design de AuthWelcome.tsx
    status: completed
    dependencies:
      - create-navigation
      - setup-dependencies
  - id: create-login-screen
    content: Créer mobile/src/screens/AuthLoginScreen.tsx avec formulaire react-hook-form et validation Zod, design identique à AuthLogin.tsx
    status: completed
    dependencies:
      - create-auth-context
      - create-navigation
  - id: create-register-screen
    content: Créer mobile/src/screens/AuthRegisterScreen.tsx avec formulaire complet et validation, design identique à AuthRegister.tsx
    status: completed
    dependencies:
      - create-auth-context
      - create-navigation
  - id: create-home-screen
    content: Créer mobile/src/screens/HomeScreen.tsx basé sur client/src/pages/Accueil.tsx (design simplifié, sans Google Maps pour le moment)
    status: completed
    dependencies:
      - create-auth-context
      - create-navigation
  - id: update-app-tsx
    content: Modifier mobile/App.tsx pour intégrer AuthProvider et AppNavigator avec navigation vers les 4 pages
    status: completed
    dependencies:
      - create-auth-context
      - create-navigation
      - create-home-screen
  - id: copy-assets
    content: Copier les assets (logo) dans mobile/assets/ et configurer l'utilisation dans les écrans
    status: completed
    dependencies:
      - create-welcome-screen
      - create-login-screen
  - id: configure-expo
    content: Mettre à jour mobile/app.json avec configuration Expo (pas encore de variables d'environnement API pour cette phase)
    status: completed
---

# Migration vers React Native/Expo - Pages d'Authentification

## Vue d'ensemble

Migration de la web app TĀPE'A vers React Native/Expo, en conservant le design identique et la logique existante.

**Phase 1 - Frontend uniquement :** Implémentation de 4 pages avec toute la logique frontend (navigation, contexte, validation) :

1. Page choix connexion/inscription (AuthWelcome)
2. Page connexion (AuthLogin)
3. Page inscription (AuthRegister)
4. Page accueil après connexion (Accueil)

**Note :** Pour cette phase, on se concentre uniquement sur le frontend. L'intégration avec l'API backend sera faite dans une phase ultérieure.

## Architecture

- **Frontend Mobile** : React Native avec Expo (dossier `mobile/`)
- **Backend API** : Express existant sur Railway (URL à configurer)
- **Base de données** : PostgreSQL sur Railway
- Host : `yamanote.proxy.rlwy.net:17932`
- Format DATABASE_URL : `postgresql://user:password@yamanote.proxy.rlwy.net:17932/database`
- **Authentification** : Tokens JWT ou session ID dans les headers (adaptation du backend)

## Modifications Backend

**⚠️ Phase ultérieure :** Les modifications backend (support tokens, création utilisateur de test) seront faites après la phase frontend.

### 1. Support des tokens d'authentification pour mobile (Phase 2)

Modifier `server/routes.ts` pour accepter les tokens dans les headers en plus des cookies :

- Ajouter support `Authorization: Bearer <token>` pour `/api/auth/login` et `/api/auth/register`
- Retourner un token dans la réponse pour mobile
- Modifier `/api/auth/me` pour accepter les tokens

### 2. Création utilisateur de test (Phase 2)

Créer un script ou modifier la route d'inscription pour créer un utilisateur de test avec :

- ID : `123` (ou utiliser l'ID généré par la base)
- Téléphone : `+689123` ou `123`
- Mot de passe : `123`
- Prénom/Nom : Valeurs de test

## Structure Mobile (dossier `mobile/`)

### Fichiers à créer/modifier (Phase 1 - Frontend uniquement)

1. **`mobile/App.tsx`** - Navigation principale avec React Navigation
2. **`mobile/src/navigation/AppNavigator.tsx`** - Configuration navigation avec stack pour les 4 pages
3. **`mobile/src/screens/AuthWelcomeScreen.tsx`** - Page choix connexion/inscription (basé sur `client/src/pages/auth/AuthWelcome.tsx`)
4. **`mobile/src/screens/AuthLoginScreen.tsx`** - Page de connexion (basé sur `client/src/pages/auth/AuthLogin.tsx`)
5. **`mobile/src/screens/AuthRegisterScreen.tsx`** - Page d'inscription (basé sur `client/src/pages/auth/AuthRegister.tsx`)
6. **`mobile/src/screens/HomeScreen.tsx`** - Page d'accueil après connexion (basé sur `client/src/pages/Accueil.tsx`)
7. **`mobile/src/context/AuthContext.tsx`** - Contexte d'authentification frontend (adapté de `client/src/lib/AuthContext.tsx`, mais sans appels API réels pour le moment)
8. **`mobile/src/components/`** - Composants UI réutilisables (boutons, inputs, etc.)
9. **`mobile/src/constants/config.ts`** - Configuration (couleurs, styles, etc.)
10. **`mobile/assets/`** - Images/assets (logo, etc.)

### Dépendances à ajouter

- `@react-navigation/native` et `@react-navigation/native-stack`
- `react-native-screens` et `react-native-safe-area-context`
- `@react-native-async-storage/async-storage` (stockage tokens)
- `react-hook-form` et `@hookform/resolvers/zod` (validation formulaires)
- `zod` (validation)
- `expo-image` (images)
- `expo-linear-gradient` (si nécessaire pour les styles)

## Design à reproduire

Copier fidèlement le design en se basant sur les fichiers existants :

- **`client/src/pages/auth/AuthWelcome.tsx`** → `AuthWelcomeScreen.tsx` - Logo vert (#1a472a), titre "TĀPE'A", boutons jaune (#F5C400)
- **`client/src/pages/auth/AuthLogin.tsx`** → `AuthLoginScreen.tsx` - Formulaire téléphone (+689) et mot de passe
- **`client/src/pages/auth/AuthRegister.tsx`** → `AuthRegisterScreen.tsx` - Formulaire complet avec validation
- **`client/src/pages/Accueil.tsx`** → `HomeScreen.tsx` - Page d'accueil après connexion (design simplifié pour le moment, sans Google Maps)

## Logique à conserver

- Validation Zod identique (téléphone 6-8 chiffres, mot de passe min 6 caractères)
- Format téléphone : `+689` + numéro
- Gestion des erreurs et toasts
- Navigation entre les écrans
- États de chargement

## Configuration

- Configuration Expo (`app.json`) pour les icônes et splash screen
- Constants de configuration (`mobile/src/constants/config.ts`) pour les couleurs et styles (pas encore d'URL API pour cette phase)
- Base de données PostgreSQL sur Railway : `yamanote.proxy.rlwy.net:17932` (pour référence future)
- **Phase 2 :** Variable d'environnement `EXPO_PUBLIC_API_URL` pour l'URL Railway (backend API)
- **Phase 2 :** Variable d'environnement `DATABASE_URL` pour le backend (format complet avec credentials)

## Tests

Utiliser les identifiants de test :

- Téléphone/ID : `123`
- Mot de passe : `123`
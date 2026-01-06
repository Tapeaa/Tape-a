// Configuration des couleurs et constantes de l'application

export const Colors = {
  // Couleurs principales
  primary: '#F5C400', // Jaune principal (boutons)
  primaryDark: '#e0b400', // Jaune foncé (hover)
  background: '#FFFFFF',
  foreground: '#000000',
  
  // Couleurs secondaires
  logoGreen: '#1a472a', // Vert du logo
  muted: '#6b7280', // Texte secondaire
  mutedForeground: '#9ca3af',
  
  // Couleurs UI
  border: '#e5e7eb',
  input: '#f3f4f6',
  
  // Couleurs spécifiques
  yellowButton: '#F5C400',
  yellowButtonHover: '#e0b400',
  textDark: '#343434',
  textMedium: '#5c5c5c',
  textLight: '#8c8c8c',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  h1: {
    fontSize: 48,
    fontWeight: '900' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 32,
    fontWeight: '800' as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
};

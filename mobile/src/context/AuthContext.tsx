import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiPost, apiGet, setToken, clearToken } from '../api/client';

export interface Client {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string | null;
  avatarUrl: string | null;
}

export interface AuthResult {
  success: boolean;
  needsVerification?: boolean;
  phone?: string;
  error?: string;
  client?: Client;
  devCode?: string;
}

export interface AuthContextType {
  client: Client | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<AuthResult>;
  register: (phone: string, firstName: string, lastName: string, password: string) => Promise<AuthResult>;
  verify: (phone: string, code: string, type: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshClient: () => Promise<void>;
  setClientDirectly: (client: Client) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pour cette phase frontend uniquement, on simule la logique d'authentification
  // sans appels API réels. L'intégration API sera faite dans la phase 2.

  const setClientDirectly = (newClient: Client) => {
    setClient(newClient);
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const clientData = await apiGet<Client>('/api/auth/me', { requireAuth: true });
        setClient({
          id: clientData.id,
          phone: clientData.phone,
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          email: null,
          avatarUrl: null,
        });
      } catch (error) {
        // Pas de session active, l'utilisateur n'est pas connecté
        setClient(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (phone: string, password: string): Promise<AuthResult> => {
    try {
      const response = await apiPost<{ success: boolean; client: any; error?: string; needsVerification?: boolean; phone?: string; devCode?: string; token?: string }>(
        '/api/auth/login',
        { phone, password },
        { requireAuth: false }
      );
      
      if (response.success && response.client) {
        // Stocker le token si présent
        if (response.token) {
          await setToken(response.token);
        }
        
        const clientData: Client = {
          id: response.client.id,
          phone: response.client.phone,
          firstName: response.client.firstName,
          lastName: response.client.lastName,
          email: null,
          avatarUrl: null,
        };
        setClient(clientData);
        return { success: true, client: clientData };
      }
      
      if (response.needsVerification) {
        return {
          success: false,
          needsVerification: true,
          phone: response.phone,
          devCode: response.devCode,
          error: response.error,
        };
      }
      
      return { success: false, error: response.error || 'Identifiants incorrects' };
    } catch (error: any) {
      const errorMessage = error.data?.error || error.message || 'Erreur de connexion';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    phone: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const response = await apiPost<{ success: boolean; client: any; error?: string; token?: string }>(
        '/api/auth/register',
        { phone, firstName, lastName, password },
        { requireAuth: false }
      );
      
      if (response.success && response.client) {
        // Stocker le token si présent
        if (response.token) {
          await setToken(response.token);
        }
        
        const clientData: Client = {
          id: response.client.id,
          phone: response.client.phone,
          firstName: response.client.firstName,
          lastName: response.client.lastName,
          email: null,
          avatarUrl: null,
        };
        setClient(clientData);
        return { success: true, client: clientData };
      }
      
      return { success: false, error: response.error || 'Erreur lors de l\'inscription' };
    } catch (error: any) {
      let errorMessage = error.data?.error || error.message || 'Erreur lors de l\'inscription';
      
      // Messages d'erreur plus clairs
      if (error.status === 502) {
        errorMessage = 'Le serveur backend n\'est pas accessible. Vérifiez que le backend est démarré.';
      } else if (error.status === 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      } else if (error.status === 409) {
        errorMessage = error.data?.error || 'Ce numéro de téléphone est déjà utilisé';
      } else if (error.message === 'Erreur de connexion au serveur') {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const verify = async (phone: string, code: string, type: string): Promise<AuthResult> => {
    try {
      const response = await apiPost<{ success: boolean; client: any; error?: string; token?: string }>(
        '/api/auth/verify',
        { phone, code, type },
        { requireAuth: false }
      );
      
      if (response.success && response.client) {
        // Stocker le token si présent
        if (response.token) {
          await setToken(response.token);
        }
        
        const clientData: Client = {
          id: response.client.id,
          phone: response.client.phone,
          firstName: response.client.firstName,
          lastName: response.client.lastName,
          email: null,
          avatarUrl: null,
        };
        setClient(clientData);
        return { success: true, client: clientData };
      }
      
      return { success: false, error: response.error || 'Code invalide' };
    } catch (error: any) {
      const errorMessage = error.data?.error || error.message || 'Erreur de vérification';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await apiPost('/api/auth/logout', {}, { requireAuth: true });
    } catch (error) {
      // Ignorer les erreurs de logout
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      await clearToken();
      setClient(null);
    }
  };

  const refreshClient = async () => {
    try {
      const clientData = await apiGet<Client>('/api/auth/me', { requireAuth: true });
      setClient({
        id: clientData.id,
        phone: clientData.phone,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        email: null,
        avatarUrl: null,
      });
    } catch (error) {
      // Session expirée ou erreur
      setClient(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        client,
        isLoading,
        isAuthenticated: !!client,
        login,
        register,
        verify,
        logout,
        refreshClient,
        setClientDirectly,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de l'URL de l'API
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://mysql-v9ol-api-back-end.up.railway.app';

// Clé pour stocker le token dans AsyncStorage
const TOKEN_STORAGE_KEY = '@tapea_auth_token';

/**
 * Récupère le token d'authentification depuis AsyncStorage
 */
export async function getToken(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    return token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
}

/**
 * Stocke le token d'authentification dans AsyncStorage
 */
export async function setToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Erreur lors du stockage du token:', error);
    throw error;
  }
}

/**
 * Supprime le token d'authentification depuis AsyncStorage
 */
export async function clearToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression du token:', error);
    throw error;
  }
}

/**
 * Effectue une requête API avec gestion automatique du token
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, string>;
    requireAuth?: boolean;
  } = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    requireAuth = true,
  } = options;

  // Construire l'URL complète
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  // Récupérer le token si nécessaire et l'envoyer dans le header Authorization
  let authHeaders: Record<string, string> = {};
  if (requireAuth) {
    const token = await getToken();
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Préparer les headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...headers,
  };

  // Préparer les options de la requête
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Ajouter le body si présent
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    
    // Gérer les réponses non-JSON (comme les erreurs 204 No Content)
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    let data: any;
    if (isJson) {
      data = await response.json();
    } else {
      // Pour les réponses non-JSON, retourner un objet avec le statut
      data = { success: response.ok, status: response.status };
    }

    // Si la réponse n'est pas OK, lever une erreur
    if (!response.ok) {
      const error = new Error(data.error || `Erreur HTTP: ${response.status}`);
      (error as any).status = response.status;
      (error as any).data = data;
      throw error;
    }

    return data as T;
  } catch (error: any) {
    // Si c'est déjà une erreur que nous avons créée, la relancer
    if (error.status) {
      throw error;
    }
    
    // Sinon, c'est une erreur réseau ou autre
    console.error('Erreur lors de la requête API:', error);
    throw new Error('Erreur de connexion au serveur');
  }
}

/**
 * Fonction utilitaire pour les requêtes GET
 */
export async function apiGet<T = any>(
  endpoint: string,
  options?: { headers?: Record<string, string>; requireAuth?: boolean }
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', ...options });
}

/**
 * Fonction utilitaire pour les requêtes POST
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options?: { headers?: Record<string, string>; requireAuth?: boolean }
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body, ...options });
}

/**
 * Fonction utilitaire pour les requêtes PUT
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: any,
  options?: { headers?: Record<string, string>; requireAuth?: boolean }
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PUT', body, ...options });
}

/**
 * Fonction utilitaire pour les requêtes DELETE
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options?: { headers?: Record<string, string>; requireAuth?: boolean }
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE', ...options });
}

/**
 * Fonction utilitaire pour les requêtes PATCH
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: any,
  options?: { headers?: Record<string, string>; requireAuth?: boolean }
): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'PATCH', body, ...options });
}

// Export de l'URL de l'API pour utilisation dans d'autres modules
export { API_URL };

import { storeToken } from '@src/utils/tokenUtils';
import axios from 'axios';
import { fetchUserProfile } from './apiService';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const API_VERSION = import.meta.env.VITE_API_VERSION || "api/v1";

export const apiService = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 
 * @param email 
 * @param password 
 * @param rememberMe 
 * @returns 
 */
export const login = async (email: string, password: string, rememberMe: boolean) => {
  const { data } = await apiService.post(
    `/user/login`,
    { email, password, rememberMe },
    { withCredentials: true }
  );

  if (!data.success || !data.accessToken) {
    throw new Error(data.message || "Erreur inconnue lors de la connexion");
  }

    // Stocke l'accessToken selon l'option "Se souvenir de moi"
    storeToken(data.accessToken, rememberMe);

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken, // si applicable
    message: data.message,
  };
};

/**
 * 
 * @returns 
 */
export const refreshToken = async (): Promise<string> => {
  try {
    const response = await apiService.post("/user/refresh-token", {}, { withCredentials: true });
    const { accessToken } = response.data;
    console.log("Nouveau token récupéré :", accessToken);
    return accessToken; // Retourne le nouveau token
  } catch (error) {
    console.error("Erreur lors de la récupération du nouveau token :", error);
    throw new Error("Impossible de rafraîchir le token.");
  }
};

export const clearToken = () => {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessToken");
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  if (user) {
    return {
      authenticated: true,
      user: JSON.parse(user),
    };
  }
  return {
    authenticated: false,
    user: null,
  };
};



/* export const resetPassword = async (
  userId: string, 
  token: string, 
  password: string, 
  password_confirm: string
) => {
  try {

  console.log("API Call with userId:", userId);
  console.log("API Call with token:", token);
    const response = await apiService.post(`/user/resetpwd/${encodeURIComponent(userId)}/${encodeURIComponent(token)}`, {
      password,
      password_confirm,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Échec de la réinitialisation du mot de passe.");
    }

    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);

    return { success: true, message: response.data.message };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Erreur interne. Veuillez réessayer plus tard.");
  }
}; */

export const resetPassword = async (
  userId: string, 
  token: string, 
  password: string, 
  password_confirm: string
) => {
  try {
    const response = await apiService.post(`/user/resetpwd/${encodeURIComponent(userId)}/${encodeURIComponent(token)}`, {
      password,
      password_confirm,
    });

    if (response?.data?.success) {
      const { accessToken } = response.data;

      // Stockage sécurisé du token
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return { success: true, message: response.data.message };
    } else {
      throw new Error(response?.data?.message || "Erreur lors de la réinitialisation du mot de passe.");
    }
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Erreur interne." };
  }
};



/* export const loginUser = async (accessToken: string) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);

    try {
      const userProfile = await fetchUserProfile();
      setUserProfile(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur :", error);
      logout();  // Déconnexion en cas d'échec de récupération du profil
    }
  }
}; */



// logout the user
export const logout = () => {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  // Supprimer le cookie si utilisé pour stocker le refresh token
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Rediriger l'utilisateur vers la page de connexion
  window.location.href = "/login";
};

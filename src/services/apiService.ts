import axios from 'axios';
import { RegisterData } from '../types/RegisterData';
import { ReportsResponse } from '../types/Reports';
import { refreshToken } from './authService';
import { getAccessToken, storeToken, storeTokenInCurrentStorage } from '@src/utils/tokenUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const API_VERSION = import.meta.env.VITE_API_VERSION || "api/v1";

// Crée une instance d'axios avec la configuration de base
export const apiService = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fonction pour vérifier si un token est expiré
const isTokenExpired = (token: string): boolean => {
  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    return true; // Si une erreur survient, on considère le token comme expiré
  }
};


// Intercepteur de requêtes
apiService.interceptors.request.use(async (config) => {
  let token = getAccessToken();

  if (token && isTokenExpired(token)) {
    try {
      token = await refreshToken();
      if (token) {
        storeTokenInCurrentStorage(token); // Stocke dans l'emplacement actuel (localStorage ou sessionStorage)
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token :", error);
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      throw error;
    }
  }

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));



// Intercepteur de réponses
apiService.interceptors.response.use(
  (response) => response, // Retourne la réponse si elle est réussie
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Rafraîchir le token
        const newAccessToken = await refreshToken(); // Rafraîchit le token via l'API

        // Vérifiez où stocker le token
        const rememberMe = localStorage.getItem("accessToken") !== null; // Détermine si le stockage est local
        storeToken(newAccessToken, rememberMe);

        // Mettre à jour les headers
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiService(originalRequest); // Réessayer la requête originale
      } catch (refreshError) {
        console.error("Erreur lors du rafraîchissement du token :", refreshError);
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const registerUser = async (data: RegisterData): Promise<{ userId: string; email: string }> => {
  try {
    const response = await apiService.post('/user/register', data);
    console.log('Utilisateur inscrit avec succès :', response.data);
    const { userId, email } = response.data; // Assurez-vous que l'API renvoie userId et email
    return { userId, email };
  } catch (error: any) {
    // Vérifiez si le backend renvoie un message d'erreur
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error); // Transmettez l'erreur avec le bon message
    }
    throw new Error('Erreur inconnue lors de l’inscription.');
  }
};

export const confirmEmail = async (userId: string, token: string): Promise<any> => {
  try {
    const response = await apiService.post(`/user/mailValidation`, {
      userId, // Ajoutez l'userId dans le corps de la requête
      token,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Erreur de validation du code.";
  }
};

export const fetchReports = async (page: number, limit: number): Promise<ReportsResponse> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Utilisateur non authentifié.');
    }

    console.log('Token utilisé :', token);
    console.log('Page et limite :', page, limit);

    const response = await apiService.get(`/user/reports?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Réponse API brute :', response.data);

    // Assurez-vous que la réponse respecte le type ReportsResponse
    return response.data as ReportsResponse;
  } catch (error: any) {
    console.error('Erreur lors de l’appel à fetchReports :', error.response?.data || error.message);

    // Lève une erreur avec un message plus explicite
    throw new Error(error.response?.data?.error || 'Erreur lors du chargement des rapports.');
  }
};

// Fonction pour récupérer les coups de cœur
export const fetchCoupsdeCoeur = async (page: number, limit: number) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Utilisateur non authentifié.');
    }
    const response = await apiService.get(`/user/coupsdecoeur?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      coupsdeCoeur: response.data.coupdeCoeur,
      totalCoupsdeCoeur: response.data.totalCoupsdeCoeur,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des coups de cœur :", error);
    throw error;
  }
};

export const fetchSuggestions = async (page: number, limit: number) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Utilisateur non authentifié.');
    }
    const response = await apiService.get(`/user/suggestion?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      suggestions: response.data.suggestions,
      totalSuggestions: response.data.totalSuggestions,
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des suggestions :", error);
    throw error;
  }
};



export const updatePassword = async (passwordData: {
  old_password: string;
  password: string;
  password_confirm: string;
}) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Utilisateur non authentifié.");
  }

  const response = await apiService.put(`/user/pwd/me`, passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};


export const fetchUserProfile = async (): Promise<any> => {
  try {
    // Récupérer le token depuis localStorage ou sessionStorage
    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    // Appel API avec le token
    const response = await apiService.get("/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Réponse API brute :", response.data);

    if (!response.data) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    return response.data; // Retourne les données du profil
  } catch (error: any) {
    console.error("Erreur lors de l’appel à fetchUserProfile :", error.response?.data || error.message);

    // Lève une erreur explicite
    throw new Error(error.response?.data?.error || "Erreur lors du chargement du profil utilisateur.");
  }
};


export const updateUserProfile = async (formData: FormData) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    // Requête PUT avec axios
    const response = await apiService.put(`/user/me`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Obligatoire pour FormData
      },
    });

    return response.data; // Retourne les données de la réponse
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil :", error.response || error.message);
    throw new Error(error.response?.data?.error || "Erreur lors de la mise à jour du profil.");
  }
};

/**
 * Envoie un e-mail de réinitialisation de mot de passe
 * @param email - L'adresse e-mail de l'utilisateur
 * @returns Une promesse résolue en cas de succès ou rejetée en cas d'échec
 */
export const forgetPassword = async (email: string): Promise<void> => {
  try {
    const response = await apiService.post(`/user/forgot-password`, {
      email,
    });
    return response.data; // Renvoyer la réponse si nécessaire
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de l'e-mail de réinitialisation :", error);
    throw error.response?.data?.message || "Une erreur est survenue.";
  }
};

export const deleteAccount = async () => {
  const token = getAccessToken();
  if (!token) throw new Error("Utilisateur non authentifié.");

  await apiService.delete("/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



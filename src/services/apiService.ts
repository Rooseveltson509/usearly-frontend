import axios, { AxiosError } from "axios";
import { RegisterData } from "../types/RegisterData";
import { ReportsResponse } from "../types/Reports";
import { refreshToken } from "./authService";
import {
  getAccessToken,
  storeToken,
  storeTokenInCurrentStorage,
} from "@src/utils/tokenUtils";
import { UserProfile } from "@src/types/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
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
apiService.interceptors.request.use(
  async (config) => {
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
  },
  (error) => Promise.reject(error),
);

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
        console.error(
          "Erreur lors du rafraîchissement du token :",
          refreshError,
        );
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const registerUser = async (
  data: RegisterData,
): Promise<{ userId: string; email: string }> => {
  try {
    const response = await apiService.post<{ userId: string; email: string }>(
      "/user/register",
      data,
    );

    console.log("Utilisateur inscrit avec succès :", response.data);
    return response.data; // Assurez-vous que l'API renvoie userId et email correctement typés
  } catch (error: unknown) {
    let errorMessage = "Erreur inconnue lors de l’inscription.";

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("Erreur lors de l'inscription :", errorMessage);
    throw new Error(errorMessage);
  }
};

export const confirmEmail = async (
  userId: string,
  token: string,
): Promise<{ success: boolean; message: string; accessToken?: string }> => {
  try {
    const response = await apiService.post(`/user/mailValidation`, {
      userId,
      token,
    });

    const responseData = response.data;

    if (!responseData || !responseData.message) {
      throw new Error("Réponse de l'API invalide.");
    }

    return {
      success: true, // Supposons qu'une réponse valide signifie succès
      message: responseData.message,
      accessToken: responseData.accessToken, // Vérifier si l'API renvoie un token
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Erreur de validation du code.",
    );
  }
};

export const fetchReports = async (
  page: number,
  limit: number,
): Promise<ReportsResponse> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    console.log("Token utilisé :", token);
    console.log("Page et limite :", page, limit);

    const response = await apiService.get<ReportsResponse>(
      `/user/reports?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Réponse API brute :", response.data);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur lors de l’appel à fetchReports :",
        error.response?.data || error.message,
      );

      throw new Error(
        error.response?.data?.error ||
          "Erreur lors du chargement des rapports.",
      );
    } else if (error instanceof Error) {
      console.error("Erreur inconnue :", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Une erreur inconnue est survenue.");
    }
  }
};

// Fonction pour récupérer les coups de cœur
export const fetchCoupsdeCoeur = async (page: number, limit: number) => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }
    const response = await apiService.get(
      `/user/coupsdecoeur?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

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
      throw new Error("Utilisateur non authentifié.");
    }
    const response = await apiService.get(
      `/user/suggestion?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

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

export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    // Récupérer le token depuis localStorage ou sessionStorage
    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    // Appel API avec le token
    const response = await apiService.get<UserProfile>("/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Réponse API brute :", response.data);

    if (!response.data) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    return response.data; // Retourne les données du profil utilisateur
  } catch (error: unknown) {
    console.error(
      "Erreur lors de l’appel à fetchUserProfile :",
      error instanceof Error ? error.message : "Erreur inconnue",
    );

    if (error instanceof (await import("axios")).AxiosError) {
      throw new Error(
        error.response?.data?.error ||
          "Erreur lors du chargement du profil utilisateur.",
      );
    }

    throw new Error(
      "Erreur inattendue lors du chargement du profil utilisateur.",
    );
  }
};


export const fetchBrandProfile = async () => {
  const token =
    localStorage.getItem("brandAccessToken") ||
    sessionStorage.getItem("brandAccessToken");

  if (!token) {
    throw new Error("Aucun token trouvé pour la marque.");
  }

  const { data } = await apiService.get(`/brand/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const updateUserProfile = async (
  formData: FormData,
): Promise<{ success: boolean; user?: UserProfile; message?: string }> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    const response = await apiService.put(`/user/me`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Échec de la mise à jour du profil.",
      );
    }

    return response.data; // Retourne les données de la réponse
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur lors de la mise à jour du profil :",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du profil.",
      );
    } else if (error instanceof Error) {
      console.error(
        "Erreur inconnue lors de la mise à jour du profil :",
        error.message,
      );
      throw new Error(error.message);
    } else {
      throw new Error("Une erreur inconnue est survenue.");
    }
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

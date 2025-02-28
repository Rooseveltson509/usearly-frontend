import { getAccessToken, storeToken } from "@src/utils/tokenUtils";
import axios, { AxiosError } from "axios";
//import { fetchUserProfile } from './apiService';
import { ErrorResponse, ResetPasswordResponse } from "@src/types/types";
import { getCsrfToken } from "./csrfService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_VERSION = import.meta.env.VITE_API_VERSION || "api/v1";

export const apiService = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 *
 * @param email
 * @param password
 * @param rememberMe
 * @returns
 */
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  const { data } = await apiService.post(
    `/user/login`,
    { email, password, rememberMe },
    { withCredentials: true }
  );

  if (!data.success || !data.accessToken) {
    throw new Error(data.message || "Erreur inconnue lors de la connexion");
  }

  // Stocke l'accessToken selon l'option "Se souvenir de moi"
  storeToken(data.accessToken, rememberMe, "user");

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken, // si applicable
    message: data.message,
  };
};

/* Login en tant que marque */
export const loginBrand = async (
  email: string,
  mdp: string,
  rememberMe: boolean
) => {
  console.log("🔵 Tentative de connexion marque :", { email, mdp, rememberMe });

  try {
    const { data } = await apiService.post(
      `/brand/login`,
      { email, mdp, rememberMe },
      { withCredentials: true }
    );

    console.log("🟢 Réponse API reçue :", data);

    if (!data.success || !data.accessToken) {
      throw new Error(data.message || "Erreur inconnue lors de la connexion");
    }

    storeToken(data.accessToken, rememberMe, "brand");

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      message: data.message,
    };
  } catch (error) {
    console.error("🔴 Erreur de connexion marque :", error);
    throw new Error("Échec de la connexion marque");
  }
};

/**
 *
 * @returns
 */
export const refreshToken = async (): Promise<string> => {
  try {
    const csrfToken = await getCsrfToken(); // 🔥 Récupère le CSRF Token avant

    const response = await apiService.post(
      "/user/refresh-token",
      {},
      {
        withCredentials: true, // ✅ Envoie le cookie refreshToken
        headers: { "X-CSRF-Token": csrfToken }, // ✅ Ajoute le CSRF Token
      }
    );

    const { accessToken } = response.data;
    console.log("🔄 Nouveau token récupéré :", accessToken);
    return accessToken; // Retourne le nouveau token
  } catch (error) {
    console.error("❌ Erreur lors du rafraîchissement du token :", error);
    throw new Error("Impossible de rafraîchir le token.");
  }
};




export const clearToken = () => {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessToken");
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  const user = localStorage.getItem("user");
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

export const resetPassword = async (
  userId: string,
  token: string,
  password: string,
  password_confirm: string
): Promise<ResetPasswordResponse> => {
  try {
    const response = await apiService.post<ResetPasswordResponse>(
      `/user/resetpwd/${encodeURIComponent(userId)}/${encodeURIComponent(
        token
      )}`,
      {
        password,
        password_confirm,
      }
    );

    if (response.data?.success) {
      const { accessToken, message } = response.data;

      // Stockage sécurisé du token
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return {
        success: true,
        message: message || "Mot de passe réinitialisé avec succès.",
      };
    } else {
      throw new Error(
        response.data?.message ||
          "Erreur lors de la réinitialisation du mot de passe."
      );
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "Erreur interne.",
    };
  }
};

export const updatePassword = async (passwordData: {
  old_password: string;
  password: string;
  password_confirm: string;
}) => {
  try {
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

    if (!response.data.success) {
      throw new Error(
        response.data.error || "Erreur inconnue lors de la mise à jour."
      );
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.error ||
          "Une erreur s'est produite lors de la mise à jour du mot de passe."
      );
    }
    throw new Error("Erreur interne. Veuillez réessayer plus tard.");
  }
};

/**
 * Envoie un e-mail de réinitialisation de mot de passe
 * @param email - L'adresse e-mail de l'utilisateur
 * @returns Une promesse résolue en cas de succès ou rejetée en cas d'échec
 */
export const forgetPassword = async (email: string): Promise<void> => {
  try {
    const response = await apiService.post<{ message: string }>(
      `/user/forgot-password`,
      {
        email,
      }
    );
    console.log("Réponse de l'API :", response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Une erreur est survenue."
      );
    } else {
      throw new Error("Erreur interne. Veuillez réessayer plus tard.");
    }
  }
};

// logout the user
export const logout = () => {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  // Supprimer le cookie si utilisé pour stocker le refresh token
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Rediriger l'utilisateur vers la page de connexion
  window.location.href = "/login";
};

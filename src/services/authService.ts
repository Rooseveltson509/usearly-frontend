import { getAccessToken, storeToken } from "@src/utils/tokenUtils";
import axios, { AxiosError } from "axios";
//import { fetchUserProfile } from './apiService';
import { ErrorResponse, ResetPasswordResponse } from "@src/types/types";
import { getCsrfToken } from "./csrfService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_VERSION = import.meta.env.VITE_API_VERSION || "api/v1";

// ✅ Interface pour la réponse
interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken?: string; // normalement plus nécessaire si cookie
  user: {
    avatar: string;
    type: "user" | "brand";
  };
}

export const apiService = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ C’est ça qu’on ajoute ici
});

/**
 *
 * @param email
 * @param password
 * @param rememberMe
 * @returns
 */
export const loginAA = async (email: string, password: string, rememberMe: boolean) => {
  const csrfToken = await getCsrfToken();

  if (!csrfToken) {
    throw new Error("CSRF Token manquant.");
  }

   const { data } = await apiService.post(
     "/user/login",
     { email, password, rememberMe },
     {
       headers: {
         "X-CSRF-Token": csrfToken, // ✅ essentiel
       },
     }
   );


  if (!data.success || !data.accessToken) {
    throw new Error(data.message || "Erreur inconnue lors de la connexion");
  }

  storeToken(data.accessToken, rememberMe, "user");

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    message: data.message,
  };
};
/**
 * 🔐 Login user avec gestion de "Se souvenir de moi"
 */
export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
): Promise<LoginResponse> => {
  try {
    const { data } = await apiService.post<LoginResponse>(
      `/user/login`,
      { email, password, rememberMe },
      { withCredentials: true } // ✅ essentiel pour recevoir les cookies
    );

    if (!data.success || !data.accessToken) {
      throw new Error(data.message || "Erreur de connexion");
    }

    // 🗃️ Stockage local du accessToken
    storeToken(data.accessToken, rememberMe, data.user.type);

    return data;
  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error);
    throw new Error("Échec de la connexion.");
  }
};


/* export const login = async (email: string, password: string, rememberMe: boolean) => {
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
}; */

/* Login en tant que marque */
export const loginBrand = async (email: string, mdp: string, rememberMe: boolean) => {
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

    // Vérification de la présence de l'objet 'user' et de son type
    if (!data.user || !data.user.type) {
      throw new Error("Erreur : L'utilisateur n'a pas de type défini.");
    }

    const userType = data.user.type;
    console.log("Utilisateur connecté en tant que :", userType); // Afficher le type de l'utilisateur

    // Stocker le token et le type d'utilisateur (marque ou autre)
    if (rememberMe) {
      localStorage.setItem("accessToken", data.accessToken); // Utilisation d'un seul token pour tous
    } else {
      sessionStorage.setItem("accessToken", data.accessToken);
    }

    localStorage.setItem("userType", userType); // Enregistrer le type dans localStorage pour utilisation ultérieure

    // Retourner les informations importantes pour le frontend
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      message: data.message,
      user: data.user, // Retourner 'user' complet si nécessaire
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
/**
 * 🔁 Refresh le token d'accès en utilisant le cookie HTTP-only
 */
export const refreshToken = async (): Promise<string> => {
  try {
    console.log("🔄 Tentative de refresh token...");

    const csrfToken = await getCsrfToken();

    if (!csrfToken) {
      console.error("❌ CSRF Token introuvable !");
      throw new Error("CSRF Token manquant.");
    }

    console.log("✅ CSRF Token à envoyer :", csrfToken);

    const response = await apiService.post(
      "/user/refresh-token",
      {}, // aucun body requis
      {
        withCredentials: true, // ✅ on envoie les cookies (refreshToken)
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      }
    );

    const accessToken = response.data.accessToken;

    console.log("✅ Token d'accès rafraîchi :", accessToken);

    return accessToken;
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
      `/user/resetpwd/${encodeURIComponent(userId)}/${encodeURIComponent(token)}`,
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
        response.data?.message || "Erreur lors de la réinitialisation du mot de passe."
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
      throw new Error(response.data.error || "Erreur inconnue lors de la mise à jour.");
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
    const response = await apiService.post<{ message: string }>(`/user/forgot-password`, {
      email,
    });
    console.log("Réponse de l'API :", response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Une erreur est survenue.");
    } else {
      throw new Error("Erreur interne. Veuillez réessayer plus tard.");
    }
  }
};

// logout the user
/* export const logout = () => {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  // Supprimer le cookie si utilisé pour stocker le refresh token
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Rediriger l'utilisateur vers la page de connexion
  window.location.href = "/login";
}; */

export const logout = async () => {
  try {
    // Appel à l'API de déconnexion
    const response = await apiService.post("/user/logout", {}, { withCredentials: true });

    // Suppression des tokens et des données d'utilisateur stockées localement
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Supprimer le cookie du refresh token

    // Retourner la réponse pour que le composant puisse l'utiliser si besoin
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    throw error;
  }
};


/* export const logout = () => {
  // Supprimer les tokens de localStorage et sessionStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("brandAccessToken"); // Supprime également le token de la marque
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("brandAccessToken");

  // Supprimer les cookies si utilisés
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Rediriger l'utilisateur vers la page de connexion
  window.location.href = "/login";
}; */
/* export const logout = () => {
  // Supprimer les tokens de localStorage et sessionStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("brandAccessToken"); // Supprime également le token de la marque
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("brandAccessToken");

  // Supprimer le cookie refreshToken
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict;";

  // Vérification de la suppression du cookie (log)
  console.log("Cookie 'refreshToken' supprimé.");

  // Rediriger l'utilisateur vers la page de connexion
  window.location.href = "/login";
}; */

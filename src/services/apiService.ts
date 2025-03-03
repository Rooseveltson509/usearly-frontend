import axios, { AxiosError } from "axios";
import { RegisterData } from "../types/RegisterData";
import { CdcsResponse, ReportsResponse, User } from "../types/Reports";
import { refreshToken } from "./authService";
import {
  getAccessToken,
  storeToken,
  storeTokenInCurrentStorage,
} from "@src/utils/tokenUtils";
import {
  Brand,
  CommentType,
  Post,
  PostData,
  PostsResponse,
  UserProfile,
} from "@src/types/types";
import { CreateBrandData } from "@src/types/brand";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_VERSION = import.meta.env.VITE_API_VERSION || "api/v1";

// Crée une instance d'axios avec la configuration de base
export const apiService = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Fonction pour récupérer les headers d'authentification
export const authHeaders = () => {
  const token = getAccessToken();
  if (!token) throw new Error("Utilisateur non authentifié.");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Fonction pour vérifier si un token est expiré
export const isTokenExpired = (token: string): boolean => {
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
    console.log("🔍 Vérification du token avant requête :", token);

    if (token && isTokenExpired(token)) {
      console.log("⚠️ Token expiré, tentative de rafraîchissement...");
      try {
        token = await refreshToken(); // ✅ Rafraîchir immédiatement
        console.log("✅ Nouveau token après refresh :", token);

        if (token) {
          storeTokenInCurrentStorage(token); // ✅ Stocker le token dans localStorage/sessionStorage
        }
      } catch (error) {
        console.error("❌ Erreur lors du rafraîchissement du token :", error);
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
  (error) => Promise.reject(error)
);

// Intercepteur de réponses
apiService.interceptors.response.use(
  (response) => response, // ✅ Retourne la réponse si elle est réussie
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔄 401 détecté, tentative de rafraîchissement...");
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken(); // ✅ Rafraîchit le token via l'API
        console.log("✅ Nouveau token après 401 :", newAccessToken);

        const rememberMe = localStorage.getItem("accessToken") !== null; // ✅ Vérifie où stocker le token
        storeToken(newAccessToken, rememberMe);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiService(originalRequest); // ✅ Réessayer la requête originale
      } catch (refreshError) {
        console.error("❌ Erreur lors du rafraîchissement du token :", refreshError);
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export const registerUser = async (
  data: RegisterData
): Promise<{ userId: string; email: string }> => {
  try {
    const response = await apiService.post<{ userId: string; email: string }>(
      "/user/register",
      data
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
  token: string
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
      axiosError.response?.data?.message || "Erreur de validation du code."
    );
  }
};


// ✅ Récupérer tous les posts
export const fetchPosts = async (
  page = 1,
  limit = 5
): Promise<PostsResponse> => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("Utilisateur non authentifié.");

    const response = await apiService.get(
      `/user/posts?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // ✅ Retourne bien l'objet PostsResponse
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);

    // ✅ Retourne un objet vide respectant PostsResponse
    return { posts: [], totalPosts: 0, totalPages: 0, currentPage: page };
  }
};

// ✅ Créer un post
export const createPost = async (postData: PostData): Promise<Post> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }
    const response = await axios.post<Post>(
      `${API_BASE_URL}/${API_VERSION}/user/post`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du post :", error);
    throw error;
  }
};

export const createBrand = async (
  data: CreateBrandData
): Promise<{ success: boolean; brand?: Brand; error?: string }> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("mdp", data.mdp);
  formData.append("mdp_confirm", data.mdp_confirm);
  if (data.avatar) formData.append("avatar", data.avatar);

  console.log("📤 Données envoyées au backend :", [...formData.entries()]);

  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    const response = await axios.post(
      `${API_BASE_URL}/${API_VERSION}/admin/brand/new`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 🔥 Assure-toi que ton backend retourne bien la marque créée
    return { success: true, brand: response.data.brand };
  } catch (error: unknown) {
    console.error("Erreur API:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || "Erreur inconnue",
      };
    }

    return { success: false, error: "Erreur réseau ou serveur" };
  }
};

// Récupérer toutes les marques
export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("Utilisateur non authentifié.");

    const response = await apiService.get(`/admin/brand/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("📥 Marques reçues de l'API :", response.data); // ✅ Vérifie ici

    return response.data.brands;
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des marques :", error);
    return [];
  }
};

export const fetchBrandByName = async (brandName: string) => {
  try {
    const response = await apiService.get(`/brand/${brandName.toLowerCase()}`);
    return response.data; // ✅ Retourne { avatar, updatedAt }
  } catch (error: unknown) {
    const axiosError = error as AxiosError; // 🚀 Cast explicite en AxiosError

    if (axiosError.response?.status === 404) {
      console.warn(`🔍 Marque non trouvée: ${brandName}`);
    } else {
      console.error(
        `🚨 Erreur API pour ${brandName} (Code: ${axiosError.response?.status}):`,
        axiosError
      );
    }
    return null; // ✅ Retourne null proprement
  }
};

export const fetchPostLikes = async (postId: string) => {
  try {
    const response = await apiService.get(`/posts/${postId}/likes`);
    return response.data.likes; // Retourne le nombre total de likes
  } catch (error) {
    console.error(
      `❌ Erreur lors de la récupération des likes du post ${postId} :`,
      error
    );
    return 0; // Retourne 0 en cas d'erreur
  }
};

export const toggleLikePost = async (postId: string) => {
  try {
    const response = await apiService.put(`/posts/${postId}/like`);
    return response.data; // Retourne la réponse du backend (succès ou erreur)
  } catch (error) {
    console.error(`❌ Erreur lors du like/unlike du post ${postId} :`, error);
    return null;
  }
};

// ✅ Ajouter une réaction à un post
export const addReactionToPost = async (postId: string, emoji: string) => {
  try {
    const response = await apiService.put(`/posts/${postId}/reaction`, {
      emoji,
    });
    return response.data; // ✅ Retourne les réactions mises à jour
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la réaction :", error);
    return null;
  }
};


export const fetchReactionUsers = async (
  postId: string,
  emoji?: string
): Promise<{ users: User[] }> => {
  try {
    const response = await apiService.get(
      `/posts/${postId}/reactions/${emoji}` // 🔥 Ici, l'emoji est obligatoire !
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return { users: [] };
  }
};

export const fetchPostReactions = async (postId: string) => {
  try {
    const url = `/posts/${postId}/reactions`; // ✅ Appelle le nouvel endpoint

    const response = await apiService.get(url);
    return response.data; // ✅ Retourne bien { success: true, reactions: [...] }
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des réactions :", error);
    return { reactions: [] }; // ✅ Retourne un tableau vide en cas d'erreur
  }
};




// 📌 Ajouter un commentaire à un post
export const addCommentToPost = async (postId: string, content: string) => {
  try {
    const response = await apiService.post(
      `/posts/${postId}/comments`,
      { content },
      { headers: authHeaders() }
    );
    return response.data.comment;
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    return null; // 🔥 Évite un crash en cas d'erreur
  }
};

// 📌 Récupérer les commentaires d'un post avec pagination
export const fetchPostComments = async (
  postId: string,
  page = 1,
  limit = 5
): Promise<{ comments: CommentType[] }> => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("Utilisateur non authentifié.");
    const response = await apiService.get(`/posts/${postId}/comments`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // ✅ Retourne { comments: [...] }
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    return { comments: [] }; // ✅ Retourne un tableau vide en cas d’erreur
  }
};

// 📌 Supprimer un commentaire
export const deleteComment = async (commentId: string) => {
  try {
    await apiService.delete(`/comments/${commentId}`, {
      headers: authHeaders(),
    });
    return { success: true, message: "Commentaire supprimé avec succès" };
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue s'est produite",
    };
  }
};

export const deletePost = async (postId: string) => {
  try {
    await apiService.delete(`/posts/${postId}`, {
      headers: authHeaders(),
    });
    return { success: true, message: "Post supprimé avec succès" };
  } catch (error) {
    console.error("Erreur lors de la suppression du post :", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue s'est produite",
    };
  }
};


// 📌 Ajouter un commentaire à un Report
export const addCommentToReport = async (reportId: string, content: string) => {
  try {
    const response = await apiService.post(
      `/reports/${reportId}/comments`,
      { content },
      { headers: authHeaders() }
    );
    return response.data.comment;
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire au Report :", error);
    return null; // 🔥 Évite un crash en cas d'erreur
  }
};

// 📌 Récupérer les commentaires d'un Report avec pagination
export const fetchReportComments = async (
  reportId: string,
  page = 1,
  limit = 5
) => {
  try {
    const response = await apiService.get(`/reports/${reportId}/comments`, {
      params: { page, limit },
      headers: authHeaders(),
    });
    console.log("Commentaires récupérés :", response.data);
    return response.data; // ✅ Assure-toi que le backend retourne un tableau `comments`
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    return { comments: [] }; // 🔥 Évite un crash si l'API échoue
  }
};


// 📌 Supprimer un commentaire d'un Report (utilise la même route que pour les Posts)
export const deleteReportComment = async (commentId: string) => {
  try {
    await apiService.delete(`/comments/${commentId}`, {
      headers: authHeaders(),
    });
    return { success: true, message: "Commentaire supprimé avec succès" };
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire du Report :", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue s'est produite",
    };
  }
};

// ✅ Ajouter un commentaire à une Suggestion
export const addCommentToSuggestion = async (
  suggestionId: string,
  content: string
) => {
  try {
    const response = await apiService.post(
      `/suggestions/${suggestionId}/comments`,
      { content },
      { headers: authHeaders() }
    );
    return response.data.comment;
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'ajout du commentaire à la Suggestion :",
      error
    );
    return null;
  }
};

// ✅ Récupérer les commentaires d'une Suggestion
export const fetchSuggestionComments = async (
  suggestionId: string,
  page = 1,
  limit = 5
) => {
  try {
    const response = await apiService.get(
      `/suggestions/${suggestionId}/comments`,
      {
        params: { page, limit },
        headers: authHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des commentaires :",
      error
    );
    return { comments: [] };
  }
};

// ✅ Supprimer un commentaire d'une Suggestion
export const deleteSuggestionComment = async (commentId: string) => {
  try {
    await apiService.delete(`/comments/${commentId}`, {
      headers: authHeaders(),
    });
    return { success: true, message: "Commentaire supprimé avec succès" };
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du commentaire :", error);
    return { success: false, error: "Une erreur s'est produite" };
  }
};

// ✅ Ajouter un commentaire à un CoupDeCoeur
export const addCommentToCdc = async (
  coupDeCoeurId: string,
  content: string
) => {
  try {
    const response = await apiService.post(
      `/coupdecoeur/${coupDeCoeurId}/comments`,
      { content },
      { headers: authHeaders() }
    );
    return response.data.comment;
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'ajout du commentaire au CoupDeCoeur :",
      error
    );
    return null;
  }
};

// ✅ Récupérer les commentaires d'un CoupDeCoeur
export const fetchCdcComments = async (
  coupDeCoeurId: string,
  page = 1,
  limit = 5
) => {
  try {
    const response = await apiService.get(
      `/coupdecoeur/${coupDeCoeurId}/comments`,
      {
        params: { page, limit },
        headers: authHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des commentaires :",
      error
    );
    return { comments: [] };
  }
};

// ✅ Supprimer un commentaire d'un CoupDeCoeur
export const deleteCdcComment = async (commentId: string) => {
  try {
    await apiService.delete(`/comments/${commentId}`, {
      headers: authHeaders(),
    });
    return { success: true, message: "Commentaire supprimé avec succès" };
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du commentaire :", error);
    return { success: false, error: "Une erreur s'est produite" };
  }
};



export const updateBrand = async (
  brandId: string,
  data: FormData
): Promise<{ success: boolean; updatedBrand?: Brand; error?: string }> => {
  try {
    console.log("🛠️ ID de la marque envoyé :", brandId);

    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    const response = await axios.put(
      `${API_BASE_URL}/${API_VERSION}/admin/brand/update/${brandId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("🛠️ Réponse API :", response);
    return { success: true, updatedBrand: response.data.brand };
  } catch (error: unknown) {
    console.error("Erreur API:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || "Erreur inconnue",
      };
    }

    return { success: false, error: "Erreur réseau ou serveur" };
  }
};

export const deleteBrand = async (
  brandId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    await axios.delete(
      `${API_BASE_URL}/${API_VERSION}/admin/brand/${brandId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { success: true };
  } catch (error: unknown) {
    console.error("Erreur API:", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || "Erreur inconnue",
      };
    }

    return { success: false, error: "Erreur réseau ou serveur" };
  }
};

/* export const fetchReports = async (
  page: number,
  limit: number
): Promise<ReportsResponse> => {
  try {
    console.log("🚀 API fetchReports() appelée !");

    const token = getAccessToken();
    if (!token) {
      console.error("❌ Aucun token trouvé !");
      throw new Error("Utilisateur non authentifié.");
    }

    console.log("🔑 Token utilisé :", token);
    console.log("📄 Page et limite :", page, limit);

    const response = await apiService.get<ReportsResponse>(
      `/user/reports?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Réponse API brute reports :", response.data);

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Erreur lors de `fetchReports()` :", error);
    throw new Error("Erreur lors du chargement des rapports.");
  }
}; */

export const fetchReports = async (
  page: number,
  limit: number
): Promise<ReportsResponse> => {
  try {
    console.log("🚀 API fetchReports() appelée !");

    const token = getAccessToken();
    if (!token) {
      console.error("❌ Aucun token trouvé !");
      throw new Error("Utilisateur non authentifié.");
    }

    console.log("🔑 Token utilisé :", token);
    console.log("📄 Page et limite :", page, limit);

    const response = await apiService.get<ReportsResponse>(
      `/user/reports?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Réponse API brute reports :", response.data);

    // 🔥 S'assure que `reactions` est toujours un tableau
    const formattedReports = response.data.reports.map((report) => ({
      ...report,
      reactions: report.reactions ? report.reactions : [],
    }));
    console.log("📤 Réponse envoyée avec filtre :", formattedReports);

    return { ...response.data, reports: formattedReports };
  } catch (error: unknown) {
    console.error("❌ Erreur lors de `fetchReports()` :", error);
    throw new Error("Erreur lors du chargement des rapports.");
  }
};

export const fetchUserStats = async () => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }
    const response = await apiService.get(`user/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    return null;
  }
};

// Fonction pour récupérer les coups de cœur
export const fetchCoupsdeCoeur = async (
  page: number,
  limit: number
): Promise<CdcsResponse> => {
  try {
    console.log("🚀 API fetchReports() appelée !");

    const token = getAccessToken();
    if (!token) {
      console.error("❌ Aucun token trouvé !");
      throw new Error("Utilisateur non authentifié.");
    }

    console.log("🔑 Token utilisé :", token);
    console.log("📄 Page et limite :", page, limit);

    const response = await apiService.get<CdcsResponse>(
      `/user/coupsdecoeur?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Réponse API brute reports :", response.data);

    // 🔥 S'assure que `reactions` est toujours un tableau
    const formattedCdc = response.data.coupdeCoeurs.map((cdc) => ({
      ...cdc,
      reactions: cdc.reactions ? cdc.reactions : [],
    }));
    console.log("📤 Réponse envoyée avec filtre :", formattedCdc);

    return { ...response.data, coupdeCoeurs: formattedCdc };
  } catch (error: unknown) {
    console.error("❌ Erreur lors de `fetchReports()` :", error);
    throw new Error("Erreur lors du chargement des rapports.");
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
      }
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
      error instanceof Error ? error.message : "Erreur inconnue"
    );

    if (error instanceof (await import("axios")).AxiosError) {
      throw new Error(
        error.response?.data?.error ||
          "Erreur lors du chargement du profil utilisateur."
      );
    }

    throw new Error(
      "Erreur inattendue lors du chargement du profil utilisateur."
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
  formData: FormData
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
        response.data.message || "Échec de la mise à jour du profil."
      );
    }

    return response.data; // Retourne les données de la réponse
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur lors de la mise à jour du profil :",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du profil."
      );
    } else if (error instanceof Error) {
      console.error(
        "Erreur inconnue lors de la mise à jour du profil :",
        error.message
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



export const fetchReportCommentCount = async (reportId: string) => {
  try {
    const response = await apiService.get(
      `/reports/${reportId}/comments/count`
    );
    return response.data.count;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération du nombre de commentaires :",
      error
    );
    return 0;
  }
};

export const fetchSuggestionCommentCount = async (suggestionId: string) => {
  try {
    const response = await apiService.get(
      `/suggestions/${suggestionId}/comments/count`
    );
    return response.data.count;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération du nombre de commentaires :",
      error
    );
    return 0;
  }
};

export const fetchCdcCommentCount = async (cdcId: string) => {
  try {
    const response = await apiService.get(`/cdc/${cdcId}/comments/count`);
    return response.data.count;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération du nombre de commentaires :",
      error
    );
    return 0;
  }
};

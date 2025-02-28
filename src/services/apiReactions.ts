import { User } from "@src/types/Reports";
import { getAccessToken } from "@src/utils/tokenUtils";
import axios from "axios";

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

export const addReactionToReport = async (reportId: string, emoji: string) => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("Utilisateur non authentifié.");

    const body = JSON.stringify({ emoji }); // ✅ Convertir explicitement en JSON
    console.log("📤 Envoi de la requête avec :", reportId, body);

    const response = await apiService.put(
      `/report/${reportId}/reactions`,
      body, // ✅ JSON bien formaté
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Réponse reçue :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la réaction :", error);
    throw error;
  }
};
export const fetchReportReactions = async (
  reportId: string,
  emoji?: string
) => {
  try {
    const url = emoji
      ? `/reports/${reportId}/reactions/${emoji}` // 🔥 Filtre par emoji
      : `/reports/${reportId}/reactions`; // 🔥 Récupère toutes les réactions

    const response = await apiService.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des réactions :", error);
    return { reactions: [] };
  }
};

export const fetchReportReactionUsers = async (
  reportId: string,
  emoji?: string
): Promise<{ users: User[] }> => {
  try {
    const response = await apiService.get(
      `/reports/${reportId}/reactions/${emoji}`
    );

    // ✅ Transforme la réponse en `User[]`
    const formattedUsers: User[] = response.data.users.map(
      (user: {
        id: string;
        pseudo: string;
        avatar: string;
        email?: string;
      }) => ({
        id: user.id,
        pseudo: user.pseudo,
        avatar: user.avatar,
        email: user.email || "", // ✅ Ajoute un email vide par défaut si non fourni
      })
    );

    return { users: formattedUsers }; // ✅ Retourne un `User[]`
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des utilisateurs :",
      error
    );
    return { users: [] }; // ✅ Retourne un tableau vide en cas d'erreur
  }
};


export const addReactionToCdc = async (
  coupdecoeurId: string,
  emoji: string
) => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("Utilisateur non authentifié.");

    const body = JSON.stringify({ emoji }); // ✅ Convertir en JSON
    console.log("📤 Envoi de la requête avec :", coupdecoeurId, body);

    const response = await apiService.put(
      `/cdc/${coupdecoeurId}/reactions`, // ✅ Uniformisation de l'URL
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Réponse reçue :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la réaction :", error);
    throw error;
  }
};

export const fetchCdcReactions = async (
  coupdecoeurId: string,
  emoji?: string
) => {
  try {
    const url = emoji
      ? `/cdc/${coupdecoeurId}/reactions/${emoji}` // 🔥 Filtre par emoji
      : `/cdc/${coupdecoeurId}/reactions`; // 🔥 Récupère toutes les réactions

    console.log("🌍 Requête envoyée à :", url);

    const response = await apiService.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des réactions :", error);
    return { reactions: [] };
  }
};

export const fetchCdcReactionUsers = async (
  cdcId: string,
  emoji?: string
): Promise<{ users: User[] }> => {
  try {
    const response = await apiService.get(`/cdc/${cdcId}/reactions/${emoji}`);

    const formattedUsers: User[] = response.data.users.map(
      (user: {
        id: string;
        pseudo: string;
        avatar: string;
        email?: string;
      }) => ({
        id: user.id,
        pseudo: user.pseudo,
        avatar: user.avatar,
        email: user.email || "",
      })
    );

    return { users: formattedUsers };
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des utilisateurs :",
      error
    );
    return { users: [] };
  }
};

export const fetchSuggestionReactions = async (
  suggestionId: string,
  emoji?: string
) => {
  try {
    const url = emoji
      ? `/suggestion/${suggestionId}/reactions/${emoji}`
      : `/suggestion/${suggestionId}/reactions`;

    console.log("🌍 Requête envoyée à :", url);

    const response = await apiService.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des réactions :", error);
    return { reactions: [] };
  }
};


export const addReactionToSuggestion = async (
  suggestionId: string,
  emoji: string
) => {
  console.log(
    "📤 Envoi de la requête API pour Suggestion :",
    suggestionId,
    emoji
  );

  try {
    const token = getAccessToken();
    if (!token) throw new Error("Utilisateur non authentifié.");

    const response = await apiService.put(
      `/suggestion/${suggestionId}/reactions`,
      JSON.stringify({ emoji }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Réponse API :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la réaction :", error);
    throw error;
  }
};


export const fetchSuggestionReactionUsers = async (
  suggestionId: string,
  emoji?: string
): Promise<{ users: User[] }> => {
  try {
    const response = await apiService.get(
      `/suggestion/${suggestionId}/reactions/${emoji}`
    );

    const formattedUsers: User[] = response.data.users.map(
      (user: {
        id: string;
        pseudo: string;
        avatar: string;
        email?: string;
      }) => ({
        id: user.id,
        pseudo: user.pseudo,
        avatar: user.avatar,
        email: user.email || "",
      })
    );

    return { users: formattedUsers };
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des utilisateurs :",
      error
    );
    return { users: [] };
  }
};

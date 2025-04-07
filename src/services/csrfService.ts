import { apiService } from "./authService";

export const getCsrfToken = async () => {
  try {
    console.log("🔄 Requête pour récupérer le CSRF token...");

    const response = await apiService.get("/csrf-token", {
      withCredentials: true, // ✅ Nécessaire pour les cookies
    });

    console.log("✅ Réponse CSRF reçue :", response.data);
    console.log("✅ Token CSRF récupéré :", response.data.csrfToken);

    return response.data.csrfToken;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du CSRF Token :", error);
    return null;
  }
};

import { apiService } from "./authService";

export const getCsrfToken = async () => {
  try {
    const response = await apiService.get("/csrf-token", {
      withCredentials: true,
    });
    return response.data.csrfToken; // Récupère le token CSRF
  } catch (error) {
    console.error("Erreur lors de la récupération du CSRF Token :", error);
    return null;
  }
};
import { apiService } from "./authService";

export const getCsrfToken = async (): Promise<string | null> => {
  try {
    const response = await apiService.get("/csrf-token", {
      withCredentials: true,
    });
    return response.data.csrfToken;
  } catch (err) {
    console.error("❌ Erreur CSRF :", err);
    return null;
  }
};

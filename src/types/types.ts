export interface UserProfile {
  id: string;
  pseudo: string;
  email: string;
  avatar?: string;
  gender?: string;
  born?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
  type: "user" | "brand"; // Ajoute cette ligne pour bien identifier si c'est un user ou une marque
  name?: string; // Pour les marques
  offres?: string; // Pour les marques

}
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  accessToken?: string;
}

export interface ErrorResponse {
  message?: string;
}

export interface ConfirmEmailResponse {
  success: boolean;
  message: string;
  accessToken?: string; // Le token d'accès si l'utilisateur est automatiquement connecté
  user?: UserProfile; // Le profil utilisateur renvoyé après validation
}

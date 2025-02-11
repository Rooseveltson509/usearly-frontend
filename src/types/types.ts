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

export interface Brand {
  id: string;
  userId: string; // ✅ Ajout du champ userId
  name: string;
  email: string;
  mdp?: string; // Facultatif pour éviter de forcer un mot de passe dans la mise à jour
  offres: string;
  avatar?: string | null;
  createdAt: string;
  updatedAt?: string; // ✅ Ajout du champ updatedAt
}


export interface Post {
  id: string;
  title: string;
  content: string;
  brand: Brand;
  author: {
    id: string;
    pseudo: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface PostData {
  title: string;
  content: string;
  marqueId: string;
}

export interface PostsResponse {
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  posts: Post[];
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

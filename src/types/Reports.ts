export interface User {
  pseudo: string;
  email: string;
}

export interface Reports {
  id: string;
  siteUrl: string;
  marque: string;
  bugLocation?: string; // Présent uniquement dans les signalements
  emplacement?: string; // Présent dans les coups de cœur et suggestions
  emojis: string;
  description: string;
  blocking?: string;
  tips?: string;
  createdAt: string;
  updatedAt?: string;
  nbrLikes?: number; // Présent dans les coups de cœur
  User: {
    pseudo: string;
    email: string;
  };
  siteType: string | null;
  categories: { name: string }[]; // ✅ Ajout des catégories
  type?: string; // <-- Ajout du type
}

export interface ReportsResponse {
  totalReports: number;
  currentPage: number;
  totalPages: number;
  reports: Reports[];
}

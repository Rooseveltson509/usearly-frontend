export interface User {
  id: string;
  pseudo: string;
  email: string;
  avatar?: string;
}
export interface Reaction {
  userId: string;
  emoji: string;
  count: number;
}
export interface Reports {
  id: string;
  siteUrl: string;
  marque: string;
  bugLocation?: string;
  emplacement?: string;
  emojis: string;
  description: string;
  capture?: string;
  blocking?: string;
  tips?: string;
  createdAt: string;
  updatedAt?: string;
  nbrLikes?: number;
  User: {
    pseudo: string;
    email: string;
    avatar?: string;
  };
  reactions: Reaction[]; // ✅ Vérifie que cette ligne est bien présente !
  siteType: string | null;
  categories: { name: string }[];
  type?: string;
}

export interface Cdc {
  id: string;
  siteUrl: string;
  marque: string;
  bugLocation?: string;
  emplacement?: string;
  emojis: string;
  description: string;
  blocking?: string;
  tips?: string;
  createdAt: string;
  updatedAt?: string;
  nbrLikes?: number;
  User: {
    pseudo: string;
    email: string;
    avatar?: string;
  };
  reactions: Reaction[]; // ✅ Vérifie que cette ligne est bien présente !
  siteType: string | null;
  categories: { name: string }[];
  type?: string;
}

export interface Suggestion {
  id: string;
  siteUrl: string;
  marque: string;
  bugLocation?: string;
  emplacement?: string;
  emojis: string;
  description: string;
  blocking?: string;
  tips?: string;
  createdAt: string;
  updatedAt?: string;
  nbrLikes?: number;
  User: {
    pseudo: string;
    email: string;
    avatar?: string;
  };
  reactions: Reaction[]; // ✅ Vérifie que cette ligne est bien présente !
  siteType: string | null;
  categories: { name: string }[];
  type?: string;
}



export interface ReportsResponse {
  totalReports: number;
  currentPage: number;
  totalPages: number;
  reports: Reports[];
}


export interface CdcsResponse {
  totalReports: number;
  currentPage: number;
  totalPages: number;
  coupdeCoeurs: Reports[];
}
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

  // ✅ MAJ ici : User est maintenant un tableau
  User?: {
    id: string;
    pseudo: string;
    avatar?: string;
    ReportingUsers?: {
      reportingId: string;
      userId: string;
      createdAt: string;
      updatedAt: string;
    };
  }[];

  reactions: Reaction[];
  siteType: string | null;
  categories: string[]; // ou { name: string }[] selon le backend
  type?: string;
}

export interface GroupedReport {
  reportingId: string;
  category: string;
  marque: string;
  totalCount: number;
  subCategories: {
    subCategory: string;
    count: number;
    descriptions: {
      description: string;
      emoji?: string;
      user: {
        id: string;
        pseudo: string;
        avatar: string | null;
      };
      createdAt: string;
    }[];
  }[];
}

export interface Cdc {
  id: string;
  siteUrl: string;
  marque: string;
  emplacement?: string;
  emoji: string;
  description: string;
  blocking?: string;
  capture?: string | null;
  tips?: string;
  createdAt: string;
  updatedAt?: string;
  nbrLikes?: number;

  // ✅ correspond à ce que ton back renvoie
  User: {
    pseudo: string;
    email: string;
    avatar?: string;
  };

  reactions: Reaction[];
  siteType?: string | null; // ❓ non présent dans ta réponse → optionnel
  categories?: { name: string }[]; // ❓ non présent non plus → optionnel
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
  reactionsCount: number;
}

export interface ReportsResponse {
  totalReports: number;
  currentPage: number;
  totalPages: number;
  reports: Reports[];
}

export interface CdcsResponse {
  totalCoupsdeCoeur: number;
  currentPage: number;
  totalPages: number;
  coupdeCoeurs: Cdc[]; // ✅ et plus Reports[]
}

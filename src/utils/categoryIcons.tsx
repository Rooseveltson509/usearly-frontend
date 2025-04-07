import {
  ShoppingCart,
  Lock,
  UserPlus,
  Search,
  CreditCard,
  HelpCircle,
  Heart,
  MessageCircle,
  Bell,
  Home,
  Globe,
  List,
  FileText,
  AlertTriangle,
  Calendar,
} from "lucide-react";

import { ReactNode } from "react";

export const categoryIcons: Record<string, ReactNode> = {
  // E-commerce
  Panier: <ShoppingCart size={22} />,
  Achat: <ShoppingCart size={22} />,
  Paiement: <CreditCard size={22} />,
  Commande: <FileText size={22} />,
  Réservation: <Calendar size={20} />,

  // Authentification
  Authentification: <Lock size={22} />,
  Connexion: <Lock size={22} />,
  Inscription: <UserPlus size={22} />,

  // Navigation
  Recherche: <Search size={22} />,
  Favoris: <Heart size={22} />,
  "Liste de souhaits": <Heart size={22} />,
  Notifications: <Bell size={22} />,
  Messagerie: <MessageCircle size={22} />,

  // Support
  "Service Client": <HelpCircle size={22} />,
  Assistance: <HelpCircle size={22} />,
  Contact: <HelpCircle size={22} />,

  // Général
  Général: <Globe size={22} />,
  Accueil: <Home size={22} />,
  "Fil d’actualité": <Home size={22} />,
  Catégorie: <List size={22} />,
  "Sous-catégorie": <List size={22} />,
  Produits: <List size={22} />,

  // Par défaut (fallback)
  "Non classé": <AlertTriangle size={22} />,
};

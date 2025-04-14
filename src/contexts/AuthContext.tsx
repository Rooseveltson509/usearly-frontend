import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { logout as performLogout, refreshToken } from "../services/authService";
import { fetchBrandProfile, fetchUserProfile, isTokenExpired } from "../services/apiService";
import { UserProfile } from "../types/types";
import { getAccessToken, storeTokenInCurrentStorage } from "@src/utils/tokenUtils";
import { useNavigate } from "react-router-dom";
//import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  isLoadingProfile: boolean;
  flashMessage: string | null;
  flashType: "success" | "error" | "info" | null;
  userProfile: UserProfile | null;
  userType: "user" | "brand" | null;
  setIsAuthenticated: (authState: boolean) => void;
  login: (username: string, type?: "user" | "brand") => void;
  setUserType: (type: "user" | "brand" | null) => void;
  logout: () => void;
  handleLogout: () => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setFlashMessage: (message: string, type: "success" | "error" | "info") => void;
  clearFlashMessage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [flashMessage, setFlashMessageState] = useState<string | null>(null);
  const [flashType, setFlashType] = useState<"success" | "error" | "info" | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [userType, setUserType] = useState<"user" | "brand" | null>(null);
  const navigate = useNavigate();

  // Récupérer et valider les tokens au chargement
  useEffect(() => {
    const fetchData = async () => {
      let token = getAccessToken();

      if (!token || isTokenExpired(token)) {
        console.log("🔄 Aucun token valide, tentative de refresh...");
        try {
          token = await refreshToken();
          if (token) {
            storeTokenInCurrentStorage(token);
          } else {
            console.warn("⚠️ Échec du refresh, utilisateur non authentifié.");
            setIsAuthenticated(false);
            setIsLoadingProfile(false);
            return;
          }
        } catch (error) {
          console.error("❌ Erreur lors du refresh token :", error);
          setIsAuthenticated(false);
          setIsLoadingProfile(false);
          return;
        }
      }

      try {
        const storedUserType =
          localStorage.getItem("userType") || sessionStorage.getItem("userType");

        if (storedUserType === "brand" || storedUserType === "user") {
          setUserType(storedUserType);
        } else {
          setUserType(null);
          setIsAuthenticated(false);
          setIsLoadingProfile(false);
          return;
        }

        let profile;
        if (storedUserType === "brand") {
          const response = await fetchBrandProfile();
          profile = response.brand;
        } else {
          profile = await fetchUserProfile();
        }

        setUserProfile(profile);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil :", error);
        handleLogout();
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchData();
  }, [isAuthenticated]); // Ajoute isAuthenticated à la dépendance pour relancer fetchData à chaque connexion

  // Effacement automatique des messages flash
  useEffect(() => {
    if (flashMessage) {
      const timeout = setTimeout(() => {
        clearFlashMessage();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [flashMessage]);

  // Connexion d'un utilisateur
  const login = (username: string, type: "user" | "brand" = "user") => {
    const existingUserType = localStorage.getItem("userType");

    if (existingUserType && existingUserType !== type) {
      setFlashMessage(
        `Vous êtes déjà connecté en tant que ${existingUserType}. Déconnectez-vous d'abord pour vous connecter sous ce rôle.`,
        "error"
      );

      // Appel de la fonction logout pour déconnecter l'utilisateur actuel
      performLogout(); // Remplace performLogout() par logout()

      setTimeout(() => {
        setIsAuthenticated(true);
        setUsername(username);
        setUserType(type);
        localStorage.setItem("userType", type);
        setFlashMessage("Connexion réussie!", "success");
      }, 500); // Attendre un petit moment pour être sûr que le logout est terminé
    } else {
      setIsAuthenticated(true);
      setUsername(username);
      setUserType(type);
      localStorage.setItem("userType", type);
      setFlashMessage("Connexion réussie!", "success");
    }
  };

  // Fonction de déconnexion
const handleLogout = async () => {
  try {
    const lastType = userType; // 🧠 sauvegarde avant reset
    await performLogout();

    setIsAuthenticated(false);
    setUserProfile(null);
    setUserType(null);

    // 🧹 Nettoyage
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("userType");
    sessionStorage.removeItem("userType");
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setFlashMessage("Déconnexion réussie.", "success");

    // 🔁 Redirection dynamique
    navigate(lastType === "brand" ? "/brand-login" : "/login", { replace: true });
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    setFlashMessage("Erreur lors de la déconnexion.", "error");
  }
};

  // Fonction de déconnexion
  const logout = async () => {
    try {
      const lastType = userType; // 🧠 sauvegarde avant reset
      await performLogout(); // Cette méthode est responsable de la déconnexion côté back-end et front-end

      // Réinitialiser les états d'authentification dans le contexte
      setIsAuthenticated(false);
      setUserType(null);
      setUserProfile(null);
      localStorage.removeItem("userType");
      sessionStorage.removeItem("userType");
      setFlashMessage("Déconnexion réussie.", "success");

      // 🔁 Redirection dynamique
      navigate(lastType === "brand" ? "/brand-login" : "/login", { replace: true });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      setFlashMessage("Erreur lors de la déconnexion.", "error");
    }
  };

  const setFlashMessage = (message: string, type: "success" | "error" | "info") => {
    setFlashMessageState(message);
    setFlashType(type);
  };

  const clearFlashMessage = () => {
    setFlashMessageState(null);
    setFlashType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        userProfile,
        userType,
        isLoadingProfile,
        setUserProfile,
        flashMessage,
        flashType,
        setIsAuthenticated,
        setUserType,
        login,
        logout,
        handleLogout,
        setFlashMessage,
        clearFlashMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { logout as performLogout, refreshToken } from "../services/authService";
import { fetchBrandProfile, fetchUserProfile } from "../services/apiService";
import { UserProfile } from "../types/types";
import { getAccessToken } from "@src/utils/tokenUtils";
//import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  isLoadingProfile: boolean | null;
  flashMessage: string | null;
  flashType: "success" | "error" | "info" | null;
  userProfile: UserProfile | null;
  userType: "user" | "brand" | null;
  setIsAuthenticated: (authState: boolean) => void; // Ajout de la fonction ici
  login: (username: string, type?: "user" | "brand") => void;
  //login: (username: string) => void;
   setUserType: (type: "user" | "brand" | null) => void; 
  logout: () => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setFlashMessage: (
    message: string,
    type: "success" | "error" | "info",
  ) => void;
  clearFlashMessage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  //const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [flashMessage, setFlashMessageState] = useState<string | null>(null);
  const [flashType, setFlashType] = useState<
    "success" | "error" | "info" | null
  >(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [userType, setUserType] = useState<"user" | "brand" | null>(null);

  // Récupérer et valider les tokens au chargement
/*   useEffect(() => {
    const fetchData = async () => {
      const token = getAccessToken(); // Vérifie dans les deux
      console.log("Token récupéré :", token);
      if (token) {
        try {
          const storedUserType = localStorage.getItem("userType") || sessionStorage.getItem("userType");
          let profile: UserProfile;
          if (storedUserType === "brand") {
            profile = await fetchBrandProfile();
          } else {
            profile = await fetchUserProfile();
          }

          if (!profile.type) {
            console.error("⚠️ Type d'utilisateur manquant !");
            return;
          }

          //const profile = await fetchUserProfile(); // Appel API pour récupérer le profil
          setUserProfile(profile);
          setIsAuthenticated(true);
          setUserType(profile.type);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération du profil utilisateur :",
            error,
          );
          // Rafraîchir le token si nécessaire
          try {
            const newAccessToken = await refreshToken();
            localStorage.setItem("accessToken", newAccessToken); // Mettre à jour le token
            const profile = await fetchUserProfile(); // Réessayer de récupérer le profil
            setUserProfile(profile);
            setIsAuthenticated(true);
          } catch (refreshError) {
            console.error(
              "Erreur lors du rafraîchissement du token :",
              refreshError,
            );
            handleLogout(); // Déconnecte si le refresh échoue
          }
        } finally {
          setIsLoadingProfile(false); // Fin du chargement
        }
      } else {
        setIsAuthenticated(false);
        setIsLoadingProfile(false); // Fin du chargement si pas de token
      }
    };

    fetchData();
  }, [localStorage.getItem("accessToken")]); */

useEffect(() => {
  const fetchData = async () => {
    const token = getAccessToken();
    if (!token) {
      setIsAuthenticated(false);
      setIsLoadingProfile(false);
      return;
    }

    try {
      const storedUserType = localStorage.getItem("userType") || sessionStorage.getItem("userType");

      // ✅ Vérification et assignation correcte de userType
      if (storedUserType === "user" || storedUserType === "brand") {
        setUserType(storedUserType);
      } else {
        console.error("⚠️ Type d'utilisateur invalide !");
        setUserType(null);
        setIsAuthenticated(false);
        setIsLoadingProfile(false);
        return;
      }

      const profile = storedUserType === "brand" ? await fetchBrandProfile() : await fetchUserProfile();

      setUserProfile(profile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);

      try {
        const newAccessToken = await refreshToken();
        localStorage.setItem("accessToken", newAccessToken);

        const storedUserType = localStorage.getItem("userType") || sessionStorage.getItem("userType");

        if (storedUserType === "user" || storedUserType === "brand") {
          setUserType(storedUserType);
        } else {
          throw new Error("UserType invalide après refresh");
        }

        const profile = storedUserType === "brand" ? await fetchBrandProfile() : await fetchUserProfile();

        setUserProfile(profile);
        setIsAuthenticated(true);
      } catch (refreshError) {
        console.error("Erreur lors du rafraîchissement du token :", refreshError);
        handleLogout();
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  fetchData();

  const handleStorageChange = () => fetchData();
  window.addEventListener("storage", handleStorageChange);

  return () => window.removeEventListener("storage", handleStorageChange);
}, []);


  // Effacement automatique des messages flash
  useEffect(() => {
    if (flashMessage) {
      const timeout = setTimeout(() => {
        clearFlashMessage();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [flashMessage]);


const login = (username: string, type: "user" | "brand" = "user") => {
  setIsAuthenticated(true);
  setUsername(username);
  setUserType(type);
  localStorage.setItem("userType", type);
  setFlashMessage("Connexion réussie!", "success");
};



  const handleLogout = async () => {
    try {
      performLogout(); // Déconnexion côté serveur (supprime le refreshToken côté back)

      // Supprimer les tokens stockés localement
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");

      // Réinitialiser les états d'authentification
      setIsAuthenticated(false);
      setUsername(null);
      setUserProfile(null);

      // Optionnel : Supprimer le cookie manuellement côté frontend (si applicable)
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setFlashMessage("Vous avez été déconnecté avec succès.", "success");

      // Rediriger l'utilisateur vers la page de connexion
      //window.location.href = "/login";
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      setFlashMessage("Erreur lors de la déconnexion.", "error");
    }
  };

  const logout = () => {
    handleLogout();
  };

  const setFlashMessage = (
    message: string,
    type: "success" | "error" | "info",
  ) => {
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

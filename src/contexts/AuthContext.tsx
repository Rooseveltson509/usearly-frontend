import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logout as performLogout, refreshToken } from '../services/authService';
import { fetchUserProfile } from '../services/apiService';
import { UserProfile } from '../types/types';
import { getAccessToken } from '@src/utils/tokenUtils';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  isLoadingProfile: boolean | null;
  flashMessage: string | null;
  flashType: 'success' | 'error' | 'info' | null;
  userProfile: UserProfile | null;
  login: (username: string) => void;
  logout: () => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setFlashMessage: (message: string, type: 'success' | 'error' | 'info') => void;
  clearFlashMessage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [flashMessage, setFlashMessageState] = useState<string | null>(null);
  const [flashType, setFlashType] = useState<'success' | 'error' | 'info' | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Récupérer et valider les tokens au chargement
  useEffect(() => {
    const fetchData = async () => {
      const token = getAccessToken(); // Vérifie dans les deux
      console.log("Token récupéré :", token);
      if (token) {
        try {
          const profile = await fetchUserProfile(); // Appel API pour récupérer le profil
          setUserProfile(profile);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Erreur lors de la récupération du profil utilisateur :', error);
          // Rafraîchir le token si nécessaire
          try {
            const newAccessToken = await refreshToken();
            localStorage.setItem('accessToken', newAccessToken); // Mettre à jour le token
            const profile = await fetchUserProfile(); // Réessayer de récupérer le profil
            setUserProfile(profile);
            setIsAuthenticated(true);
          } catch (refreshError) {
            console.error('Erreur lors du rafraîchissement du token :', refreshError);
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

  const login = (username: string) => {
    setIsAuthenticated(true);
    setUsername(username);
    setFlashMessage('Connexion réussie!', 'success');
  };

  const handleLogout = async () => {
    try {
      await performLogout();  // Déconnexion côté serveur (supprime le refreshToken côté back)

      // Supprimer les tokens stockés localement
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');

      // Réinitialiser les états d'authentification
      setIsAuthenticated(false);
      setUsername(null);
      setUserProfile(null);

      // Optionnel : Supprimer le cookie manuellement côté frontend (si applicable)
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setFlashMessage('Vous avez été déconnecté avec succès.', 'success');

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

  const setFlashMessage = (message: string, type: 'success' | 'error' | 'info') => {
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
        isLoadingProfile,
        setUserProfile,
        flashMessage,
        flashType,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
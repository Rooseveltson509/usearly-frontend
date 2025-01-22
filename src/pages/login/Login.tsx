import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/Usearly.png';
import { login as apiLogin } from '../../services/authService';
import './Login.scss';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserProfile } from '@src/services/apiService';
import { storeToken } from '@src/utils/tokenUtils';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUserProfile, login, setFlashMessage } = useAuth(); // Récupérer les fonctions depuis AuthContext
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);


  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiLogin(email, password, rememberMe);
      console.log("Réponse de l'API login :", response);

      const { accessToken } = response;

      // Toujours stocker le token, même si "Se souvenir de moi" n'est pas coché
      storeToken(accessToken, rememberMe);
      
      console.log("Token dans sessionStorage :", sessionStorage.getItem("accessToken"));
      console.log("Token dans localStorage :", localStorage.getItem("accessToken"));

      const profile = await fetchUserProfile(); // Récupère les données utilisateur
      console.log("Profil utilisateur :", profile);

      setUserProfile(profile);
      login(email);

      setFlashMessage("Connexion réussie !", "success");
      navigate("/");
    }catch (error: any) {
      if (error.response?.status === 401) {
        setFlashMessage("Identifiants incorrects.", "error");
      } else if (error.response?.status === 500) {
        setFlashMessage("Erreur interne du serveur.", "error");
      } else {
        setFlashMessage("Connexion échouée: " + (error.message || "Erreur inconnue"), "error");
      }
      console.error("Erreur attrapée :", error);
    }
     finally {
      setIsLoading(false);
    }
  };



  /*   const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true); // Activer le spinner
      try {
        const response = await apiLogin(email, password);
        const { accessToken } = response.data;
  
        localStorage.setItem("accessToken", accessToken);
  
        const profile = await fetchUserProfile(); // Récupérer les données utilisateur après connexion
        setUserProfile(profile); // Mettre à jour dans AuthContext
  
        login(email);
        setFlashMessage("Connexion réussie !", "success");
        navigate("/");
      } catch (error: any) {
        setFlashMessage("Connexion échouée: " + (error.response?.data?.message || error.message), "error");
      } finally {
        setIsLoading(false); // Désactiver le spinner
      }
    }; */

  return (
    <div className="login-container">
      <h1>Saisis ton adresse e-mail et ton mot de passe pour rejoindre Usearly.</h1>
      <form onSubmit={handleLogin} onClick={(e) => e.stopPropagation()} className="login-form">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="remember">
            <label className="rememberMe">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              /> Se souvenir de moi.
            </label>
            <Link to="/forgot-password" className="forgot-password-link">
              Mot de passe oublié ?
            </Link>
          </div>
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </div>
      </form>
      <div className="background-text">
        <img src={backgroundImage} alt="Usearly Background" className="background-image" />
      </div>
      <footer className="signup-footer">
        <a href="#">Conditions générales d'utilisation</a>
        <a href="#">Nous contacter</a>
        <p>© Usearly 2024</p>
      </footer>
    </div>
  );
};

export default Login;
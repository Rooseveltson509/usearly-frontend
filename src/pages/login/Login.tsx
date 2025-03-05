import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/Usearly.png";
import { login as apiLogin } from "../../services/authService";
import "./Login.scss";
import { useAuth } from "../../contexts/AuthContext";
import { fetchUserProfile } from "@src/services/apiService";
import { storeToken } from "@src/utils/tokenUtils";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserProfile, login, setFlashMessage } = useAuth(); // Récupérer les fonctions depuis AuthContext
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response: { accessToken: string } = await apiLogin(
        email,
        password,
        rememberMe,
      );
      console.log("Réponse de l'API login :", response);

      const { accessToken } = response;

      // Toujours stocker le token, même si "Se souvenir de moi" n'est pas coché
      storeToken(accessToken, rememberMe, "user");

      console.log(
        "Token dans sessionStorage :",
        sessionStorage.getItem("accessToken"),
      );
      console.log(
        "Token dans localStorage :",
        localStorage.getItem("accessToken"),
      );

      const profile = await fetchUserProfile(); // Récupère les données utilisateur
      console.log("Profil utilisateur :", profile);

      setUserProfile(profile);
      login(email, "user");

      setFlashMessage("Connexion réussie !", "success");
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof (await import("axios")).AxiosError) {
        if (error.response?.status === 401) {
          setFlashMessage("Identifiants incorrects.", "error");
        } else if (error.response?.status === 500) {
          setFlashMessage("Erreur interne du serveur.", "error");
        } else {
          setFlashMessage(
            "Connexion échouée: " +
              (error.response?.data?.message || "Erreur inconnue"),
            "error",
          );
        }
        console.error(
          "Erreur attrapée :",
          error.response?.data || error.message,
        );
      } else {
        setFlashMessage("Une erreur inconnue est survenue.", "error");
        console.error("Erreur inattendue :", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <><div className="login-container">
      <h1>Ravi de te revoir Usear !</h1>
      <p>
        Saisis ton adresse e-mail et ton mot de passe pour rejoindre Usearly.
      </p>
      <form
        onSubmit={handleLogin}
        onClick={(e) => e.stopPropagation()}
        className="login-form"
      >
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
          <div className="remember">
            <label className="rememberMe">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)} />{" "}
              Se souvenir de moi.
            </label>
            <Link to="/forgot-password" className="forgot-password-link">
              Mot de passe oublié ?
            </Link>
          </div>
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </div>
      </form>
      <div className="background-text">
        <img
          src={backgroundImage}
          alt="Usearly Background"
          className="background-image" />
      </div>

    </div><footer className="landing-footer">
        <ul className="footer-cgpu">
          <li>
            {" "}
            <p>
              <a href="#">Conditions générales d'utilisation</a>
            </p>
          </li>
          <li>
            {" "}
            <p>
              <a href="#">Nous contacter</a>
            </p>
          </li>
          <li>
            <p>© Usearly 2024</p>
          </li>
        </ul>
      </footer></>
  );
};

export default Login;

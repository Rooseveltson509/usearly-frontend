import { useEffect, useState } from "react";
import { loginBrand } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/Usearly.png";
import "./BrandLogin.scss";
import { useAuth } from "@src/contexts/AuthContext";
import { getAccessToken, storeToken } from "@src/utils/tokenUtils";
import { fetchBrandProfile } from "@src/services/apiService";

const BrandLogin = () => {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserProfile, login, setFlashMessage } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      navigate("/brand-dash");
    }
  }, [navigate]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginBrand(email, mdp, rememberMe);
      if (!response || !response.accessToken || !response.user) {
        throw new Error("Réponse de l'API invalide");
      }

      const { accessToken, user } = response;

      if (user.type !== "brand") {
        throw new Error("Erreur : L'utilisateur connecté n'est pas une marque.");
      }

      // ✅ Stockage du token et du userType
      storeToken(accessToken, rememberMe, user.type);
      if (rememberMe) {
        localStorage.setItem("userType", user.type);
      } else {
        sessionStorage.setItem("userType", user.type);
      }

      // ✅ Récupération immédiate du profil
      const profile = await fetchBrandProfile();
      setUserProfile(profile);

      // ✅ Mise à jour du AuthContext
      login(email, user.type);

      setFlashMessage("Connexion réussie !", "success");

      // ✅ Redirection
      navigate("/brand-dash", { replace: true });
    } catch (error: unknown) {
      console.error("🔴 Erreur lors de la connexion :", error);
      setFlashMessage("Erreur de connexion", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Connexion Marque</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={mdp}
            onChange={e => setMdp(e.target.value)}
            required
          />
          <div className="remember">
            <label className="rememberMe">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />{" "}
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

export default BrandLogin;

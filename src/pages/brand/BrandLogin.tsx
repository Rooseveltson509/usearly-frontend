import { useState } from "react";
import { loginBrand } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/Usearly.png";
import "./BrandLogin.scss";
import { useAuth } from "@src/contexts/AuthContext";
import { storeToken } from "@src/utils/tokenUtils";
import { fetchBrandProfile } from "@src/services/apiService";

const BrandLogin = () => {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserProfile, setUserType, setIsAuthenticated, setFlashMessage } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response: { accessToken: string; user?: { type: string } } = await loginBrand(
        email,
        mdp,
        rememberMe
      );

      console.log("Réponse de l'API login :", response);

      const { accessToken, user } = response;

      if (user?.type) {
        console.log("Utilisateur connecté en tant que :", user.type);
      }

      // Stocker le token
      storeToken(accessToken, rememberMe, "brand");

      // Vérification immédiate du token stocké
      const storedUserType = localStorage.getItem("userType") || sessionStorage.getItem("userType");
      console.log("Vérification après stockage - UserType:", storedUserType);

      if (!storedUserType || storedUserType !== "brand") {
        throw new Error("Erreur : le userType n'est pas correctement stocké.");
      }

      const profile = await fetchBrandProfile();
      console.log("Profil de la marque récupéré :", profile);

      setUserProfile(profile);
      setUserType("brand");
      setIsAuthenticated(true);

      setFlashMessage("Connexion réussie !", "success");

      // 🔥 Correction potentielle : Mettre un petit timeout avant la redirection
      setTimeout(() => {
        navigate("/roose", { replace: true });
        //navigate("/dashboard-brand", { replace: true });
      }, 100);
    } catch (error: unknown) {
      setFlashMessage("Erreur de connexion", "error");
      console.error("Erreur inattendue :", error);
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

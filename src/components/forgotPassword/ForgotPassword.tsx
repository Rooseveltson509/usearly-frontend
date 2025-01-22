import React, { useState } from "react";
import "./ForgotPassword.scss";
import { forgetPassword } from "@src/services/apiService";
import { useAuth } from "@src/contexts/AuthContext";
import backgroundImage from '../../assets/Usearly.png';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const { setFlashMessage } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [, setSuccessMessage] = useState("");
    const [, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Activer le spinner
        setSuccessMessage("");
        setErrorMessage("");

        try {
            // Appeler la méthode de l'API
            await forgetPassword(email);
            setSuccessMessage("Un e-mail de réinitialisation a été envoyé.");
            setFlashMessage("Un e-mail de réinitialisation a été envoyé.", "success");
        } catch (error: any) {
            setFlashMessage(error, "error");
            setErrorMessage(
                error ||
                "Une erreur est survenue. Veuillez réessayer."
            );
        } finally {
            setIsLoading(false); // Désactiver le spinner
          }
    };

    return (
        <div className="login-container">
            <h1>Mot de passe oublié ?</h1>
            <p>
                Entrez votre adresse e-mail, et nous vous enverrons un lien pour
                réinitialiser votre mot de passe.
            </p>
            <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="login-form">
                <div>
                    <input
                        type="email"
                        id="email"
                        placeholder="Entrez votre e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
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

export default ForgotPassword;

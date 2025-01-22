import { resetPassword } from "@src/services/authService";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.scss";

const ResetPassword: React.FC = () => {
    const { userId, token } = useParams<{ userId: string; token: string }>();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("userId from URL:", userId);
        console.log("token from URL:", token);
        if (!userId || !token) {
            setError("Le lien est invalide ou a expiré.");
        }
    }, [userId, token]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
    
        if (!userId || !token) {
            setError("Lien invalide ou expiré.");
            return;
        }
    
        if (!password || !passwordConfirm) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
    
        if (password !== passwordConfirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
    
        setLoading(true);
        try {
            const response = await resetPassword(userId!, token!, password, passwordConfirm);
            
            if (response.success) {
                setSuccess("Mot de passe réinitialisé avec succès !");
                setTimeout(() => {
                    window.location.href = '/dashboard'; // Rediriger vers le dashboard
                }, 2000);
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.message); // Affichage de l'erreur sans redirection
        } finally {
            setLoading(false);
        }
    };
    


    return (
        <div className="reset-password-container">
            <h2>Réinitialisation du mot de passe</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Nouveau mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Entrer le nouveau mot de passe"
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Confirmer le mot de passe :</label>
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="Confirmer le mot de passe"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Réinitialisation en cours...' : 'Réinitialiser'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
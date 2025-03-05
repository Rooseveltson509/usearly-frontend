import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerifyCode.scss";
import { confirmEmail, fetchUserProfile } from "../../services/apiService";
import { useAuth } from "@src/contexts/AuthContext";
import axios from "axios";

const VerifyCode: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email ?? "";
  const userId = location.state?.userId ?? "";
  const { setUserProfile, setFlashMessage, setIsAuthenticated } = useAuth();

  // Redirection si email ou userId est manquant
  useEffect(() => {
    if (!email || !userId) {
      navigate("/signup");
    }
  }, [email, userId, navigate]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Autoriser uniquement les chiffres
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Passer au champ suivant automatiquement
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    setError(null); // Réinitialisation des erreurs
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && code[index] === "") {
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const validateForm = () => {
    if (code.includes("") || code.join("").length < 6) {
      setError("Veuillez entrer un code complet à 6 chiffres.");
      setFlashMessage("Veuillez entrer un code complet à 6 chiffres.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await confirmEmail(userId, code.join(""));

      if (response.success && response.accessToken) {
        // Stocker le token reçu
        localStorage.setItem("accessToken", response.accessToken);

        // Récupérer le profil utilisateur et mettre à jour l'état
        const profile = await fetchUserProfile();
        setUserProfile(profile);
        setIsAuthenticated(true);

        setSuccess(
          response.message || "Votre compte a été validé avec succès.",
        );
        setFlashMessage("Bienvenue sur la plateforme !", "success");

        navigate("/home");
      } else {
        throw new Error(response.message || "Erreur lors de la validation.");
      }
    } catch (error: unknown) {
      let errorMessage = "Erreur lors de la validation du code.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setFlashMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-code-container">
      <h2>Vérifiez votre email</h2>
      <p>
        Un code de vérification a été envoyé à <strong>{email}</strong>.
        Veuillez entrer le code ci-dessous pour valider votre compte.
      </p>
      <div className="code-inputs">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="code-input"
            disabled={isLoading}
          />
        ))}
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button
        className="signup-button"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? "En cours..." : "Valider"}
      </button>
    </div>
  );
};

export default VerifyCode;

import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyCode.scss';
import { confirmEmail } from '../../services/apiService';
import { useAuth } from '@src/contexts/AuthContext';

const VerifyCode: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const email = location.state?.email; // Récupération de l'email
  const userId = location.state?.userId; // Récupération de userId
  const { setFlashMessage } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirection si email ou userId est manquant
  useEffect(() => {
    if (!email || !userId) {
      navigate('/signup'); // Redirection vers Signup
    }
  }, [email, userId, navigate]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Autoriser uniquement les chiffres ou vide
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Passer automatiquement au champ suivant
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    setError(null); // Réinitialisation des erreurs
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && code[index] === '') {
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async () => {
    setError(null); // Réinitialisation des erreurs
    setSuccess(null); // Réinitialisation des messages de succès
    setIsLoading(true); // Activer le spinner

    if (code.includes('') || code.join('').length < 6) {
      setError('Veuillez entrer un code complet à 6 chiffres.');
      setFlashMessage('Veuillez entrer un code complet à 6 chiffres.', 'error');
      setIsLoading(false); // Désactiver le spinner
      return;
    }

    try {
      const response = await confirmEmail(userId, code.join('')); // Appel API
      setSuccess(response.message || 'Votre compte a été validé avec succès.');
      setFlashMessage(response.message, 'success');
      setTimeout(() => navigate('/login'), 3000); // Redirection après succès
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || 'Erreur lors de la validation du code.';
      setError(errorMessage);
      setFlashMessage(errorMessage, 'error');
    } finally {
      setIsLoading(false); // Désactiver le spinner
    }
  };

  return (
    <div className="verify-code-container">
      <h2>Vérifiez votre email</h2>
      <p>
        Un code de vérification a été envoyé à <strong>{email}</strong>. Veuillez entrer le code ci-dessous pour valider votre compte.
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
        {isLoading ? 'en cours...' : 'Valider'}
      </button>
    </div>
  );
};

export default VerifyCode;
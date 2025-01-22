import React, { useState } from "react";
import "./PasswordChecker.scss"; // Ajoutez le style pour les couleurs

const PasswordChecker: React.FC = () => {
  const [password, setPassword] = useState("");

  // Critères pour le mot de passe
  const criteria = [
    {
      label: "Au moins 8 caractères.",
      isValid: (password: string) => password.length >= 8,
    },
    {
      label: "Au moins une lettre majuscule.",
      isValid: (password: string) => /[A-Z]/.test(password),
    },
    {
      label: "Au moins une lettre minuscule.",
      isValid: (password: string) => /[a-z]/.test(password),
    },
    {
      label: "Au moins un chiffre.",
      isValid: (password: string) => /\d/.test(password),
    },
    {
      label: "Au moins un caractère spécial.",
      isValid: (password: string) => /[@$!%*?&]/.test(password),
    },
  ];

  return (
    <div className="password-checker">
      <h2>Créer un mot de passe</h2>
      <input
        type="password"
        placeholder="Tapez votre mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <ul>
        {criteria.map((criterion, index) => (
          <li
            key={index}
            className={criterion.isValid(password) ? "valid" : "invalid"}
          >
            {criterion.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordChecker;

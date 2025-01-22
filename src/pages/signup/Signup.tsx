import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/Usearly.png";
import "./Signup.scss";
import { useAuth } from "../../contexts/AuthContext";
import { registerUser } from "../../services/apiService";

const Signup: React.FC = () => {
  const { setFlashMessage } = useAuth();
  const [formData, setFormData] = useState({
    pseudo: "",
    born: "",
    email: "",
    password: "",
    password_confirm: "",
    gender: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const navigate = useNavigate();

  // Critères de validation du mot de passe
  const passwordCriteria = [
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toLocaleDateString("fr-FR");
      setBirthDate(date);
      setFormData({ ...formData, born: formattedDate });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // Activer le spinner

    if (!formData.pseudo || !formData.born || !formData.email || !formData.password || !formData.password_confirm || !formData.gender) {
      setError("Tous les champs doivent être remplis.");
      setIsLoading(false); // Désactiver le spinner
      return;
    }

    if (formData.password !== formData.password_confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false); // Désactiver le spinner
      return;
    }

    if (!isTermsAccepted) {
      setFlashMessage(
        "Vous devez accepter les conditions d'utilisation.",
        "error"
      );
      setError("Vous devez accepter les conditions d'utilisation.");
      setIsLoading(false); // Désactiver le spinner
      return;
    }

    try {
      const { userId, email } = await registerUser(formData);
      setFlashMessage(
        "Inscription réussie! Veuillez vérifier votre email pour confirmer.",
        "success"
      );
      navigate("/verify-code", { state: { userId, email } });
    } catch (err: any) {
      const errorMessage = err.message || "Une erreur est survenue.";
      setError(errorMessage);
      setFlashMessage(errorMessage, "error");
    }finally {
      setIsLoading(false); // Désactiver le spinner
    }
  };

  return (
    <div className="signup-container">
      <h1>Faisons de toi un Usear !</h1>
      {error && <p className="error-message">{error}</p>}
      <form className="signup-form" onSubmit={handleSignup}>
        <label htmlFor="pseudo">Pseudo :</label>
        <input
          type="text"
          id="pseudo"
          name="pseudo"
          value={formData.pseudo}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe*"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <ul className="password-criteria">
          {passwordCriteria.map((criterion, index) => (
            <li
              key={index}
              className={
                criterion.isValid(formData.password) ? "valid" : "invalid"
              }
            >
              {criterion.label}
            </li>
          ))}
        </ul>
        <input
          type="password"
          placeholder="Confirmation Mot de passe*"
          id="password_confirm"
          name="password_confirm"
          value={formData.password_confirm}
          onChange={handleChange}
          required
        />
        <div className="form-row">
          <DatePicker
            selected={birthDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Date de naissance*"
            minDate={new Date(1900, 0, 1)}
            maxDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
          <select
            className="gender-select"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Genre</option>
            <option value="monsieur">Monsieur</option>
            <option value="madame">Madame</option>
            <option value="N/A">N/A</option>
          </select>
        </div>
        <label className="terms-label">
          <input
            type="checkbox"
            checked={isTermsAccepted}
            onChange={() => setIsTermsAccepted(!isTermsAccepted)}
          />
          J'accepte les conditions d'utilisation et je confirme avoir lu la{" "}
          politique de confidentialité de Usearly.
        </label>
        <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? 'chargement en cours...' : 'Créer un compte'}
          </button>
      </form>
      <div className="background-text">
        <img
          src={backgroundImage}
          alt="Usearly Background"
          className="background-image"
        />
      </div>
      <footer className="signup-footer">
        <a href="#">Conditions générales d'utilisation</a>
        <a href="#">Nous contacter</a>
        <p>© Usearly 2024</p>
      </footer>
    </div>
  );
};

export default Signup;
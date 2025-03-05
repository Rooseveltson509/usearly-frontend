import { useState } from "react";
import { useAuth } from "@src/contexts/AuthContext";
import { createBrand } from "@src/services/apiService";
import { Brand } from "@src/types/types";
import "./CreateBrand.scss";

interface CreateBrandProps {
  onCreateSuccess: (newBrand: Brand) => void;
  onClose: () => void;
}

const CreateBrand: React.FC<CreateBrandProps> = ({
  onCreateSuccess,
  onClose,
}) => {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mdp: "",
    mdp_confirm: "",
    avatar: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (userProfile?.role !== "admin") {
    return (
      <p>
        ⚠️ Accès refusé. Seuls les administrateurs peuvent créer des marques.
      </p>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, avatar: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !formData.name ||
      !formData.email ||
      !formData.mdp ||
      !formData.mdp_confirm ||
      !formData.avatar
    ) {
      setError("⚠️ Tous les champs sont obligatoires !");
      setIsLoading(false);
      return;
    }

    if (formData.mdp !== formData.mdp_confirm) {
      setError("⚠️ Les mots de passe ne correspondent pas !");
      setIsLoading(false);
      return;
    }

    try {
      const response = await createBrand(formData);

      if (response.success && response.brand) {
        setSuccess("🎉 Marque créée avec succès !");
        onCreateSuccess(response.brand); // 🔥 Mise à jour de la liste
        onClose(); // 🔥 Fermer le modal après l'ajout
      } else {
        setError(response.error || "Erreur lors de la création de la marque.");
      }
    } catch (err) {
      setError("⚠️ Une erreur est survenue. Vérifiez vos informations.");
      console.error("Erreur lors de la création de la marque :", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-brand-container">
      <h1>Créer une nouvelle marque</h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit} className="create-brand-form">
        <input
          type="text"
          name="name"
          placeholder="Nom de la marque"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email de la marque"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="mdp"
          placeholder="Mot de passe"
          value={formData.mdp}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="mdp_confirm"
          placeholder="Confirmer le mot de passe"
          value={formData.mdp_confirm}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="form-actions">
          <button type="submit" className="create-btn" disabled={isLoading}>
            {isLoading ? "Création en cours..." : "Créer la marque"}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBrand;
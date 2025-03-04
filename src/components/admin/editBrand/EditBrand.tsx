import React, { useState } from "react";
import { updateBrand } from "@src/services/apiService";
import "./EditBrand.scss";
import { Brand } from "@src/types/types";

interface EditBrandProps {
  brand: Brand;
  onUpdateSuccess: (updatedBrand: Brand) => void;
  onClose: () => void;
}

const OFFER_OPTIONS = ["freemium", "start", "start pro", "premium"];

type EditBrandFormData = {
  name: string;
  email: string;
  mdp?: string;
  avatar?: File | null;
  offres: string;
};

const EditBrand: React.FC<EditBrandProps> = ({
  brand,
  onUpdateSuccess,
  onClose,
}) => {
  const [formData, setFormData] = useState<EditBrandFormData>({
    name: brand.name,
    email: brand.email,
    mdp: "",
    avatar: null,
    offres: brand.offres || "freemium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, avatar: e.target.files[0] });
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("email", formData.email);
    dataToSend.append("offres", formData.offres);

    if (formData.avatar) {
      console.log("📤 Avatar ajouté au FormData :", formData.avatar.name);
      dataToSend.append("avatar", formData.avatar);
    }

    const response = await updateBrand(brand.id, dataToSend);
    console.log("🛠️ Réponse reçue :", response);

    if (response.success && response.updatedBrand) {
      setSuccess("Marque mise à jour avec succès !");
      onUpdateSuccess(response.updatedBrand);
      setTimeout(() => onClose(), 1500);
    } else {
      setError(response.error || "Une erreur est survenue.");
    }
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la marque :", err);
    setError("Erreur inattendue. Veuillez réessayer.");
  } finally {
    setLoading(false);
    console.log("🔽 Fin de la mise à jour.");
  }
};

  return (
    <div className="edit-brand-modal">
      <div className="modal-content">
        <h2>Modifier la marque</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Nom :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Offre :</label>
          <select name="offres" value={formData.offres} onChange={handleChange}>
            {OFFER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label>Mot de passe :</label>
          <div className="password-container">
            <input
              type="password"
              name="mdp"
              placeholder="Laisser vide si inchangé"
              value={formData.mdp}
              onChange={handleChange}
              disabled={!isEditingPassword}
            />
            <button
              type="button"
              className="edit-password-btn"
              onClick={() => setIsEditingPassword(!isEditingPassword)}
            >
              {isEditingPassword ? "Annuler" : "Modifier"}
            </button>
          </div>

          <label>Avatar :</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button type="submit" disabled={loading}>
            {loading ? "Mise à jour..." : "Enregistrer"}
          </button>
          <button type="button" className="cancel" onClick={onClose}>
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBrand;

import React, { useState, useEffect } from "react";
import { useAuth } from "@src/contexts/AuthContext";
import defaultAvatar from "../../assets/images/user.png";
import { fetchUserProfile, updateUserProfile } from "@src/services/apiService";
import "./MyAccount.scss";
import Modal from "../modal/Modal";
import { updatePassword } from "@src/services/authService";
import { useNavigate } from "react-router-dom";

const MyAccount: React.FC = () => {
  const { userProfile, setUserProfile, setFlashMessage } = useAuth();
  const [pseudo, setPseudo] = useState(userProfile?.pseudo || "");
  const [email, setEmail] = useState(userProfile?.email || "");
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userProfile?.avatar ? `${import.meta.env.VITE_API_BASE_URL}/${userProfile.avatar}` : null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Champs pour le changement de mot de passe
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const bornDate = userProfile?.born
    ? new Date(userProfile.born).toLocaleDateString()
    : "Non renseignée";

  useEffect(() => {
    if (!userProfile) {
      const fetchProfile = async () => {
        try {
          const profile = await fetchUserProfile();
          setUserProfile(profile);
          setPseudo(profile.pseudo || "");
          setEmail(profile.email || "");
          setAvatarPreview(
            profile.avatar ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${profile.avatar}` : null
          );
        } catch (error) {
          console.error("Erreur lors du chargement du profil :", error);
        }
      };

      fetchProfile();
    }
  }, [userProfile, setUserProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("pseudo", pseudo);
    formData.append("email", email);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const updatedProfile = await updateUserProfile(formData);

      if (updatedProfile.success && updatedProfile.user) {
        setFlashMessage("Profil mis à jour avec succès !", "success");
        navigate("/home");
        setUserProfile(updatedProfile.user); // Mise à jour du profil utilisateur
        setAvatarPreview(`${import.meta.env.VITE_API_BASE_URL}/${updatedProfile.user.avatar}`);
      } else {
        setFlashMessage(`Erreur: ${updatedProfile.message || "Profil non mis à jour"}`, "error");
      }
    } catch (error) {
      setFlashMessage("Erreur lors de la mise à jour du profil.", "error");
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setFlashMessage("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    try {
      await updatePassword({
        old_password: oldPassword,
        password: newPassword,
        password_confirm: confirmPassword,
      });

      setFlashMessage("Mot de passe mis à jour avec succès !", "success");
      navigate("/home");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setFlashMessage(error.message, "error"); // Afficher le message exact du backend
      } else {
        setFlashMessage("Erreur lors de la mise à jour du mot de passe.", "error");
      }
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Appeler une API pour supprimer le compte
      //await deleteAccount(); // Remplacez par votre méthode API
      setFlashMessage("Votre compte a été supprimé.", "success");
      setIsModalOpen(false);

      // Déconnecter l'utilisateur après suppression
      // logout();
    } catch (error) {
      setFlashMessage("Erreur lors de la suppression du compte.", "error");
      console.error("Erreur :", error);
    }
  };

  return (
    <div className="profile-container">
      {userProfile ? (
        <>
          <div className="profile-page">
            <h1>Mes informations</h1>
            {userProfile ? (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                {/* Avatar */}
                <div className="form-group avatar-group">
                  <img
                    src={avatarPreview || defaultAvatar}
                    alt="Avatar actuel"
                    className="avatar-preview"
                  />
                  <input type="file" id="avatar" accept="image/*" onChange={handleFileChange} />
                </div>

                {/* Pseudo */}
                <div className="form-group">
                  <label htmlFor="pseudo">Pseudo :</label>
                  <input
                    type="text"
                    id="pseudo"
                    value={pseudo}
                    onChange={e => setPseudo(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Email :</label>
                  <input type="email" id="email" value={userProfile.email} disabled />
                </div>

                {/* Date de naissance */}
                <div className="form-group">
                  <label htmlFor="born">Date de naissance :</label>
                  <input type="text" id="born" value={bornDate} disabled />
                </div>

                {/* Genre */}
                <div className="form-group">
                  <label htmlFor="gender">Genre :</label>
                  <input type="text" id="gender" value={userProfile.gender} disabled />
                </div>

                <button type="submit" className="update-button">
                  Mettre à jour
                </button>
              </form>
            ) : (
              <p>Chargement des informations...</p>
            )}
          </div>

          <div className="section">
            <h2 className="section-title">Changer le mot de passe</h2>
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label htmlFor="old_password">Ancien mot de passe :</label>
                <input
                  type="password"
                  id="old_password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="new_password">Nouveau mot de passe :</label>
                <input
                  type="password"
                  id="new_password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm_password">Confirmer le mot de passe :</label>
                <input
                  type="password"
                  id="confirm_password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit">Mettre à jour le mot de passe</button>
            </form>
          </div>
        </>
      ) : (
        <p>Chargement des informations...</p>
      )}
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          setIsModalOpen(true); // Ouvrir la modal
        }}
      >
        Supprimer mon compte?
      </a>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Fermer la modal
        onConfirm={handleDeleteAccount} // Confirmer la suppression
        title="Confirmation"
        message="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est définitive."
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
};

export default MyAccount;

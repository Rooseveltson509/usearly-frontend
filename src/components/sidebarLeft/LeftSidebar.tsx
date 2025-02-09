import React from "react";
import defaultAvatar from "../../assets/images/user.png";
import shakePhone from "../../assets/images/shakephone.png";
import "./LeftSidebar.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Importer le contexte Auth

const LeftSidebar: React.FC = () => {
  const { userProfile } = useAuth(); // Récupérer les données utilisateur depuis le contexte
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate("/my-account"); // Redirige vers la page de profil
  };

  const userStats = {
    signalements: 24,
    coupsDeCoeur: 8,
    suggestions: 2,
    userPower: 1260,
  };

  return (
    <aside className="sidebar-left">
      <div className="user-card">
        <div
          className="avatar"
          onClick={handleAvatarClick}
          style={{ cursor: "pointer" }}
        >
          <img
            src={
              userProfile?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}/${userProfile.avatar}`
                : defaultAvatar
            }
            alt="Avatar utilisateur"
          />
        </div>
        <h3>{userProfile?.pseudo || "Utilisateur"}</h3>
        <div className="user-info">
          <div className="stat-item">
            <h4>Signalement</h4>
            <p>{userStats.signalements}</p>
          </div>
          <div className="stat-item large-item">
            <h4>Coup de cœur</h4>
            <p>{userStats.coupsDeCoeur}</p>
          </div>
          <div className="stat-item">
            <h4>Suggestion</h4>
            <p>{userStats.suggestions}</p>
          </div>
        </div>
        <div className="user-power">
          <span className="power-label">Mon Usear Power</span>
          <span className="power-value">
            <span className="icon">U.</span> 1260
          </span>
        </div>
        <button className="view-more">Voir plus</button>
      </div>

      <div className="rewards-section">
        <h4>Vos récompenses</h4>
        <img src={shakePhone} alt="Reward" />
        <p>Shaker Star</p>
      </div>
    </aside>
  );
};

export default LeftSidebar;

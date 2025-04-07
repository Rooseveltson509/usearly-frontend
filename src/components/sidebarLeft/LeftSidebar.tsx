import React, { useEffect, useState } from "react";
import defaultAvatar from "../../assets/images/user.png";
import scoreIcon from "../../assets/images/testLogo.png";
import "./LeftSidebar.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Importer le contexte Auth
import { fetchUserStats } from "@src/services/apiService";

const LeftSidebar: React.FC = () => {
  const { userProfile } = useAuth(); // Récupérer les données utilisateur depuis le contexte
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate("/my-account"); // Redirige vers la page de profil
  };

  const [stats, setStats] = useState({
    reports: 0,
    coupsDeCoeur: 0,
    suggestions: 0,
    usearPower: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchUserStats();
      if (data) {
        setStats(data);
        console.log("stats: " + stats.reports);
      }
    };

    loadStats();
  }, [stats.reports]);

  return (
    <aside className="sidebar-left">
      <div className="user-card">
        <div className="avatar" onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
          <img
            src={
              userProfile?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}/${userProfile.avatar}`
                : defaultAvatar
            }
          />
        </div>

        <h3>{userProfile?.pseudo || "Utilisateur"}</h3>
        <div className="user-info">
          <div className="stat-item">
            <h4>Signalement</h4>
            <p>{stats.reports}</p>
          </div>
          <div className="stat-item large-item">
            <h4>Coup de cœur</h4>
            <p>{stats.coupsDeCoeur}</p>
          </div>
          <div className="stat-item">
            <h4>Suggestion</h4>
            <p>{stats.suggestions}</p>
          </div>
        </div>
        <div className="user-power">
          <span className="power-label">Mon Usear Power</span>
          <span className="power-value">
            <img className="icon" src={scoreIcon} style={{ objectFit: "contain" }} />
            {stats.usearPower}
          </span>
        </div>
        <button className="view-more">Voir plus</button>
      </div>
    </aside>
  );
};

export default LeftSidebar;

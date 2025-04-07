import React from "react";
import "./ExperienceEmotionnelle.scss";

const ExperienceEmotionnelle: React.FC = () => {
  return (
    <div className="experience-emotionnelle">
      <h3>Expérience émotionnelle</h3>

      <div className="emotions-summary">
        <div className="emoji-cloud">
          <span>😍</span>
          <span>😡</span>
          <span>😭</span>
          <span>🤬</span>
          <span>😤</span>
          <span>👍</span>
          <span>😤</span>
        </div>
        <div className="stats">
          <div className="stat-card">
            <strong>343</strong>
            <span className="negative-trend"> 🔺8%</span>
            <p>Émotions</p>
          </div>
          <div className="stat-card">
            <strong>3</strong>
            <p>Zones critiques</p>
          </div>
          <div className="stat-card">
            <strong>+10%</strong>
            <p>D'émotions négatives</p>
          </div>
        </div>
      </div>

      <div className="emotion-distribution">
        <span className="negative">
          😡 Négative <strong>50%</strong>
        </span>
        <span className="separator">|</span>
        <span className="positive">
          😀 Positive <strong>27%</strong>
        </span>
        <span className="separator">|</span>
        <span className="neutral">
          😐 Neutre <strong>13%</strong>
        </span>
        <select className="dropdown">
          <option>▼</option>
        </select>
      </div>

      <div className="emotion-journey">
        <span>🔥 Paiement</span> → <span>⚠ Recherche</span> → <span>⚠ Livraison</span>
        <select className="dropdown">
          <option>▼</option>
        </select>
      </div>
    </div>
  );
};

export default ExperienceEmotionnelle;

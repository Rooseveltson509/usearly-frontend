import React from "react";
import "./ExperienceEmotionnelleSmall.scss";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const ExperienceEmotionnelle: React.FC = () => {
  return (
    <div className="experience-emotionnelle-sm">
      <h2>Expérience émotionnelle</h2>

      <div className="emotions-summary">
        {/* Nuage d'Emojis */}
        <div className="top-line">
          <div className="left-column">
            <div className="emoji-cloud">
              <span>😍</span>
              <span>😡</span>
              <span>😭</span>
              <span>🤬</span>
              <span>😒</span>
              <span>👍</span>
              <span>😤</span>
            </div>
          </div>
          {/* Nouveau conteneur pour regrouper les stats et les sélecteurs */}
          <div className="right-column">
            <button className="card-btn">
              <FiChevronRight className="card-btn-icon" />
            </button>
            <div className="stats">
              <div className="stat-card">
                <span className="stat-value">343</span>
                <p>Emotions</p>
              </div>
              <div className="stat-card">
                <span className="stat-value">3</span>
                <p>Zones critiques</p>
              </div>
            </div>
            {/* Sélecteurs placés à droite */}
          </div>
        </div>
        <div className="emotion-controls">
          <div className="custom-select">
            <select>
              <option>
                😡 Négative 50% ︱ 😀 Positive 27% ︱ 😐 Neutre 13%
              </option>

              <option>😀 Positive 27%</option>
              <option>😐 Neutre 13%</option>
            </select>
            <FiChevronDown className="chevron-icon" />
          </div>

          <div className="custom-select">
            <select>
              <option>🔥 Paiement → ⚠️ Recherche → ⚠️ Livraison</option>
              <option>🔥 Paiement</option>
              <option>⚠️ Recherche</option>
              <option>⚠️ Livraison</option>
            </select>
            <FiChevronDown className="chevron-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceEmotionnelle;

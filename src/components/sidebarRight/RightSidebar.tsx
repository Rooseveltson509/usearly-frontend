import React from "react";
import "./RightSidebar.scss";

import nike from "../../assets/images/nike.svg";
import laredoute from "../../assets/images/laredoute.svg";
import strava from "../../assets/images/stravia.svg";
import doclib from "../../assets/images/doctolib.svg";
import CollaborationIcon from "../../assets/icons/collaboration.svg";
import ChallengeIcon from "../../assets/icons/challenge.svg";

const RightSidebar: React.FC = () => {
  return (
    <div className="sidebar-right">
      {/* Section Collaboration */}
      <div className="section">
        <div className="section-title">
    <img src={CollaborationIcon} alt="Collaboration icon" className="section-icon" />
    <h3>Collaboration</h3>
  </div>
        <p>
          Rejoignez vos marques pour co-créer et innover sur les produits et
          services de demain !
        </p>
        <button className="cta-button">Afficher toutes les collabs</button>
      </div>

      {/* Section Challenge */}
      <div className="section">
         <div className="section-title">
    <img src={ChallengeIcon} alt="Challenge icon" className="section-icon" />
    <h3>Challenge</h3>
  </div>
        <p>
          Participez à des challenges, aidez la communauté et vos marques pour
          de meilleures expériences et booster votre Usear Power.
        </p>
        <button className="cta-button">Afficher tous les challenges</button>
      </div>

      {/* Section Marques à suivre */}
      <div className="section brand-list">
        <h3>Marques à suivre</h3>
        <div className="brand-item">
          <div className="brand-info">
            <img src={nike} alt="Nike logo" />
            <div>
              <div className="brand-name">Nike</div>
              <div className="brand-handle">@nike</div>
            </div>
          </div>
          <button className="follow-button">Suivre</button>
        </div>
        <div className="brand-item">
          <div className="brand-info">
            <img src={laredoute} alt="La Redoute logo" />
            <div>
              <div className="brand-name">La Redoute</div>
              <div className="brand-handle">@LaRedouteFr</div>
            </div>
          </div>
          <button className="follow-button">Suivre</button>
        </div>
        <div className="brand-item">
          <div className="brand-info">
            <img src={strava} alt="Strava logo" />
            <div>
              <div className="brand-name">Strava</div>
              <div className="brand-handle">@strava</div>
            </div>
          </div>
          <button className="follow-button">Suivre</button>
        </div>
        <div className="brand-item">
          <div className="brand-info">
            <img src={doclib} alt="Doctolib logo" />
            <div>
              <div className="brand-name">Doctolib</div>
              <div className="brand-handle">@doctolib</div>
            </div>
          </div>
          <button className="follow-button">Suivre</button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;

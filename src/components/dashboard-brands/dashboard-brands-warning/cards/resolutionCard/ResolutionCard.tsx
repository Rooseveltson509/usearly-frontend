import React, { useState } from "react";
import "./ResolutionCard.scss";
import ResolutionIcon from "../../../../../assets/icons/dashboard/resolution.svg";
import TempsIcon from "../../../../../assets/icons/dashboard/temps.svg";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";

const ResolutionCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // 🔥 État pour toggler

  const resolvedTickets = 50;
  const totalTickets = 78;
  const progressPercentage = (resolvedTickets / totalTickets) * 100;
  const trendResolution = 3; // Ex: +3%
  const trendRate = -2; // Ex: -2%

  return (
    <div className="resolution-chart">
      {/* Bouton en haut à droite */}
      <button className="card-btn">
        <FiChevronRight className="card-btn-icon" />
      </button>

      <h2>Tickets résolus</h2>

      {/* Barre de progression */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span
          className="resolved-label"
          style={{ left: `calc(${progressPercentage}% - 15px)` }}
        >
          {resolvedTickets}
        </span>
        <span className="total-tickets">{totalTickets}</span>
      </div>

      {/* Statistiques */}
      <div className="stats">
        {/* Temps moyen de résolution */}
        <div className="stat">
          <div className="value">
            <img src={TempsIcon} alt="Temps" className="stat-icon" />
            <span>12h</span>
            <div className="trend">
              <span
                className={`trend-icon ${trendResolution > 0 ? "up" : "down"}`}
              >
                {trendResolution > 0 ? "▲" : "▼"}
              </span>
              <span
                className={`trend-value ${trendResolution > 0 ? "up" : "down"}`}
              >
                {trendResolution}%
              </span>
            </div>
          </div>
          <div className="label">Temps moyen de résolution</div>
        </div>

        {/* Taux de résolution */}
        <div className="stat">
          <div className="value">
            <img src={ResolutionIcon} alt="Résolution" className="stat-icon" />
            <span>60%</span>
            <div className="trend">
              <span className={`trend-icon ${trendRate > 0 ? "up" : "down"}`}>
                {trendRate > 0 ? "▲" : "▼"}
              </span>
              <span className={`trend-value ${trendRate > 0 ? "up" : "down"}`}>
                {trendRate}%
              </span>
            </div>
          </div>
          <div className="label">Taux de résolution</div>
        </div>
      </div>

      {/* Nouveau bloc repliable : Problèmes critiques (20) */}
      <div className="critical-block">
        <button className="critical-header" onClick={() => setIsOpen(!isOpen)}>
          <h3>Problèmes critiques 🔥 (20)</h3>

          {isOpen ? (
            <FiChevronDown className="chevron-icon" />
          ) : (
            <FiChevronRight className="chevron-icon" />
          )}
        </button>

        {isOpen && (
          <ul className="critical-list">
            <li>
              <div>
                <span className="dot red"></span>
                <span>Validation bancaire bloquée</span>
              </div>
              <span className="count">129</span>
            </li>
            <li>
              <div>
                <span className="dot red"></span>
                <span>Recherche imprécise</span>
              </div>
              <span className="count">84</span>
            </li>
            <li>
              <div>
                <span className="dot orange"></span>
                <span>Retards de livraison</span>
              </div>
              <span className="count">57</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResolutionCard;

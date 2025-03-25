import React from "react";
import "./ProblemesSignales.scss";

// ✅ Import des icônes SVG des problèmes
import TempsChargementIcon from "../../../../../assets/icons/dashboard/problemes/temps-chargement.svg";
import PanierIcon from "../../../../../assets/icons/dashboard/problemes/panier.svg";
import ServiceClientIcon from "../../../../../assets/icons/dashboard/problemes/service-client.svg";
import AffichageIncorrectIcon from "../../../../../assets/icons/dashboard/problemes/affichage-incorrect.svg";
import ParcoursComplexeIcon from "../../../../../assets/icons/dashboard/problemes/parcours-complexe.svg";
import { FiChevronRight } from "react-icons/fi"; // ✅ Chevron plus fin

const problemes = [
  {
    id: 1,
    icon: TempsChargementIcon,
    name: "Temps de chargement",
    percentage: 50,
    count: 250,
    trend: "up",
    color: "red",
  },
  {
    id: 2,
    icon: PanierIcon,
    name: "Panier",
    percentage: 20,
    count: 100,
    trend: "down",
    color: "red",
  },
  {
    id: 3,
    icon: ServiceClientIcon,
    name: "Service client",
    percentage: 15,
    count: 75,
    trend: "neutral",
    color: "orange",
  },
  {
    id: 4,
    icon: AffichageIncorrectIcon,
    name: "Affichage incorrect",
    percentage: 10,
    count: 50,
    trend: "down",
    color: "grey",
  },
  {
    id: 5,
    icon: ParcoursComplexeIcon,
    name: "Parcours complexe",
    percentage: 5,
    count: 25,
    trend: "up",
    color: "purple",
  },
];

const ProblemesSignales: React.FC = () => {
  return (
    <div className="problemes-card">
      <div className="header">
        <h2>Problèmes les plus signalés</h2>
        <button className="card-btn">
          <FiChevronRight className="card-btn-icon" />
        </button>
      </div>
      <div className="problemes-list">
        {problemes.map((item) => (
          <div key={item.id} className="probleme-item">
            {/* Icône SVG bien alignée */}
            <span className="icon">
              <img src={item.icon} alt={item.name} className="probleme-icon" />
            </span>

            {/* Détails alignés à gauche */}
            <div className="details">
              <span className="probleme-name">{item.name}</span>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
            </div>

            {/* Statistiques alignées à droite */}
            <span className="percentage">{item.percentage}%</span>
            <span className="count">{item.count}</span>
            <span className={`trend ${item.trend}`}>
              {item.trend === "up" ? "🔺" : item.trend === "down" ? "🔻" : "➖"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemesSignales;

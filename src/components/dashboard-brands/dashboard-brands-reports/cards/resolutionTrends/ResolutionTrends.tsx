import React from "react";
import { FiChevronRight } from "react-icons/fi";
import signalResolvedIcon from "../../../../../assets/icons/dashboard/signal-resolved.svg";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./ResolutionTrends.scss";

// Données du graphique
const data = [
  { month: "Janv.", signalements: 20, resolus: 10 },
  { month: "Fév.", signalements: 50, resolus: 30 },
  { month: "Mars", signalements: 35, resolus: 25 },
  { month: "Avr.", signalements: 70, resolus: 40 },
  { month: "Mai", signalements: 30, resolus: 20 },
  { month: "Juin", signalements: 100, resolus: 45 },
];

export const ResolutionTrends: React.FC = () => {
  return (
    <div className="resolution-trends">
      {/* Bouton en haut à gauche */}
      <button className="card-btn">
        <FiChevronRight className="card-btn-icon" />
      </button>

      {/* Contenu de la carte */}
      <h2>Résolution des problèmes</h2>
      <p className="subtitle">
        Vous êtes <strong>5 % au-dessus</strong> de la moyenne du secteur en
        termes de résolution des problèmes.
      </p>

      {/* Conteneur du graphique */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 20, left: 0, right: 10 }} // Augmente l’espace à droite
          >
            <CartesianGrid
              strokeDasharray="0"
              stroke="#EBEBEB"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#EBEBEB" // Atténue la barre X en gris clair
              tick={{ fill: "#333", fontSize: 11 }} // Garde le texte en noir et lisible
            />
            <YAxis
              width={25}
              domain={[0, 100]}
              stroke="#FFFFFF" // Atténue la barre Y en gris clair
              tick={{ fill: "#333", fontSize: 11 }} // Garde le texte en noir et lisible
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="signalements"
              stroke="#000"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="resolus"
              stroke="#61d665"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Légende */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="dot black"></span> Signalements
        </div>
        <div className="legend-item">
          <span className="dot green"></span> Problèmes résolus
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <span className="icon">
          <img
            src={signalResolvedIcon}
            alt="Signal Icon"
            className="signal-icon"
          />
        </span>
        <a href="#">Voir la liste des problèmes corrigés</a>
      </div>
    </div>
  );
};

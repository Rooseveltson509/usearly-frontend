import React, { useState } from "react";
import "./Technologie.scss";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const Technologie = () => {
  const [hoveredDetail, setHoveredDetail] = useState<number | null>(null);

  const data = [
    {
      id: 1,
      navigateur: "Chrome",
      signal: "40%",
      impact: "😡",
      problemes: [
        { texte: "Bugs de chargement", pourcentage: "25%" },
        { texte: "Erreurs d'affichage", pourcentage: "15%" },
      ],
      tendance: "+5%",
    },
    {
      id: 2,
      navigateur: "Safari",
      signal: "35%",
      impact: "😐",
      problemes: [
        { texte: "Lenteur des pages", pourcentage: "20%" },
        { texte: "Incompatibilité avec filtres", pourcentage: "15%" },
      ],
      tendance: "—",
    },
    {
      id: 3,
      navigateur: "Autres (Edge, Firefox, etc.)",
      signal: "25%",
      impact: "😩",
      problemes: [
        { texte: "Compatibilité limitée", pourcentage: "10%" },
        { texte: "Erreur de validation", pourcentage: "8%" },
      ],
      tendance: "-2%",
    },
  ];

  return (
    <div className="technologie">
      <button className="card-btn">
        <FiChevronRight className="card-btn-icon" />
      </button>
      <button className="filter-btn">
        Filtrer <FiChevronDown className="filter-icon" />
      </button>

      <div className="header">
        <h2>Technologie</h2>
      </div>

      <p className="subtitle">
        Les signalements liés aux navigateurs ont évolué cette semaine. Voici un
        aperçu des principaux problèmes détectés :
      </p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Navigateurs</th>
              <th className="center">Signals</th>
              <th className="center">Impact émotionnel</th>
              <th>Problèmes principaux</th>
              <th className="center">Tendances</th>
              <th className="center">Détails</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td className="navigateur">{row.navigateur}</td>
                <td className="signals">{row.signal}</td>
                <td className="impact">
                  <span className="emoji">{row.impact}</span>
                </td>
                <td className="problemes">
                  <ul>
                    {row.problemes.map((prob, index) => (
                      <li key={index}>
                        {prob.texte}{" "}
                        <span className="pourcentage">
                          ({prob.pourcentage})
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td
                  className={`tendance ${
                    row.tendance.includes("+")
                      ? "positive"
                      : row.tendance.includes("-")
                      ? "negative"
                      : "neutral"
                  }`}
                >
                  {row.tendance}
                </td>

                <td className="details">
                  <span className="details-icon">🔍</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Technologie;

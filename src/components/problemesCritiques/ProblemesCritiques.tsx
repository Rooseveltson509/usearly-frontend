import React from "react";
import "./ProblemesCritiques.scss";

const ProblemesCritiques: React.FC = () => {
  return (
    <div className="problemes-critiques">
      <div className="header">
        <h3>
          Problèmes critiques 🔥,{" "}
          <span className="highlight">impact et recommandations</span>
        </h3>
        <button className="btn-filter">
          Filtrer
          <span className="arrow-down">▼</span>
        </button>
      </div>
      <p className="description">
        Les signalements critiques ont diminué de{" "}
        <span className="highlight">10%</span> par rapport à la semaine
        dernière.
      </p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Problème</th>
              <th>Signal.</th>
              <th>A définir</th>
              <th>Impact émotionnel</th>
              <th>Verbatim</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="dot red"></span> Validation bancaire bloquée
              </td>
              <td>129</td>
              <td> </td>
              <td>
                <span className="emoji">😡</span> 60%
              </td>
              <td>"Le site bug pendant le paiement."</td>
              <td>
                <span className="details-icon">🔍</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="dot red"></span> Recherche imprécise
              </td>
              <td>29</td>
              <td> </td>
              <td>
                <span className="emoji">😟</span> 50%
              </td>
              <td>"Impossible de trouver ce que..."</td>
              <td>
                <span className="details-icon">🔍</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="dot red"></span> Retards de livraison
              </td>
              <td>17</td>
              <td> </td>
              <td>
                <span className="emoji">😞</span> 40%
              </td>
              <td>"Livraison arrivée plus tard..."</td>
              <td>
                <span className="details-icon">🔍</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemesCritiques;

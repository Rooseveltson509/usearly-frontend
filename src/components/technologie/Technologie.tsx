import React from "react";
import "./Technologie.scss";

const Technologie: React.FC = () => {
  return (
    <div className="technologie">
      <div className="header">
        <h3>Technologie</h3>
        <button className="btn-filter">
          <span className="filter-icon">▼</span>
        </button>
      </div>

      <div className="filter-section">
        <select className="filter-dropdown">
          <option>Navigateurs</option>
          <option>OS</option>
          <option>Devices</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Navigateur</th>
              <th>Signalements</th>
              <th>Problèmes principaux</th>
              <th>Tendances</th>
              <th>Actions suggérées</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chrome</td>
              <td>
                <span className="badge">40%</span> 😡
              </td>
              <td>
                - Bugs de chargement (25%) <br />- Erreurs d'affichage (15%)
              </td>
              <td>
                <span className="trend red">▲5%</span>
              </td>
              <td>Optimisez le chargement et l'affichage dynamique.</td>
              <td>
                <span className="details-icon">🔍</span>
              </td>
            </tr>
            <tr>
              <td>Safari</td>
              <td>
                <span className="badge">35%</span> 😟
              </td>
              <td>
                - Lenteur des pages (20%) <br />- Incompatibilité avec filtres (15%)
              </td>
              <td>
                <span className="trend neutral">—</span>
              </td>
              <td>Analysez les performances sur iOS/macOS.</td>
              <td>
                <span className="details-icon">🔍</span>
              </td>
            </tr>
            <tr>
              <td>Autres (Edge, Firefox, etc.)</td>
              <td>
                <span className="badge">25%</span> 😞
              </td>
              <td>
                - Compatibilité limitée (10%) <br />- Erreur de validation (8%)
              </td>
              <td>
                <span className="trend red">▼2%</span>
              </td>
              <td>Testez la compatibilité fonctionnelle.</td>
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

export default Technologie;

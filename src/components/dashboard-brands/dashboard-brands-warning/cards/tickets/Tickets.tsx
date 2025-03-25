import React from "react";
import "./Tickets.scss";
import searchIcon from "../../../../../assets/icons/search-icon.svg";
import filterIcon from "../../../../../assets/icons/filter-list.svg";
import sortIcon from "../../../../../assets/icons/tri-list.svg";
import closeIcon from "../../../../../assets/icons/close-icon.svg";
import deviceErrorIcon from "../../../../../assets/icons/device-error.svg";
import shopErrorIcon from "../../../../../assets/icons/shop-error.svg";
import deliveryErrorIcon from "../../../../../assets/icons/delivery-error.svg";
import cardErrorIcon from "../../../../../assets/icons/card-error.svg";
import pageErrorIcon from "../../../../../assets/icons/page-error.svg";
import userAvatar from "../../../../../assets/images/slide1.jpg"; // Avatar par défaut
import defaultAvatar from "../../../../../assets/images/user.png"; // Avatar par défaut

const TicketsTable: React.FC = () => {
  return (
    <div className="tickets-container">
      {/* 🔎 Barre de recherche et filtres */}
      <div className="tickets-header">
        <div className="priority-tags">
          <div className="priority">
            Critique{" "}
            <span>
              10 <span className="critical">+2</span>
            </span>
          </div>
          <div className="priority">
            Majeur{" "}
            <span>
              22 <span className="major">+4</span>
            </span>
          </div>
          <div className="priority">
            Mineur{" "}
            <span>
              34 <span className="minor"> +3</span>
            </span>
          </div>
        </div>

        <div className="search-filters">
          <button className="filter-button">
            <img src={sortIcon} alt="Trier" />
            Trier
          </button>
          <button className="filter-button">
            <img src={filterIcon} alt="Filtrer" />
            Filtrer
          </button>
          <div className="search-bar">
            <input type="text" placeholder="Rechercher" />
            <img src={searchIcon} alt="Rechercher" />
          </div>
        </div>
      </div>

      {/* 🏷️ Tags de filtres sélectionnés */}
      <div className="selected-filters">
        <span className="filter-tag">
          Identification <img src={closeIcon} alt="close-btn" />
        </span>
        <span className="filter-tag">
          Page produit <img src={closeIcon} alt="close-btn" />
        </span>
        <span className="filter-tag">
          Paiement <img src={closeIcon} alt="close-btn" />
        </span>
      </div>

      {/* 📋 Tableau des tickets */}
      <table className="tickets-table">
        <thead>
          <tr>
            <th className="textStart">Titre du ticket</th>
            <th>Catégorie</th>
            <th>Création</th>
            <th>Signalement</th>
            <th>Config</th>
            <th>Réponse</th>
            <th>Solution</th>
            <th className="textStart">Statut</th>
            <th>Membre</th>
          </tr>
        </thead>
        <tbody>
          <tr className="ticket-row critical">
            <td className="textStart">
              <span className="ticket-priority red"></span> Erreur 404 (page
              article X)
            </td>
            <td>
              <img src={pageErrorIcon} alt="page-error" />
            </td>
            <td>30 min</td>
            <td>
              <span className="bordered-cell">34</span>
            </td>
            <td>4</td>
            <td>0</td>
            <td>0</td>
            <td className="textStart">
              <span className="status open">Ouvert</span>
            </td>
            <td>
              <img src={defaultAvatar} alt="Avatar" className="avatar" />
            </td>
          </tr>
          <tr className="ticket-row minor">
            <td className="textStart">
              <span className="ticket-priority blue"></span> Enregistrement de
              carte bancaire...
            </td>
            <td>
              <img src={cardErrorIcon} alt="card-error" />
            </td>
            <td>12 h</td>
            <td>
              <span className="bordered-cell">120</span>
            </td>
            <td>8</td>
            <td>0</td>
            <td>0</td>
            <td className="textStart">
              <span className="status progress">En cours</span>
            </td>
            <td>
              <img src={userAvatar} alt="Avatar" className="avatar" />
            </td>
          </tr>
          <tr className="ticket-row major">
            <td className="textStart">
              <span className="ticket-priority yellow"></span> Suivi de
              livraison non mis à jour
            </td>
            <td>
              <img src={deliveryErrorIcon} alt="delivery-error" />
            </td>
            <td>1 jour</td>
            <td>
              <span className="bordered-cell">9</span>
            </td>
            <td>5</td>
            <td>0</td>
            <td>0</td>
            <td className="textStart">
              <span className="status open">Ouvert</span>
            </td>
            <td>
              <img src={defaultAvatar} alt="Avatar" className="avatar" />
            </td>
          </tr>
          <tr className="ticket-row critical">
            <td className="textStart">
              <span className="ticket-priority orange"></span> Affichage non
              responsive
            </td>
            <td>
              <img src={deviceErrorIcon} alt="device-error" />
            </td>
            <td>2 jours</td>
            <td>
              <span className="bordered-cell">53</span>
            </td>
            <td>6</td>
            <td>1</td>
            <td>1</td>
            <td className="textStart">
              <span className="status resolved">Résolu</span>
            </td>
            <td>
              <img src={userAvatar} alt="Avatar" className="avatar" />
            </td>
          </tr>
          <tr className="ticket-row critical">
            <td className="textStart">
              <span className="ticket-priority yellow"></span> Impossible
              d'ajouter un produit
            </td>
            <td>
              <img src={shopErrorIcon} alt="shop-error" />
            </td>
            <td>4 jours</td>
            <td>
              <span className="bordered-cell">29</span>
            </td>
            <td>5</td>
            <td>1</td>
            <td>0</td>
            <td className="textStart">
              <span className="status pending">En attente de solution</span>
            </td>
            <td>
              <img src={userAvatar} alt="Avatar" className="avatar" />
            </td>
          </tr>
        </tbody>
      </table>

      <button className="load-more">Voir plus</button>
    </div>
  );
};

export default TicketsTable;

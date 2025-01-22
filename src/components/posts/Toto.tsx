import React, { useEffect, useState } from "react";
import "./MainContent.scss";
import { fetchReports } from "../../services/apiService";
import { Reports } from "../../types/Reports";
import { useAuth } from "../../contexts/AuthContext"; // Importer le contexte Auth
import defaultAvatar from "../../assets/images/user.png";

const MainContent: React.FC = () => {
  const { userProfile } = useAuth(); // Récupérer les données utilisateur depuis le contexte
  const [reports, setReports] = useState<Reports[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États pour les menus déroulants
  const [abonnementsMenuOpen, setAbonnementsMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // États pour les options sélectionnées
  const [selectedAbonnement, setSelectedAbonnement] = useState("Abonnements");
  const [selectedFilter, setSelectedFilter] = useState("Filtrer");

  useEffect(() => {
    const loadReports = async () => {
      console.log("Chargement des rapports...");
      setLoading(true);
      try {
        const data = await fetchReports(currentPage, 5);
        console.log("Données reçues :", data);
        setReports(data.reports);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        console.error("Erreur lors du chargement des rapports :", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [currentPage]);

  // Gestion des clics en dehors des menus pour les fermer
  useEffect(() => {
    const handleClickOutside = () => {
      setAbonnementsMenuOpen(false);
      setFilterMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="main-content">
      <div className="filter-bar">
        <div className="filters">
          {/* Menu déroulant pour Abonnements */}
          <div
            className="dropdown"
            onClick={(e) => {
              e.stopPropagation(); // Empêche la fermeture immédiate
              setAbonnementsMenuOpen((prev) => !prev);
              setFilterMenuOpen(false); // Ferme l'autre menu
            }}
          >
            <button className="dropdown-button">
              {selectedAbonnement}{" "}
              <span className={`chevron ${abonnementsMenuOpen ? "rotated" : ""}`}>▼</span>
            </button>
            {abonnementsMenuOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedAbonnement("Abonnements");
                    setAbonnementsMenuOpen(false);
                  }}
                >
                  Abonnements
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedAbonnement("Populaire");
                    setAbonnementsMenuOpen(false);
                  }}
                >
                  Populaire
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedAbonnement("Nouveautés");
                    setAbonnementsMenuOpen(false);
                  }}
                >
                  Nouveautés
                </div>
              </div>
            )}
          </div>

          {/* Menu déroulant pour Filtrer */}
          <div
            className="dropdown"
            onClick={(e) => {
              e.stopPropagation(); // Empêche la fermeture immédiate
              setFilterMenuOpen((prev) => !prev);
              setAbonnementsMenuOpen(false); // Ferme l'autre menu
            }}
          >
            <button className="dropdown-button">
              {selectedFilter}{" "}
              <span className={`chevron ${filterMenuOpen ? "rotated" : ""}`}>▼</span>
            </button>
            {filterMenuOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedFilter("Option 1");
                    setFilterMenuOpen(false);
                  }}
                >
                  Option 1
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedFilter("Option 2");
                    setFilterMenuOpen(false);
                  }}
                >
                  Option 2
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedFilter("Option 3");
                    setFilterMenuOpen(false);
                  }}
                >
                  Option 3
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Rechercher une marque" />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="alert-box">
        <img
          src={
            userProfile?.avatar
              ? `${import.meta.env.VITE_API_BASE_URL}/${userProfile.avatar}`
              : defaultAvatar
          }
          alt="User Avatar"
        />
        <input type="text" placeholder="C'est moi ou 'nom de la marque' bug ?" />
      </div>

      {loading && <p className="loading-message">Chargement en cours...</p>}
      {error && <p className="error-message">{error}</p>}
      {reports && reports.length > 0 ? (
        reports.map((report) => (
          <div className="report-card" key={report.id}>
            <div className="card-header">
              <div className="brand-info">
                <img
                  src="/path/to/brand-logo.jpg"
                  alt={report.marque}
                  className="brand-logo"
                />
                <span className="brand-name">{report.marque}</span>
              </div>
              <span className="time-info">
                {new Date(report.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="card-content">
              <h3 className="report-title">{report.description}</h3>
              <p className="report-details">{report.bugLocation}</p>
            </div>
            <div className="card-footer">
              <span>{report.emojis}</span>
              <button className="check-button">Je check</button>
            </div>
          </div>
        ))
      ) : (
        !loading && <p>Aucun rapport trouvé.</p>
      )}
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default MainContent;
import React, { useEffect, useState } from "react";
import "./MainContent.scss";
import {
    fetchReports,
    fetchCoupsdeCoeur,
    fetchSuggestions,
} from "../../services/apiService";
import { Reports, ReportsResponse } from "../../types/Reports";
import { useAuth } from "../../contexts/AuthContext";
import defaultAvatar from "../../assets/images/user.png";
import signalIcon from "../../assets/images/signalIcon.svg";
import baguette from "../../assets/images/baguette.svg";
import cdc from "../../assets/images/cdc.svg";
import { motion } from "framer-motion";

const brands = ["Nike", "Adidas", "Puma", "Apple", "Samsung", "Tesla"];

const MainContent: React.FC = () => {
    const { userProfile } = useAuth();
    const [reports, setReports] = useState<Reports[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");

    // États pour les menus déroulants
    const [abonnementsMenuOpen, setAbonnementsMenuOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Filtrer");
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);

    // État du filtre sélectionné
    const [selectedAbonnement, setSelectedAbonnement] = useState("Signalements");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                let data;
                let formattedData: ReportsResponse;

                if (selectedAbonnement === "CoupdeCoeur") {
                    data = await fetchCoupsdeCoeur(currentPage, 5);
                    formattedData = {
                        totalReports: data.totalCoupsdeCoeur,
                        currentPage: data.currentPage,
                        totalPages: data.totalPages,
                        reports: data.coupsdeCoeur,
                    };
                } else if (selectedAbonnement === "Suggestions") {
                    data = await fetchSuggestions(currentPage, 5);
                    formattedData = {
                        totalReports: data.totalSuggestions,
                        currentPage: data.currentPage,
                        totalPages: data.totalPages,
                        reports: data.suggestions,
                    };
                } else {
                    formattedData = await fetchReports(currentPage, 5);
                }

                setReports(formattedData.reports);
                setTotalPages(formattedData.totalPages);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
                setError("Erreur lors du chargement des données.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentPage, selectedAbonnement]);

    // Réinitialiser la page à 1 lorsque le filtre change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedAbonnement]);

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

    const handleInputClick = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    const handleSubmit = () => {
        console.log("Post soumis :", { title, description, selectedBrand });
        setShowPopup(false);
    };

// Fonction pour récupérer l'icône associée au type de report
const getIconByFilter = (selectedAbonnement: string) => {
    switch (selectedAbonnement) {
        case "Signalements":
            return signalIcon; // Icône pour Signalement
        case "CoupdeCoeur":
            return cdc; // Icône pour Suggestion
        case "Suggestions":
            return baguette; // Icône pour Coup de cœur
        default:
            return signalIcon; // Icône par défaut si aucun type trouvé
    }
};



    return (
        <div className="main-content">
            <div className="filter-bar">
                <button
                    className={`filter-button ${selectedFilter === "Actualité" ? "active" : ""}`}
                    onClick={() => setSelectedFilter("Actualité")}
                >
                    Actualité
                </button>
                <div className="dropdown">
                    <button
                        className="dropdown-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setAbonnementsMenuOpen((prev) => !prev);
                        }}
                    >
                        {selectedAbonnement}{" "}
                        <span className={`chevron ${abonnementsMenuOpen ? "rotated" : ""}`}>
                            ▼
                        </span>
                    </button>
                    {abonnementsMenuOpen && (
                        <div className="dropdown-menu">
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedAbonnement("Signalements");
                                    setAbonnementsMenuOpen(false);
                                }}
                            >
                                {" "}
                                Signalements{" "}
                            </div>
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedAbonnement("CoupdeCoeur");
                                    setAbonnementsMenuOpen(false);
                                }}
                            >
                                {" "}
                                Coup de Cœur{" "}
                            </div>
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedAbonnement("Suggestions");
                                    setAbonnementsMenuOpen(false);
                                }}
                            >
                                {" "}
                                Suggestions{" "}
                            </div>
                        </div>
                    )}
                </div>
                <div className="dropdown">
                    <button
                        className="dropdown-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFilterMenuOpen((prev) => !prev);
                        }}
                    >
                        {selectedFilter}{" "}
                        <span className={`chevron ${filterMenuOpen ? "rotated" : ""}`}>
                            ▼
                        </span>
                    </button>
                    {filterMenuOpen && (
                        <div className="dropdown-menu">
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedFilter("Filtre 1");
                                    setFilterMenuOpen(false);
                                }}
                            >
                                {" "}
                                Filtre 1{" "}
                            </div>
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedFilter("Filtre 2");
                                    setFilterMenuOpen(false);
                                }}
                            >
                                {" "}
                                Filtre 2{" "}
                            </div>
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedFilter("Filtre 3");
                                    setFilterMenuOpen(false);
                                }}
                            >
                                {" "}
                                Filtre 3{" "}
                            </div>
                        </div>
                    )}
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Rechercher une marque" />
                    <span className="search-icon">🔍</span>
                </div>
            </div>

            <div className="alert-box" onClick={handleInputClick}>
                <img
                    src={
                        userProfile?.avatar
                            ? `${import.meta.env.VITE_API_BASE_URL}/${userProfile.avatar}`
                            : defaultAvatar
                    }
                    alt="User Avatar"
                />
                <input
                    type="text"
                    placeholder="C'est moi ou 'nom de la marque' bug ?"
                    readOnly
                />
            </div>
            {showPopup && (
                <div className="overlay" onClick={handleClosePopup}>
                    <motion.div
                        className="popup"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Créer un post</h2>
                        <input
                            type="text"
                            placeholder="Saisir un titre"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Décrivez votre problème"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                        >
                            <option value="">Sélectionnez une marque</option>
                            {brands.map((brand, index) => (
                                <option key={index} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                        <div className="button-group">
                            <button onClick={handleClosePopup} className="cancel">
                                Annuler
                            </button>
                            <button onClick={handleSubmit} className="submit">
                                Publier
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {loading && <p className="loading-message">Chargement en cours...</p>}
            {error && <p className="error-message">{error}</p>}
            {reports.length > 0 ? (
                reports.map((report) => (
                    <div className="report-card" key={report.id}>
                        {/* Header avec une alerte et l'info du temps */}
                        <div className="card-header">
                            <div className="alert-info">
                                <span className="alert-icon"><img src={signalIcon} alt="signal comment" /></span>
                                <span>{report.marque} a besoin de vous pour résoudre ce problème !</span>
                            </div>
                            <span className="time-info">
                                {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Contenu principal */}
                        <div className="card-content">
                            <p className="report-title">
                                <span className="alert-icon"><img src={getIconByFilter(selectedAbonnement)} alt={selectedAbonnement}  /></span>
                                {report.categories && report.categories.length > 3 ? (
                                    <span className="category-tag">
                                        {report.categories[3].name}📌 {/* Affiche la quatrième catégorie seulement si elle existe */}
                                    </span>
                                ) : report.categories && report.categories.length > 0 ? (
                                    <span className="category-tag">
                                        {report.categories[0].name}📌 {/* Affiche la première catégorie si la quatrième n'existe pas */}
                                    </span>
                                ) : (
                                    <span className="category-tag">Autre</span>
                                )}
                                {/* <strong>{report.User.pseudo}</strong> 📌 */}
                            </p>
                            <p className="report-description">
                                {report.description.length > 150
                                    ? `${report.description.substring(0, 150)}... `
                                    : report.description}
                                {report.description.length > 150 && (
                                    <span className="see-more">Voir plus</span>
                                )}
                            </p>
                        </div>

                        {/* Footer avec réactions et bouton */}
                        <div className="card-footer">
                            <div className="reactions">
                                <span className="emoji">{report.emojis}</span>
                                <span className="signalement-count">{report.nbrLikes} signalements</span>
                                <span className="comment-icon">💬 {/* report.nbrComments || */ 0}</span>
                            </div>
                            <button className="check-button">Je check</button>
                        </div>
                    </div>
                ))
            ) : !loading && (
                <p>Aucune donnée trouvée.</p>
            )}

            {/* Pagination Style 2 */}

            {/*  <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`page-btn ${currentPage === 1 ? "disabled" : ""}`}
        >
          ◀ Précédent
        </button>

        {currentPage > 3 && (
          <>
            <button className="page-btn" onClick={() => setCurrentPage(1)}>
              1
            </button>
            <span className="dots">...</span>
          </>
        )}

        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 2 && page <= currentPage + 2)
          )
          .map((page) => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

        {currentPage < totalPages - 2 && (
          <>
            <span className="dots">...</span>
            <button
              className="page-btn"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`page-btn ${currentPage === totalPages ? "disabled" : ""}`}
        >
          Suivant ▶
        </button>
      </div> */}

            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Précédent
                </button>
                <span>
                    Page {currentPage} sur {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default MainContent;

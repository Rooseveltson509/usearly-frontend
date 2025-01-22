import React, { useEffect, useState } from "react";
import "./MainContent.scss";
import { fetchReports, fetchCoupsdeCoeur, fetchSuggestions } from "../../services/apiService";
import { Reports } from "../../types/Reports";
import { useAuth } from "../../contexts/AuthContext";
import defaultAvatar from "../../assets/images/user.png";
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
                if (selectedAbonnement === "CoupdeCoeur") {
                    data = await fetchCoupsdeCoeur(currentPage, 5);
                    setReports(data.coupsdeCoeur);
                } else if (selectedAbonnement === "Suggestions") {
                    data = await fetchSuggestions(currentPage, 5);
                    setReports(data.suggestions);
                } else {
                    data = await fetchReports(currentPage, 5);
                    setReports(data.reports);
                }
                setTotalPages(data.totalPages);
            } catch (error: any) {
                setError("Erreur lors du chargement des données.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentPage, selectedAbonnement]);

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

    return (
        <div className="main-content">
            <div className="filter-bar">
                <button className={`filter-button ${selectedFilter === "Actualité" ? "active" : ""}`} onClick={() => setSelectedFilter("Actualité")}>
                    Actualité
                </button>
                <div className="dropdown">
                    <button className="dropdown-button" onClick={(e) => { e.stopPropagation(); setAbonnementsMenuOpen((prev) => !prev); }} >
                        {selectedAbonnement}{" "}
                        <span className={`chevron ${abonnementsMenuOpen ? "rotated" : ""}`}>▼</span>
                    </button>
                    {abonnementsMenuOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => { setSelectedAbonnement("Signalements"); setAbonnementsMenuOpen(false); }} > Signalements </div>
                            <div className="dropdown-item" onClick={() => { setSelectedAbonnement("CoupdeCoeur"); setAbonnementsMenuOpen(false); }} > Coup de Cœur </div>
                            <div className="dropdown-item" onClick={() => { setSelectedAbonnement("Suggestions"); setAbonnementsMenuOpen(false); }} > Suggestions </div>
                        </div>
                    )}
                </div>
                <div className="dropdown">
                    <button className="dropdown-button" onClick={(e) => { e.stopPropagation(); setFilterMenuOpen((prev) => !prev); }} >
                        {selectedFilter}{" "}
                        <span className={`chevron ${filterMenuOpen ? "rotated" : ""}`}>▼</span>
                    </button>
                    {filterMenuOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => { setSelectedFilter("Filtre 1"); setFilterMenuOpen(false); }}> Filtre 1 </div>
                            <div className="dropdown-item" onClick={() => { setSelectedFilter("Filtre 2"); setFilterMenuOpen(false); }}> Filtre 2 </div>
                            <div className="dropdown-item" onClick={() => { setSelectedFilter("Filtre 3"); setFilterMenuOpen(false); }}> Filtre 3 </div>
                        </div>
                    )}
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Rechercher une marque" />
                    <span className="search-icon">🔍</span>
                </div>
            </div>

            <div className="alert-box" onClick={handleInputClick}>
                <img src={
                    userProfile?.avatar
                        ? `${import.meta.env.VITE_API_BASE_URL}/${userProfile.avatar}`
                        : defaultAvatar
                } alt="User Avatar" />
                <input type="text" placeholder="C'est moi ou 'nom de la marque' bug ?" readOnly />
            </div>
            {showPopup && (
                <div className="overlay" onClick={handleClosePopup}>
                    <motion.div className="popup" initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={(e) => e.stopPropagation()} >
                        <h2>Créer un post</h2>
                        <input type="text" placeholder="Saisir un titre" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <textarea placeholder="Décrivez votre problème" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                            <option value="">Sélectionnez une marque</option>
                            {brands.map((brand, index) => (
                                <option key={index} value={brand}>{brand}</option>
                            ))}
                        </select>
                        <div className="button-group">
                            <button onClick={handleClosePopup} className="cancel">Annuler</button>
                            <button onClick={handleSubmit} className="submit">Publier</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {loading && <p className="loading-message">Chargement en cours...</p>}
            {error && <p className="error-message">{error}</p>}
            {reports.length > 0 ? (
                reports.map((report) => (
                    <div className="report-card" key={report.id}>
                        <div className="card-header">
                            <span className="brand-name">{report.marque}</span>
                            <span className="time-info">
                                {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="card-content">
                            <p className="report-title">{report.description}</p>
                            <p className="report-details">{report.bugLocation || report.emplacement}</p>
                            <span>{report.nbrLikes}</span>
                        </div>
                        <div className="card-footer">
                            <span>{report.emojis}</span>
                            <button className="check-button">Je check</button>
                        </div>
                    </div>
                ))
            ) : (
                !loading && <p>Aucune donnée trouvée.</p>
            )}

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
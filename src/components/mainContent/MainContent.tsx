import React, { useEffect, useState } from "react";
import "./MainContent.scss";
import {
  fetchReports,
  fetchCoupsdeCoeur,
  fetchSuggestions,
  fetchPosts,
  fetchBrands,
  fetchBrandByName,
} from "../../services/apiService";
import { Reports, ReportsResponse } from "../../types/Reports";
import { useAuth } from "../../contexts/AuthContext";
import defaultAvatar from "../../assets/images/user.png";
import signalIcon from "../../assets/images/signalIcon.svg";
import baguette from "../../assets/images/baguette.svg";
import cdc from "../../assets/images/cdc.svg";
import { Brand, Post } from "@src/types/types";
import CreatePostPopup from "../posts/createPostPopup/CreatePostPopup";
import PostList from "../posts/postList/PostList";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import defaultBrandAvatar from "@src/assets/images/user.png"; // ✅ Image par défaut pour les marques
import axios from "axios";

//const brands = ["Nike", "Adidas", "Puma", "Apple", "Samsung", "Tesla"];

const MainContent: React.FC = () => {
  const { userProfile } = useAuth();
  const [reports, setReports] = useState<Reports[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]); // ✅ Stocker les marques
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(0);
  const [brandData, setBrandData] = useState<{
    [key: string]: { name: string; avatar: string };
  }>({});
  // ✅ Définition du type pour éviter l'erreur TypeScript
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});
  // États pour les menus déroulants
  const [abonnementsMenuOpen, setAbonnementsMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Filtrer");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // État du filtre sélectionné
  const [selectedAbonnement, setSelectedAbonnement] = useState("Signalements");

  // 🚀 Charger les posts quand "Actualité" est sélectionné
  useEffect(() => {
    if (selectedFilter === "Actualité") {
      const loadPosts = async () => {
        try {
          setLoading(true);
          const fetchedPosts = await fetchPosts();
          setPosts(fetchedPosts.posts);
        } catch (error) {
          console.error("Erreur lors de la récupération des posts :", error);
        } finally {
          setLoading(false);
        }
      };
      loadPosts();
    }
  }, [selectedFilter]);

  useEffect(() => {
    console.log("User rôle: ", userProfile);
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
  }, [currentPage, selectedAbonnement, userProfile]);

  // 🚀 **Récupérer les posts**
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await fetchPosts(postsPage, 5); // ✅ Récupère les posts paginés
        setPosts(fetchedPosts.posts);
        setPostsTotalPages(fetchedPosts.totalPages); // ✅ Met à jour le nombre total de pages
      } catch (error) {
        console.error("Erreur lors du chargement des posts :", error);
      }
      setLoading(false);
    };

    if (selectedFilter === "Actualité") {
      loadPosts();
    }
  }, [selectedFilter, postsPage]); // ✅ Met à jour seulement pour "Actualité"

  // 🚀 **Récupérer les marques pour l'input de sélection**
  useEffect(() => {
    const loadBrands = async () => {
      const fetchedBrands = await fetchBrands();
      setBrands(fetchedBrands);
    };
    loadBrands();
  }, []);

  // ✅ **Ajoute un post au mur après création**
  const handleNewPost = (newPost: Post) => {
     console.log("🚀 Nouveau post ajouté :", newPost);
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setSelectedFilter("Actualité"); // Active automatiquement l'affichage des posts
  };

  useEffect(() => {
    const fetchBrandInfo = async () => {
      const brandsInfo: { [key: string]: { name: string; avatar: string } } =
        {};
      const uniqueBrandNames = new Set(
        reports
          .map((report) => extractBrandName(report.marque))
          .filter((brandName) => brandName && brandName !== "localhost") // ✅ Ignore les noms invalides
      );

      const fetchBrandPromises = Array.from(uniqueBrandNames)
        .filter((brandName) => !brandData[brandName]) // ✅ Ne charge pas les marques déjà connues
        .map(async (brandName) => {
          try {
            const brandInfo = await fetchBrandByName(brandName);
            if (brandInfo) {
              brandsInfo[brandName] = {
                name: brandName,
                avatar: brandInfo.avatar
                  ? brandInfo.avatar
                  : defaultBrandAvatar,
              };
            }
          } catch (error) {
            // ✅ Correction : Typage strict pour l'erreur Axios
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              brandsInfo[brandName] = {
                name: brandName,
                avatar: defaultBrandAvatar,
              };
            } else {
              console.error(`🚨 Erreur API pour ${brandName}:`, error);
            }
          }
        });

      await Promise.all(fetchBrandPromises);
      setBrandData((prev) => ({ ...prev, ...brandsInfo }));
    };

    if (reports.length > 0) {
      fetchBrandInfo();
    }
  }, [reports]);

  const extractBrandName = (url: string) => url.split(".")[0];

  // Réinitialiser la page à 1 lorsque le filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAbonnement]);

  const handleInputClick = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

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

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId], // ✅ Clé en `string`
    }));
  };

  return (
    <div className="main-content">
      <div className="filter-bar">
        <button
          className={`filter-button ${
            selectedFilter === "Actualité" ? "active" : ""
          }`}
          onClick={() => setSelectedFilter("Actualité")}
        >
          Actualité
        </button>

        {/* Menu déroulant pour "Signalements", "Coup de Cœur", "Suggestions" */}
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={(e) => {
              e.stopPropagation();
              setAbonnementsMenuOpen((prev) => !prev);
            }}
          >
            {selectedAbonnement || "Choisir une catégorie"}{" "}
            <span className={`chevron ${abonnementsMenuOpen ? "rotated" : ""}`}>
              <i className="fa fa-chevron-down"></i>
            </span>
          </button>
          {abonnementsMenuOpen && (
            <div className="dropdown-menu">
              {["Signalements", "CoupdeCoeur", "Suggestions"].map((filter) => (
                <div
                  key={filter}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedAbonnement(filter); // ✅ Seul selectedAbonnement est mis à jour
                    setSelectedFilter("Filtrer"); // ✅ L'autre filtre reste indépendant
                    setAbonnementsMenuOpen(false);
                  }}
                >
                  {filter}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu déroulant des sous-filtres (Marques par exemple) */}
        {selectedAbonnement && (
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
                <i className="fa fa-chevron-down"></i>
              </span>
            </button>
            {filterMenuOpen && (
              <div className="dropdown-menu">
                {["Filtre 1", "Filtre 2", "Filtre 3"].map((subFilter) => (
                  <div
                    key={subFilter}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedFilter(subFilter); // ✅ Mise à jour du sous-filtre seulement
                      setFilterMenuOpen(false);
                    }}
                  >
                    {subFilter}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Barre de recherche */}
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
        <CreatePostPopup
          brands={brands} // ✅ Liste des marques
          onPostCreated={handleNewPost} // ✅ Ajoute le post immédiatement
          onClose={handleClosePopup} // ✅ Ferme le popup après soumission
        />
      )}
      {selectedFilter === "Actualité" ? (
        <>
          {loading && <p className="loading-message">Chargement en cours...</p>}
          {error && <p className="error-message">{error}</p>}
          {posts.length > 0 ? (
            posts.map((post) => <PostList key={post.id} post={post} />)
          ) : (
            <p>Aucun post disponible.</p>
          )}
        </>
      ) : (
        <>
          {loading && <p className="loading-message">Chargement en cours...</p>}
          {error && <p className="error-message">{error}</p>}
          {reports.length > 0 ? (
            reports.map((report) => {
              const brandName = extractBrandName(report.marque);
              const brandInfo = brandData[brandName] || {
                name: brandName,
                avatar: defaultBrandAvatar,
              };
              return (
                <div className="post-card" key={report.id}>
                  {/* HEADER */}
                  <div className="post-header">
                    <div className="user-info">
                      <img
                        src={
                          report.User?.avatar
                            ? `${import.meta.env.VITE_API_BASE_URL}/${
                                report.User.avatar
                              }`
                            : defaultAvatar
                        }
                        alt="Avatar"
                        className="user-avatar"
                      />
                      {/* c'est ici qu'on récupère la marque avec l'extension (report.marque) */}
                      <span className="post-author">
                        C’est moi ou <strong>{brandInfo.name}</strong> ?
                      </span>
                      <span className="post-time">
                        • {formatRelativeTime(report.createdAt)}
                      </span>
                    </div>
                    <div className="post-options">⋮</div>
                  </div>

                  {/* CONTENU DU POST */}
                  <div className="post-content">
                    <div className="post-icon">
                      {" "}
                      <span className="alert-icon">
                        <img
                          src={getIconByFilter(selectedAbonnement)}
                          alt={selectedAbonnement}
                        />
                      </span>
                    </div>
                    <div className="post-details">
                      {report.categories && report.categories.length > 0 ? (
                        <h3 className="post-title">
                          {report.categories[0].name} 📌 🔥
                        </h3>
                      ) : (
                        <h3 className="post-title">Autre 🔥</h3>
                      )}
                      <p className="post-description">
                        {expandedPosts[report.id] ? (
                          <>
                            {report.description}{" "}
                            <span
                              className="see-more"
                              onClick={() => toggleExpand(report.id)} // ✅ Masquer le texte quand cliqué
                              style={{ cursor: "pointer", color: "blue" }}
                            >
                              Voir moins
                            </span>
                          </>
                        ) : (
                          <>
                            {report.description.length > 150
                              ? `${report.description.substring(0, 150)}... `
                              : report.description}
                            {report.description.length > 150 && (
                              <span
                                className="see-more"
                                onClick={() => toggleExpand(report.id)} // ✅ Afficher plus quand cliqué
                                style={{ cursor: "pointer", color: "blue" }}
                              >
                                Voir plus
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                    {brandInfo.avatar && (
                      <img
                        src={brandInfo.avatar}
                        alt={brandInfo.name}
                        className="brand-logo"
                      />
                    )}
                    {/*  
              {post.brand?.avatar && ( // ✅ Vérification que brand existe bien avant d'afficher l'avatar
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${
                        post.brand.avatar
                      }`}
                      alt="Brand Logo"
                      className="brand-logo"
                    />
                  )} 
                   */}
                  </div>

                  {/* FOOTER */}
                  <div className="post-footer">
                    <div className="reaction">
                      <span className="emoji">{report.emojis}</span>{" "}
                      <span>Early signalement</span>
                    </div>
                    <div className="icons">
                      <span className="icon">💡 {report.nbrLikes}</span>
                      <span className="icon">💬 {0}</span>
                      {/* <span className="icon">💬 {post.comments?.length || 0}</span> */}
                    </div>
                    <div className="card-footer">
                      <button className="check-button">Je check</button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Aucune donnée trouvée.</p>
          )}
        </>
      )}

      <div className="pagination">
        {selectedFilter === "Actualité" ? (
          <>
            <button
              onClick={() => setPostsPage(postsPage - 1)}
              disabled={postsPage === 1}
            >
              Précédent
            </button>
            <span>
              Page {postsPage} sur {postsTotalPages}
            </span>
            <button
              onClick={() => setPostsPage(postsPage + 1)}
              disabled={postsPage === postsTotalPages}
            >
              Suivant
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            <span>
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MainContent;

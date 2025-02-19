import React, { useEffect, useState } from "react";
import "./MainContent.scss";
import {
  fetchReports,
  fetchCoupsdeCoeur,
  fetchSuggestions,
  fetchPosts,
} from "../../services/apiService";
import { Cdc, Reports, Suggestion } from "../../types/Reports";
//import { useAuth } from "../../contexts/AuthContext";
import signalIcon from "../../assets/images/signalIcon.svg";
import baguette from "../../assets/images/baguette.svg";
import cdc from "../../assets/images/cdc.svg";
import { Post } from "@src/types/types";
//import CreatePostPopup from "../posts/createPostPopup/CreatePostPopup";
import PostList from "../posts/postList/PostList";
import ReportCard from "../reportCard/ReportCard";
import CoupDeCoeurCard from "../cdc/CoupDeCoeurCard";
import SuggestionCard from "../suggestion/SuggestionCard";

const MainContent: React.FC = () => {
  //const { userProfile } = useAuth();
  const [reports, setReports] = useState<Reports[]>([]);
  const [coupDeCoeurs, setCoupDeCoeurs] = useState<Cdc[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedType, setSelectedType] = useState("report"); // Par défaut, affiche les reports
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //const [showPopup, setShowPopup] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("Actualité");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedAbonnement, setSelectedAbonnement] = useState("Signalements");

  // 📌 Fonction pour récupérer l'icône du filtre sélectionné
  const getIconByFilter = (filter: string) => {
    switch (filter) {
      case "Signalements":
        return signalIcon;
      case "Coup de Cœur":
        return cdc;
      case "Suggestions":
        return baguette;
      default:
        return signalIcon;
    }
  };

  // 📌 Charger les posts quand "Actualité" est sélectionné
  useEffect(() => {
    if (selectedFilter === "Actualité") {
      const loadPosts = async () => {
        try {
          setLoading(true);
          console.log("📥 Chargement des posts...");
          const fetchedPosts = await fetchPosts(postsPage, 5);
          console.log("✅ Posts récupérés :", fetchedPosts);
          setPosts(fetchedPosts.posts);
          setPostsTotalPages(fetchedPosts.totalPages);
        } catch (error) {
          console.error("❌ Erreur lors de la récupération des posts :", error);
        } finally {
          setLoading(false);
        }
      };
      loadPosts();
    }
  }, [selectedFilter, postsPage]);

  // 📌 Charger les signalements, coups de cœur et suggestions
/*   useEffect(() => {
    if (selectedFilter !== "Actualité") {
      setLoading(true);
      setError(null);

      const loadData = async () => {
        try {
          let formattedData: ReportsResponse;

          if (selectedFilter === "Coup de Cœur") {
            const data = await fetchCoupsdeCoeur(currentPage, 5);
            formattedData = {
              totalReports: data.totalCoupsdeCoeur,
              currentPage: data.currentPage,
              totalPages: data.totalPages,
              reports: [...data.coupsdeCoeur],
            };
          } else if (selectedFilter === "Suggestions") {
            const data = await fetchSuggestions(currentPage, 5);
            formattedData = {
              totalReports: data.totalSuggestions,
              currentPage: data.currentPage,
              totalPages: data.totalPages,
              reports: [...data.suggestions],
            };
          } else {
            const data = await fetchReports(currentPage, 5);
            formattedData = {
              totalReports: data.totalReports,
              currentPage: data.currentPage,
              totalPages: data.totalPages,
              reports: [...data.reports],
            };
          }

          console.log("✅ Données chargées pour :", selectedFilter);
          console.log("📊 Nombre de reports :", formattedData.reports.length);
          console.log("📜 Contenu des reports :", formattedData.reports);

          setReports([...formattedData.reports]);
          setTotalPages(formattedData.totalPages);
        } catch (error) {
          console.error("❌ Erreur lors du chargement des reports :", error);
          setError("Erreur lors du chargement des données.");
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [selectedFilter, currentPage]); */

    useEffect(() => {
      if (selectedFilter !== "Actualité") {
        setLoading(true);
        setError(null);

        const loadData = async () => {
          try {
            if (selectedFilter === "Coup de Cœur") {
              const data = await fetchCoupsdeCoeur(currentPage, 5);
              setCoupDeCoeurs(data.coupdeCoeurs);
              setSelectedType("coupdecoeur"); // ✅ Définir le type pour le rendu
              setTotalPages(data.totalPages);
            } else if (selectedFilter === "Suggestions") {
              const data = await fetchSuggestions(currentPage, 5);
              setSuggestions(data.suggestions);
              setSelectedType("suggestion"); // ✅ Définir le type pour le rendu
              setTotalPages(data.totalPages);
            } else {
              const data = await fetchReports(currentPage, 5);
              setReports(data.reports);
              setTotalPages(data.totalPages);
              setSelectedType("report"); // ✅ Définir le type pour le rendu
            }
          } catch (error) {
            console.error("❌ Erreur lors du chargement des données :", error);
            setError("Erreur lors du chargement des données.");
          } finally {
            setLoading(false);
          }
        };

        loadData();
      }
    }, [selectedFilter, currentPage]);

/*   useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedType === "report") {
          const response = await fetchReports(currentPage, 5); // API pour récupérer les reports
          setReports(response.reports);
        } else if (selectedType === "coupdecoeur") {
          const response = await fetchCoupsdeCoeur(currentPage, 5); // API pour récupérer les coups de cœur
          setCoupDeCoeurs(response.coupsdeCoeur);
        } else if (selectedType === "suggestion") {
          const response = await fetchSuggestions(currentPage, 5); // API pour récupérer les suggestions
          setSuggestions(response.suggestions);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData();
  }, [selectedType]); // Rechargement quand l'utilisateur change de type */

  useEffect(() => {
    setCurrentPage(1); // 🔄 Réinitialise la pagination à la première page quand on change de filtre
  }, [selectedFilter]);

  // 📌 Gérer les nouveaux posts créés
/*   const handleNewPost = (newPost: Post) => {
    console.log("🚀 Nouveau post ajouté :", newPost);
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setSelectedFilter("Actualité");
  }; */

  return (
    <div className="main-content">
      <div className="filter-bar">
        {/* Bouton Actualité */}
        <button
          className={`filter-button ${
            selectedFilter === "Actualité" ? "active" : ""
          }`}
          onClick={() => {
            setSelectedFilter("Actualité");
            setSelectedAbonnement(""); // Réinitialise pour éviter un conflit avec l'abonnement actif
          }}
        >
          Actualité
        </button>

        {/* Boutons pour les filtres Signalements, Coup de Cœur, Suggestions */}
        {["Signalements", "Coup de Cœur", "Suggestions"].map((filter) => (
          <button
            key={filter}
            className={`filter-button ${
              selectedFilter === filter ? "active" : ""
            }`}
            onClick={() => {
              setSelectedFilter(filter);
              setSelectedAbonnement(filter); // ✅ Met à jour correctement l'abonnement sélectionné
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 📌 Affichage des posts */}
      {selectedFilter === "Actualité" ? (
        <>
          {loading && (
            <p className="loading-message">Chargement des posts...</p>
          )}
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
          {selectedFilter === "Coup de Cœur" && coupDeCoeurs.length > 0 ? (
            coupDeCoeurs.map((coupDeCoeur) => (
              <CoupDeCoeurCard
                key={coupDeCoeur.id}
                coupDeCoeur={coupDeCoeur}
                selectedFilter={selectedFilter}
                getIconByFilter={getIconByFilter}
              />
            ))
          ) : selectedFilter === "Suggestions" && suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                selectedFilter={selectedFilter}
                getIconByFilter={getIconByFilter}
              />
            ))
          ) : selectedFilter === "Signalements" && reports.length > 0 ? (
            reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                selectedFilter={selectedFilter}
                getIconByFilter={getIconByFilter}
              />
            ))
          ) : (
            <p>Aucun {selectedFilter.toLowerCase()} trouvé.</p>
          )}
        </>
      )}

      {/* 📌 Pagination */}
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
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
            >
              Précédent
            </button>
            <span>
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage >= totalPages || totalPages === 0}
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

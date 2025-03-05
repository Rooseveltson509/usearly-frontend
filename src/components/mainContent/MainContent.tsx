import React, { useEffect, useRef, useState } from "react";
import "./MainContent.scss";
import {
  fetchReports,
  fetchCoupsdeCoeur,
  fetchSuggestions,
  fetchPosts,
  fetchBrands,
} from "../../services/apiService";
import { Cdc, Reports, Suggestion } from "../../types/Reports";
import signalIcon from "../../assets/images/signals.svg";
import baguette from "../../assets/images/baguette.svg";
import cdc from "../../assets/images/cdc.svg";
import { Brand, Post, Reaction } from "@src/types/types";
import { useAuth } from "@src/contexts/AuthContext";
import defaultAvatar from "../../assets/images/user.png";
import CreatePostPopup from "../posts/createPostPopup/CreatePostPopup";
import FilterBar from "../filter-bar/FilterBar";
import PostFeed from "../post-feed/PostFeed";
import ReportFeed from "../report-feed/reportFeed";
import Pagination from "../commons/pagination/Pagination";

const MainContent: React.FC = () => {
  const { userProfile } = useAuth();
  const [reports, setReports] = useState<Reports[]>([]);
  const [coupDeCoeurs, setCoupDeCoeurs] = useState<Cdc[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [, setSelectedType] = useState("report"); // Par défaut, affiche les reports
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("Actualité");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [, setSearchTerm] = useState("");
  const [, setSelectedSort] = useState("Date");

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

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: "smooth" }); // 🔥 Scroll fluide vers le haut
    }
  }, [currentPage, postsPage]); // 🔥 Déclenché à chaque changement de page

  useEffect(() => {
    const preventScrollOutsideBlocks = (event: WheelEvent) => {
      const sidebarLeft = document.getElementById("sidebar-left");
      const sidebarRight = document.getElementById("sidebar-right");
      const mainContent = document.getElementById("main-content");

      if (
        sidebarLeft?.contains(event.target as Node) ||
        sidebarRight?.contains(event.target as Node) ||
        mainContent?.contains(event.target as Node)
      ) {
        return; // ✅ Si on est dans un des trois blocs, on laisse le scroll normal.
      }

      event.preventDefault(); // ❌ Sinon, on empêche le scroll global
    };

    document.body.style.overflow = "hidden"; // ✅ Empêche le scroll global
    window.addEventListener("wheel", preventScrollOutsideBlocks, {
      passive: false,
    });

    return () => {
      document.body.style.overflow = "auto"; // ✅ Réactive le scroll en quittant la page
      window.removeEventListener("wheel", preventScrollOutsideBlocks);
    };
  }, []);

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

  useEffect(() => {
    setCurrentPage(1); // 🔄 Réinitialise la pagination à la première page quand on change de filtre
  }, [selectedFilter]);

  // 🚀 **Récupérer les marques pour l'input de sélection**
  useEffect(() => {
    const loadBrands = async () => {
      const fetchedBrands = await fetchBrands();
      setBrands(fetchedBrands);
    };
    loadBrands();
  }, []);

  // 📌 Charger les posts quand "Actualité" est sélectionné
  useEffect(() => {
    if (selectedFilter === "Actualité") {
      const loadPosts = async () => {
        try {
          setLoading(true);
          console.log("📥 Chargement des posts...");
          const fetchedPosts = await fetchPosts(postsPage, 5);
          console.log(
            "✅ Posts récupérés après changement de filtre :",
            fetchedPosts.posts
          );
          setPosts(fetchedPosts.posts); // ✅ Recharge les posts avec leurs réactions
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

  const handleInputClick = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  // 📌 Gérer les nouveaux posts créés
  const handleNewPost = async (newPost: Post) => {
    console.log("🚀 Nouveau post ajouté :", newPost);

    // 🔥 On affiche d'abord un post temporaire avec un loader
    const tempPost = {
      ...newPost,
      isLoading: true,
      author: {
        id: newPost.author?.id ?? userProfile?.id ?? "unknown_id",
        pseudo:
          newPost.author?.pseudo ??
          userProfile?.pseudo ??
          "Utilisateur inconnu",
        avatar:
          newPost.author?.avatar ?? userProfile?.avatar ?? "default-avatar.png",
      },
      brand: {
        id: newPost.brand?.id ?? "unknown_brand",
        name: newPost.brand?.name ?? "Marque inconnue",
        avatar: newPost.brand?.avatar ?? "default-brand-avatar.png",
      },
    };

    setPosts((prevPosts) => [tempPost, ...prevPosts]);

    // ✅ Si on est déjà sur "Actualité", on force une mise à jour des posts après un petit délai
    if (selectedFilter === "Actualité") {
      setTimeout(async () => {
        try {
          const updatedPosts = await fetchPosts(1, 5); // 🔥 Recharge les posts à jour
          setPosts(updatedPosts.posts);
        } catch (error) {
          console.error(
            "❌ Erreur lors du rafraîchissement des posts :",
            error
          );
        }
      }, 1000); // 🔥 Délai court pour donner un effet de transition
    } else {
      setSelectedFilter("Actualité"); // 🔄 Change de filtre et recharge les posts
    }
  };

  const handleReactionUpdate = (postId: string, reactions: Reaction[]) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, reactions } : post
      )
    );
  };

  return (
    <div ref={mainContentRef} className="main-content" id="main-content">
      <FilterBar
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        setPostsPage={setPostsPage} // ✅ On passe setPostsPage ici
        onSearchChange={setSearchTerm} // ✅ Ajout du support de recherche
        onSortChange={setSelectedSort} // ✅ Gestion du tri
      />

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

      {/* 📌 Affichage des posts */}
      {selectedFilter === "Actualité" ? (
        <PostFeed
          posts={posts}
          setPosts={setPosts} // ✅ Ajout de setPosts ici
          loading={loading}
          error={error}
          onReactionUpdate={handleReactionUpdate}
        />
      ) : (
        <ReportFeed
          selectedFilter={selectedFilter}
          reports={reports}
          coupDeCoeurs={coupDeCoeurs}
          suggestions={suggestions}
          loading={loading}
          error={error}
          getIconByFilter={getIconByFilter} // ✅ On passe la fonction en prop
        />
      )}

      {/* 📌 Pagination */}
      <Pagination
        currentPage={selectedFilter === "Actualité" ? postsPage : currentPage}
        totalPages={
          selectedFilter === "Actualité" ? postsTotalPages : totalPages
        }
        onPageChange={(newPage) => {
          if (selectedFilter === "Actualité") {
            setPostsPage(newPage);
          } else {
            setCurrentPage(newPage);
          }
          contentRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default MainContent;

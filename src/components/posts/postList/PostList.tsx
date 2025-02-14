/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from "react";
import "./PostList.scss";
import defaultAvatar from "../../../assets/images/user.png";
import { Post, Reaction } from "@src/types/types";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import signalIcon from "../../../assets/images/signalIcon.svg";
import {
  addReactionToPost,
  fetchReactionUsers,
} from "@src/services/apiService";
import { useAuth } from "@src/contexts/AuthContext";
import { User } from "@src/types/Reports";
import ReactionsModal from "@src/components/reactions/ReactionsModal";

interface PostProps {
  post: Post;
}
const reactionOptions = [
  { emoji: "👍", label: "J’aime" },
  { emoji: "❤️", label: "J’adore" },
  { emoji: "😂", label: "Haha" },
  { emoji: "😮", label: "Wouah" },
  { emoji: "😡", label: "Grrr" },
];

const PostList: React.FC<PostProps> = ({ post }) => {
  const { userProfile } = useAuth();
/*   const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [userLiked, setUserLiked] = useState(false); */
  //const [reactions, setReactions] = useState(post.reactions || []);
  const [reactions, setReactions] = useState<Reaction[]>(post.reactions ?? []);
  //const [showModal, setShowModal] = useState(false);
  //const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionUsers, setReactionUsers] = useState<User[]>([]);

  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  //const [showReactionPopup, setShowReactionPopup] = useState(false);

  //const [showReactionModal, setShowReactionModal] = useState(false);

  //const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const reactionsArray: Reaction[] = Array.isArray(reactions) ? reactions : [];
  const userId = userProfile?.id; // ✅ Vérifie s'il existe
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Afficher le menu au survol
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowReactions(true);
  };

  // ✅ Masquer le menu après un léger délai
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 300); // Petit délai pour éviter que ça disparaisse trop vite
  };

  // ✅ Gérer le like
/*   const handleLike = async () => {
    try {
      const response = await toggleLikePost(post.id);

      if (response.success) {
        setLikeCount(response.likeCount); // 🔥 On met à jour avec la valeur exacte depuis l’API
        setUserLiked(response.userLiked); // 🔥 On suit l’état retourné par l’API
      }
    } catch (error) {
      console.error("Erreur lors du like :", error);
    }
  }; */

  const normalizeEmoji = (emoji: string) => {
    return emoji.normalize("NFC"); // Normalise les émojis pour éviter les variations invisibles
  };

  // ✅ Ajouter une réaction
  const handleReaction = async (emoji: string) => {
    if (!userId) {
      console.error("Utilisateur non authentifié !");
      return;
    }

    // ✅ Normalise l'émoji
    const normalizedEmoji = normalizeEmoji(emoji);

    // ✅ Met à jour l'UI immédiatement (Optimistic UI)
    setReactions((prevReactions) => {
      const reactionsArray = Array.isArray(prevReactions) ? prevReactions : [];

      const existingReactionIndex = reactionsArray.findIndex(
        (r) => r.userId === userId
      );

      if (existingReactionIndex !== -1) {
        if (
          normalizeEmoji(prevReactions[existingReactionIndex].emoji) ===
          normalizedEmoji
        ) {
          return prevReactions.filter((r) => r.userId !== userId); // ✅ Supprime la réaction
        } else {
          return prevReactions.map((r, index) =>
            index === existingReactionIndex
              ? { ...r, emoji: normalizedEmoji }
              : r
          ); // ✅ Change l'émoji sélectionné
        }
      }

      return [...prevReactions, { userId, emoji: normalizedEmoji, count: 1 }]; // ✅ Ajoute une nouvelle réaction
    });

    try {
      // ✅ Envoie l'info à l'API en arrière-plan
      const response = await addReactionToPost(post.id, normalizedEmoji);

      if (!response.success) {
        throw new Error("Échec de la mise à jour des réactions !");
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de la réaction :", error);

      // 🔄 Annule la mise à jour si l'API échoue
      setReactions((prevReactions) =>
        prevReactions.filter((r) => r.userId !== userId)
      );
    }
  };

  // ✅ Fonction pour ouvrir la popup avec les utilisateurs ayant réagi
  /*   const handleReactionClick = async (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowReactionModal(true); // Ouvre le modal

    try {
      const users = await fetchReactionUsers(post.id, emoji); // 🔥 Récupère les utilisateurs
      setReactionUsers(users);
    } catch (error) {
      console.error("Erreur lors du chargement des réactions :", error);
    }
  }; */

  // Fonction pour ouvrir le modal et charger les utilisateurs ayant réagi avec un emoji donné
  const handleOpenModal = async (emoji: string) => {
    setSelectedEmoji(emoji);
    setIsModalOpen(true);

    try {
      const data = await fetchReactionUsers(post.id, emoji);
      console.log("👥 Utilisateurs reçus :", data.users); // ✅ Debug ici

      setReactionUsers(data.users || []); // ✅ Met à jour la liste des utilisateurs
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des utilisateurs :",
        error
      );
    }
  };

  return (
    <div className="post-card fade-in">
      {/* HEADER */}
      <div className="post-header">
        <div className="user-info">
          <img
            src={
              post.author?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}/${post.author.avatar}`
                : defaultAvatar
            }
            alt="Avatar"
            className="user-avatar"
          />
          <p>{post.author?.pseudo}</p>
          <span className="post-author">
            C’est moi ou <strong>{post.title}</strong> ?
          </span>
          <span className="post-time">
            • {formatRelativeTime(post.createdAt)}
          </span>
        </div>
        <div className="post-options">⋮</div>
      </div>

      {/* CONTENU DU POST */}
      <div className="post-content">
        <div className="post-icon">
          <img src={signalIcon} alt="icon signalement" />
        </div>
        <div className="post-details">
          <h3 className="post-title">{post.title} 🔥</h3>
          <p className="post-description">{post.content}</p>
        </div>
        {post.brand?.avatar && (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/${post.brand.avatar}`}
            alt="Brand Logo"
            className="brand-logo"
          />
        )}
      </div>

      {/* FOOTER */}
      <div className="post-footer">
        <div className="reactions-container">
          {/* Résumé des réactions */}

          {reactionsArray.length > 0 && (
            <div
              className="reactions-summary fade-in slide-up"
              onClick={() => setIsModalOpen(true)}
            >
              {/* ✅ Regroupe les réactions identiques et affiche les 3 plus populaires */}
              <div className="reaction-icons">
                {reactionsArray
                  .reduce<Reaction[]>((acc, reaction) => {
                    if (!reaction || !reaction.emoji) return acc;

                    const existing = acc.find(
                      (r) =>
                        normalizeEmoji(r.emoji) ===
                        normalizeEmoji(reaction.emoji)
                    );

                    if (existing) {
                      existing.count = (existing.count ?? 0) + 1;
                    } else {
                      acc.push({ ...reaction, count: 1 });
                    }
                    return acc;
                  }, [])
                  .sort((a, b) => (b.count ?? 0) - (a.count ?? 0)) // ✅ Correction ici !
                  .slice(0, 3) // ✅ Garde seulement les 3 plus populaires
                  .map((reaction, index) => (
                    <span
                      key={index}
                      className="reaction-icon animated-reaction bounce-in"
                      onClick={() => handleOpenModal(reaction.emoji)} // ✅ Ajoute l'événement click
                      //onClick={() => handleReactionClick(reaction.emoji)}
                    >
                      {reaction.emoji}
                    </span>
                  ))}
                {post.reactions.length > 3 && (
                  <span onClick={() => handleOpenModal("all")}>
                    +{post.reactions.length - 3}
                  </span>
                )}
              </div>

              {/* ✅ Affiche le total des réactions */}
              <span className="reaction-count bounce-in">
                {reactionsArray.length}
              </span>
            </div>
          )}

          {/* Bouton J’aime et menu */}
          <div
            className="like-container"
            /*           onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} */
          >
            {/*  <button className="like-button">👍 J’aime</button> */}

            <div className="post-actions">
              <button
                className="action-btn"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span
                  className={`like-button icon liked pulse`}
                >
                  👍
                </span>{" "}
                J’aime
              </button>
              <button className="action-btn">
                <span className="icon">💬</span> Commenter
              </button>
              <button className="action-btn">
                <span className="icon">🔁</span> Republier
              </button>
              {/*        <button className="action-btn">
                <span className="icon">✈️</span> Envoyer
              </button> */}
              {/*               <div className="card-footer">
                <button className="check-button">Je check</button>
              </div> */}
            </div>
            {showReactions && (
              <div
                className="reaction-menu fade-in slide-up"
                onMouseEnter={handleMouseEnter} // Permet de garder le menu affiché
                onMouseLeave={handleMouseLeave} // Ferme seulement si la souris quitte tout
              >
                {reactionOptions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    onClick={() => handleReaction(reaction.emoji)}
                    className="reaction-item pop-in"
                  >
                    {reaction.emoji}
                    <span className="tooltip">{reaction.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Bouton d'action */}
        {/*      <div className="card-footer">
          <button className="check-button">Je check</button>
        </div> */}
        {/* ✅ Icônes d'interaction */}
        {/*         <div className="icons">
          <span className="icon" onClick={handleLike}>
            {userLiked ? "👍" : "👍"} {likeCount}
          </span>
        </div> */}

        {/* ✅ Popup des utilisateurs ayant réagi */}
        {isModalOpen && (
          <ReactionsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            postId={post.id}
          />
        )}
      </div>
    </div>
  );
};

export default PostList;

import React, { useRef, useState } from "react";
import "./PostList.scss";
import defaultAvatar from "../../../assets/images/user.png";
import { CommentType, Post, Reaction } from "@src/types/types";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import signalIcon from "../../../assets/images/signalIcon.svg";
import { motion } from "framer-motion";
import {
  addCommentToPost,
  addReactionToPost,
  deleteComment,
  fetchPostComments,
  fetchReactionUsers,
} from "@src/services/apiService";
import { Trash2 } from "lucide-react"; // 📌 Utilise Lucide (ou FontAwesome si tu préfères)
import Swal from "sweetalert2";
import { useAuth } from "@src/contexts/AuthContext";
import { User } from "@src/types/Reports";
import ReactionsModal from "@src/components/reactions/ReactionsModal";
import "react-confirm-alert/src/react-confirm-alert.css"; // 📌 Style par défaut

interface PostProps {
  post: Post;
}
const reactionOptions = [
  { emoji: "👍", label: "J’aime" },
  { emoji: "❤️", label: "J’adore" },
  { emoji: "😂", label: "Haha" },
  { emoji: "😮", label: "Wouah" },
  { emoji: "😡", label: "Grrr" },
  { emoji: "🤬", label: "Bouche bée" },
  { emoji: "🥵", label: "Visage rouge" },
];

const PostList: React.FC<PostProps> = ({ post }) => {
  const { userProfile } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>(post.reactions ?? []);
  const [, setReactionUsers] = useState<User[]>([]);
  const [, setSelectedEmoji] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const reactionsArray: Reaction[] = Array.isArray(reactions) ? reactions : [];
  const userId = userProfile?.id; // ✅ Vérifie s'il existe
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState(""); // Gère l'input de commentaire

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

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Vérifie si le commentaire n'est pas vide

    console.log("Post ID utilisé :", post.id); // ✅ Vérifie que `post.id` est bien défini

    try {
      const addedComment = await addCommentToPost(post.id, newComment);
      setComments((prev) => [addedComment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
    }
  };

  const toggleComments = async () => {
    setIsCommentsOpen((prev) => !prev);

    if (!isCommentsOpen && comments.length === 0) {
      // ✅ Charge les commentaires SEULEMENT s'ils ne sont pas déjà chargés
      try {
        const response = await fetchPostComments(post.id);
        setComments(response.comments);
        console.log("user role : ", userProfile?.role);
      } catch (error) {
        console.error("Erreur lors du chargement des commentaires :", error);
      }
    } else if (isCommentsOpen) {
      // ✅ Efface les commentaires quand on referme (optionnel)
      setComments([]);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const result = await Swal.fire({
      title: "Supprimer le commentaire ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== commentId)
        );
        Swal.fire("Supprimé !", "Le commentaire a été supprimé.", "success");
      } else {
        Swal.fire(
          "Erreur",
          response.error || "Une erreur s'est produite.",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      Swal.fire("Erreur", "Une erreur inattendue s'est produite.", "error");
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

          {/* Bouton J’aime et menu */}
          <div
            className="like-container"
            /*           onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} */
          >
            {/*  <button className="like-button">👍 J’aime</button> */}
            <div className="post-actions-container">
              {/* ✅ Zone des actions (J'aime, Commenter, Republier) qui reste toujours en haut */}
              <div className="post-actions">
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
                <button
                  className="action-btn"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className={`like-button icon liked pulse`}>👍</span>{" "}
                  J’aime
                </button>
                <button className="action-btn" onClick={toggleComments}>
                  <span className="icon">💬</span>{" "}
                  {isCommentsOpen ? "Masquer" : "Commenter"}
                </button>
                <button className="action-btn">
                  <span className="icon">🔁</span> Republier
                </button>
              </div>

              {/* ✅ Section des commentaires affichée sous les actions */}
              {isCommentsOpen && (
                <motion.div
                  className="comment-section"
                  initial={{ opacity: 0, blockSize: 0 }}
                  animate={{ opacity: 1, blockSize: "auto" }}
                  exit={{ opacity: 0, blockSize: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* ✅ Zone d'ajout de commentaire */}
                  <div className="comment-input-container">
                    <input
                      type="text"
                      placeholder="Écrire un commentaire..."
                      className="comment-input"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      className="comment-button"
                      onClick={handleAddComment}
                    >
                      Envoyer
                    </button>
                  </div>

                  {/* ✅ Liste des commentaires en affichage fluide */}
                  <motion.div
                    className="comment-list"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        className="comment-item"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img
                          src={
                            comment.author.avatar
                              ? `${import.meta.env.VITE_API_BASE_URL}/${
                                  comment.author.avatar
                                }`
                              : defaultAvatar
                          }
                          alt={comment.author.pseudo}
                          className="comment-avatar"
                        />
                        <div className="comment-content">
                          <div className="comment-header">
                            <span className="comment-author">
                              {comment.author.pseudo}
                            </span>
                            {/* ✅ Bouton de suppression visible uniquement pour l'auteur ou l'admin */}
                            {(comment.author.id === userId ||
                              userProfile?.role === "admin") && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="delete-comment"
                              >
                                <Trash2 size={20} color="#d9534f" />
                              </button>
                            )}
                          </div>
                          <p className="comment-text">{comment.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
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

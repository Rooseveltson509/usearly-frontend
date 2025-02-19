import React, { useEffect, useRef, useState } from "react";
import "./ReportCard.scss";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import { Reaction, Reports } from "@src/types/Reports";
import {
  addCommentToReport,
  deleteReportComment,
  fetchBrandByName,
  fetchReportComments,
} from "@src/services/apiService";
import defaultAvatar from "../../assets/images/user.png";
import { useAuth } from "../../contexts/AuthContext";
import { CommentType } from "@src/types/types";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  addReactionToReport,
  fetchReportReactions,
} from "@src/services/apiReactions";
import defaultBrandAvatar from "@src/assets/images/user.png";

interface ReportCardProps {
  report: Reports;
  selectedFilter: string; // ✅ Ajout du filtre sélectionné
  getIconByFilter: (selectedAbonnement: string) => string; // ✅ Ajout de la fonction pour récupérer l'icône
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const [reactions, setReactions] = useState<Reaction[]>(
    Array.isArray(report.reactions) ? report.reactions : []
  );

  const { userProfile } = useAuth();
  const userId = userProfile?.id; // ✅ Vérifie s'il existe
  const normalizeEmoji = (emoji: string) => emoji.normalize("NFC");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const reactionOptions = ["👍", "❤️", "😂", "😡"];
  // ✅ Définition du type pour éviter l'erreur TypeScript
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});
  // 🚀 Stocke le logo de la marque
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [brandLogo, setBrandLogo] = useState<string | null>(null);

  // ✅ Fonction pour extraire le nom de la marque en enlevant ".com", ".fr" etc.
  const extractBrandName = (marque: string): string => {
    if (!marque) return "";
    return marque.replace(/\.\w+$/, "").toLowerCase();
  };

  // ✅ Gère l'affichage du menu au survol
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowEmojiPicker(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowEmojiPicker(false);
    }, 300); // Petit délai pour éviter une disparition trop rapide
  };

  // 🚀 Récupération du logo de la marque si elle existe en BDD
  useEffect(() => {
    const fetchBrandLogo = async () => {
      const brandName = extractBrandName(report.marque);
      if (!brandName) return;

      try {
        const brandInfo = await fetchBrandByName(brandName);
        if (brandInfo) {
          setBrandLogo(brandInfo.avatar || defaultBrandAvatar);
        } else {
          setBrandLogo(defaultBrandAvatar); // Avatar par défaut si marque inconnue
        }
      } catch (error) {
        console.error(
          `❌ Erreur lors de la récupération de la marque ${brandName}:`,
          error
        );
        setBrandLogo(defaultBrandAvatar);
      }
    };

    fetchBrandLogo();
  }, [report.marque]);

  useEffect(() => {
    const loadReactions = async () => {
      try {
        const data = await fetchReportReactions(report.id); // 🔥 Appelle SANS emoji
        setReactions(data.reactions);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des réactions :", error);
      }
    };

    loadReactions();
  }, [report.id]);

  // ✅ Charger les commentaires lorsqu'on affiche la section
  useEffect(() => {
    const loadComments = async () => {
      const response = await fetchReportComments(report.id);
      console.log(
        "📌 Commentaires récupérés depuis l'API :",
        response.comments
      );
      setComments(response.comments);
    };

    loadComments();
  }, [report.id]);

  // ✅ Ajouter un commentaire
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Vérifie si le commentaire n'est pas vide

    console.log("Report ID utilisé :", report.id); // ✅ Vérifie que `report.id` est bien défini

    try {
      const addedComment = await addCommentToReport(report.id, newComment);

      console.log("📌 Commentaire ajouté :", addedComment);

      // ✅ Mise à jour immédiate de l'état
      setComments((prev) => [addedComment, ...prev]);

      setNewComment(""); // Réinitialise l'input
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du commentaire :", error);
    }
  };

  // ✅ Supprimer un commentaire
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
      const response = await deleteReportComment(commentId);
      if (response.success) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
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
      console.error("❌ Erreur lors de la suppression du commentaire :", error);
      Swal.fire("Erreur", "Une erreur inattendue s'est produite.", "error");
    }
  };

  const handleReaction = async (reportId: string, emoji: string) => {
    if (!userId) {
      console.error("Utilisateur non authentifié !");
      return;
    }

    const normalizedEmoji = normalizeEmoji(emoji);

    // ✅ Mise à jour optimiste immédiate (affichage instantané)
    const newReactions = (() => {
      let updatedReactions = [...reactions];

      const userReactionIndex = updatedReactions.findIndex(
        (r) => r.userId === userId
      );

      if (userReactionIndex !== -1) {
        if (updatedReactions[userReactionIndex].emoji === normalizedEmoji) {
          // ✅ Supprime la réaction immédiatement
          updatedReactions = updatedReactions.filter(
            (r) => r.userId !== userId
          );
        } else {
          // ✅ Change la réaction immédiatement
          updatedReactions[userReactionIndex].emoji = normalizedEmoji;
        }
      } else {
        // ✅ Ajoute la réaction immédiatement sans attendre la réponse API
        updatedReactions.push({ userId, emoji: normalizedEmoji, count: 1 });
      }

      return updatedReactions;
    })();

    // ✅ Force l'affichage immédiat (sans latence)
    setReactions(newReactions);

    try {
      // ✅ Envoie au backend en arrière-plan
      const response = await addReactionToReport(reportId, normalizedEmoji);

      if (!response.success) {
        throw new Error("Échec de la mise à jour des réactions !");
      }

      // 🔄 Synchronise avec les données réelles du backend
      setReactions(response.reactions);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de la réaction :", error);

      // 🔄 Annule la mise à jour en cas d'échec
      setReactions((prevReactions) =>
        prevReactions.filter((r) => r.userId !== userId)
      );
    }
  };
  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId], // ✅ Clé en `string`
    }));
  };

  return (
    <div className="report-card">
      <div className="report-header">
        <div className="user-info">
          <img
            src={
              report.User?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}/${report.User.avatar}`
                : defaultAvatar
            }
            alt="Avatar"
            className="user-avatar"
          />
          <span className="report-author">
            <strong>{report.User?.pseudo}</strong>
          </span>
          <span className="post-author">
            C’est moi ou <strong>{extractBrandName(report.marque)} bug</strong>{" "}
            ?
          </span>
          <span className="report-time">
            {" "}
            {formatRelativeTime(report.createdAt)}
          </span>
        </div>
        <div className="report-options">⋮</div>
      </div>
      <div className="report-content">
        <h3 className="report-title">Vous avez aussi ce problème ?</h3>
        <p className="report-question">
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
      <div className="post-details"></div>
      {/* logo marque */}
      {/*       <img
        src={brandLogo || defaultBrandAvatar}
        alt={extractBrandName(report.marque)}
        className="brand-logo"
      /> */}
      <div className="flex-element">
        {/* ✅ Section des réactions (affichage optimisé) */}
        <div className="report-reactions">
          {reactions.length > 0 ? (
            <>
              <div className="reaction-icons">
                {Object.entries(
                  reactions.reduce<{ [emoji: string]: number }>(
                    (acc, reaction) => {
                      if (!reaction || !reaction.emoji) return acc;

                      const normalizedEmoji = normalizeEmoji(reaction.emoji);

                      // ✅ Compte chaque emoji
                      acc[normalizedEmoji] =
                        (acc[normalizedEmoji] || 0) + reaction.count;
                      return acc;
                    },
                    {}
                  )
                )
                  .sort((a, b) => b[1] - a[1]) // ✅ Trie les plus populaires en premier
                  .slice(0, 3) // ✅ Affiche seulement 3 emojis maximum
                  .map(([emoji], index) => (
                    <span key={index} className="reaction-icon">
                      {emoji}
                    </span>
                  ))}
              </div>

              {/* ✅ Affiche le total des réactions */}
              <span className="reaction-total">
                {reactions.reduce((sum, r) => sum + r.count, 0)}
              </span>
            </>
          ) : (
            <span className="no-reactions">Ajoutez une réaction</span>
          )}
        </div>

        {/* Section des réactions, commentaires et transmission */}
        <div className="report-meta">
          <span className="meta-info">
            💬 {/* {report.commentCount} */} commentaires
          </span>
          <span className="meta-info">
            💡 {/* {report.solutionCount} */} solution
          </span>
          <span className="meta-info">✔️ Transmis à la marque</span>
        </div>
      </div>
      {/* Section des boutons d'action */}
      <div className="report-actions">
        {/* ✅ Sélecteur d'émojis au survol */}
        <div
          className="action-button-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="action-button">✋ J’ai aussi ce problème</span>

          {/* ✅ Affichage conditionnel des emojis */}
          {showEmojiPicker && (
            <div className="emoji-picker">
              {reactionOptions.map((emoji) => (
                <button
                  key={emoji}
                  className="emoji-btn"
                  onClick={() => handleReaction(report.id, emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Gestion de l'affichage du champ de commentaire */}
        <span
          className="action-button"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          {showCommentInput ? "❌ Masquer" : "💬 Commenter"}
        </span>

        <span className="action-button">💡 Solutionner</span>
        <span className="check-button">Je check</span>
      </div>

      {/* ✅ Affichage du champ de commentaire en dessous */}
      {showCommentInput && (
        <div className="comment-section">
          <input
            type="text"
            placeholder="Écrire un commentaire..."
            className="comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="comment-submit" onClick={handleAddComment}>
            Envoyer
          </button>
        </div>
      )}
      {showCommentInput && (
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              {/* Avatar */}
              <img
                src={
                  comment.author?.avatar
                    ? `${import.meta.env.VITE_API_BASE_URL}/${
                        comment.author.avatar
                      }`
                    : defaultAvatar
                }
                alt="avatar"
                className="comment-avatar"
              />
              {/* Contenu du commentaire */}
              <div className="comment-content">
                <div className="comment-header">
                  <span>{comment.author?.pseudo || "Utilisateur inconnu"}</span>
                </div>
                <div className="comment-text">
                  <p>{comment.content}</p>
                </div>
              </div>
              {/* Bouton de suppression (visible seulement pour l’auteur) */}
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportCard;

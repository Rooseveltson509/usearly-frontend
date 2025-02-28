import { useEffect, useState } from "react";
import defaultAvatar from "../../assets/images/avatar.png";
import { CommentType } from "@src/types/types";
import {
  fetchReportComments,
  fetchCdcComments,
  fetchSuggestionComments,
  addCommentToReport,
  addCommentToCdc,
  addCommentToSuggestion,
  deleteReportComment,
  deleteCdcComment,
  deleteSuggestionComment,
  fetchPostComments,
  addCommentToPost,
  deleteComment,
} from "@src/services/apiService";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import { useAuth } from "@src/contexts/AuthContext";
import "./CommentSection.scss";

interface CommentSectionProps {
  parentId: string;
  type: "post" | "report" | "coupdecoeur" | "suggestion";
  showCommentInput: boolean; // ✅ Ajout de la prop pour gérer l'affichage
  commentCount: number;
  setCommentCount: (count: number) => void; // ✅ Ajout de cette prop
}

const CommentSection: React.FC<CommentSectionProps> = ({
  parentId,
  type,
  showCommentInput,
  commentCount,
  setCommentCount,
}) => {
  const { userProfile } = useAuth();
  const userId = userProfile?.id; // ✅ Vérifie s'il existe
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Ajout du state de chargement
  
  
  // Définition des méthodes API dynamiquement en fonction du `type`
  const fetchComments =
    type === "report"
      ? fetchReportComments
      : type === "post"
      ? fetchPostComments
      : type === "coupdecoeur"
      ? fetchCdcComments
      : fetchSuggestionComments;

  const addComment =
    type === "report"
      ? addCommentToReport
      : type === "post"
      ? addCommentToPost
      : type === "coupdecoeur"
      ? addCommentToCdc
      : addCommentToSuggestion;

  const deleteCommunComment =
    type === "report"
      ? deleteReportComment
      : type === "post"
      ? deleteComment
      : type === "coupdecoeur"
      ? deleteCdcComment
      : deleteSuggestionComment;

  useEffect(() => {
    if (showCommentInput) {
      const loadComments = async () => {
        setLoading(true); // ✅ Active le chargement
        try {
          const response = await fetchComments(parentId);
          setComments(response.comments || []);
        } catch (error) {
          console.error("Erreur lors du chargement des commentaires :", error);
        } finally {
          setLoading(false);
        }
      };
      loadComments();
    }
  }, [fetchComments, parentId, showCommentInput]);

  useEffect(() => {
    console.log("🔄 Mise à jour de comments :", comments);
  }, [comments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const addedComment = await addComment(parentId, newComment);

      console.log("✅ Commentaire ajouté par l'API :", addedComment);

      if (!addedComment) {
        console.error("❌ L'API n'a pas retourné le commentaire.");
        return;
      }

      const updatedComment = {
        ...addedComment,
        author: {
          id: userProfile?.id,
          pseudo: userProfile?.pseudo,
          avatar: userProfile?.avatar || defaultAvatar,
        },
      };

      setComments((prev) => [updatedComment, ...prev]);
      setCommentCount(commentCount + 1); // ✅ Mise à jour en temps réel // ✅ Met à jour en temps réel
      setNewComment(""); // Reset input
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
      const response = await deleteCommunComment(commentId);
      if (response.success) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
        setCommentCount(Math.max(0, commentCount - 1)); // ✅ Mise à jour en temps réel
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

  return (
    <>
      {showCommentInput && (
        <>
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
          <ul className="comment-list">
            {loading ? (
              <div className="loading-container">
                <span className="spinner"></span> {/* ✅ Ajout du spinner */}
                {/* <p>Chargement en cours...</p> */}{" "}
                {/* ✅ Message de chargement */}
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <li key={comment.id} className="comment-item">
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
                  <div className="comment-content">
                    <div className="comment-header">
                      <span>
                        {comment.author?.pseudo || "Utilisateur inconnu"}
                      </span>
                    </div>
                    <div className="comment-text">
                      <p>{comment.content}</p>
                    </div>
                  </div>
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
              ))
            ) : (
              <p className="no-comments">Aucun commentaire pour l'instant.</p>
            )}
          </ul>
        </>
      )}
    </>
  );
};

export default CommentSection;

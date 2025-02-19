import { useState, useEffect, useRef } from "react";
import { useAuth } from "@src/contexts/AuthContext";
import {
  addReactionToCdc,
  addReactionToReport,
  addReactionToSuggestion,
  fetchCdcReactions,
  fetchReportReactions,
  fetchSuggestionReactions,
} from "@src/services/apiReactions";
import { Reaction } from "@src/types/types";

interface ReactionSectionProps {
  parentId: string;
  type: "report" | "coupdecoeur" | "suggestion";
  showCommentInput: boolean;
  setShowCommentInput: (value: boolean) => void;
}

const reactionOptions = ["👍", "❤️", "😂", "😡"];

const ReactionSection: React.FC<ReactionSectionProps> = ({
  parentId,
  type,
  showCommentInput,
  setShowCommentInput,
}) => {
  const { userProfile } = useAuth();
  const userId = userProfile?.id;
  const [reactions, setReactions] = useState<Reaction[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const normalizeEmoji = (emoji: string) => emoji.normalize("NFC");
  //const [showCommentInput, setShowCommentInput] = useState(false);

  // Sélectionne les méthodes dynamiquement
  const fetchReactions =
    type === "report"
      ? fetchReportReactions
      : type === "coupdecoeur"
      ? fetchCdcReactions
      : fetchSuggestionReactions;

  const addReaction =
    type === "report"
      ? addReactionToReport
      : type === "coupdecoeur"
      ? addReactionToCdc
      : addReactionToSuggestion;

  useEffect(() => {
    const loadReactions = async () => {
      try {
        const response = await fetchReactions(parentId);
        setReactions(response.reactions || []);
      } catch (error) {
        console.error("Erreur lors du chargement des réactions :", error);
      } finally {
        setLoading(false);
      }
    };
    loadReactions();
  }, [parentId]);

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

  /*   const handleReaction = async (emoji: string) => {
    if (!userId) return;

      try {
        const response = await addReaction(parentId, emoji); // API `PUT`
        setReactions(response.reactions || []); // ✅ Met à jour directement avec la réponse
      } catch (error) {
        console.error("❌ Erreur lors de l'ajout de la réaction :", error);
      }

  }; */

  const handleReaction = async (parentId: string, emoji: string) => {
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
      const response = await addReaction(parentId, normalizedEmoji);

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

  return (
    <>
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
                  onClick={() => handleReaction(parentId, emoji)}
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
    </>
  );
};

export default ReactionSection;

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
import CommonReactionsModal from "@src/components/commons/CommonReactionsModal";
import { getEmojisForType } from "@src/components/config/emojisConfig";
import "./ReactionSection.scss";
import {
  addReactionToPost,
  fetchPostReactions,
} from "@src/services/apiService";
import commentIcon from "../../../assets/card/comment.svg";
import solution from "../../../assets/card/solution.svg";
import { getActionContent } from "@src/utils/getActionContent";

interface ReactionSectionProps {
  parentId: string;
  type: "post" | "report" | "coupdecoeur" | "suggestion";
  showCommentInput: boolean;
  setShowCommentInput: (value: boolean) => void;
  commentCount: number; // ✅ Ajout du nombre de commentaires
  onReactionUpdate?: (parentId: string, updatedReactions: Reaction[]) => void;
  brandLogo: string | null;
}

const ReactionSection: React.FC<ReactionSectionProps> = ({
  parentId,
  type,
  showCommentInput,
  setShowCommentInput,
  onReactionUpdate,
  commentCount,
  brandLogo
}) => {
  const { userProfile } = useAuth();
  const userId = userProfile?.id;
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const normalizeEmoji = (emoji: string) => emoji.normalize("NFC");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "post" | "report" | "suggestion" | "coupdecoeur"
  >("report");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const { image, text } = getActionContent(type);

  // Sélectionne les méthodes dynamiquement
  const fetchReactions =
    type === "report"
      ? fetchReportReactions
      : type === "post"
        ? fetchPostReactions
        : type === "coupdecoeur"
          ? fetchCdcReactions
          : fetchSuggestionReactions;

  const addReaction =
    type === "report"
      ? addReactionToReport
      : type === "post"
        ? addReactionToPost
        : type === "coupdecoeur"
          ? addReactionToCdc
          : addReactionToSuggestion;

  useEffect(() => {
    const loadReactions = async () => {
      try {
        const response = await fetchReactions(parentId);
        setReactions(response.reactions || []);
        console.log("Reactions chargées :", response.reactions);
      } catch (error) {
        console.error("Erreur lors du chargement des réactions :", error);
      } finally {
        setLoading(false);
      }
    };
    loadReactions();
  }, [fetchReactions, parentId]);

  // ✅ Vérifie si l'utilisateur a déjà réagi
  const userReaction = reactions.find((reaction) => reaction.userId === userId);
  const userHasReacted = !!userReaction;

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

  const handleReaction = async (parentId: string, emoji: string) => {
    if (!userId) {
      console.error("Utilisateur non authentifié !");
      return;
    }

    const normalizedEmoji = normalizeEmoji(emoji);

    let newReactions = [...reactions];

    console.log("🔍 Emoji reçu :", emoji); // ✅ Vérification
    console.log("🔍 Emoji normalizedEmoji :", normalizedEmoji); // ✅ Vérification
    console.log("🔍 ParentId reçu :", parentId); // ✅ Vérification

    if (!emoji) {
      console.error("❌ Emoji non défini !");
      return;
    }
    const userReactionIndex = newReactions.findIndex(
      (r) => r.userId === userId
    );

    if (userReactionIndex !== -1) {
      if (newReactions[userReactionIndex].emoji === normalizedEmoji) {
        // ✅ Supprime la réaction immédiatement
        newReactions = newReactions.filter((r) => r.userId !== userId);
      } else {
        // ✅ Change la réaction immédiatement
        newReactions[userReactionIndex].emoji = normalizedEmoji;
      }
    } else {
      // ✅ Ajoute la réaction immédiatement
      newReactions.push({ userId, emoji: normalizedEmoji, count: 1 });
    }

    // ✅ Mise à jour optimiste
    setReactions(newReactions);

    // ✅ Notifie `PostList` si `onReactionUpdate` est fourni
    if (onReactionUpdate) {
      onReactionUpdate(parentId, newReactions);
    }

    try {
      const response = await addReaction(parentId, normalizedEmoji);

      if (!response.success) {
        throw new Error("Échec de la mise à jour des réactions !");
      }

      // 🔄 Synchronise avec l'API
      setReactions(response.reactions);

      // 🔄 Notifie `PostList` pour assurer la cohérence des données
      if (onReactionUpdate) {
        onReactionUpdate(parentId, response.reactions);
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de la réaction :", error);

      // 🔄 Annule la mise à jour en cas d'échec
      setReactions((prevReactions) =>
        prevReactions.filter((r) => r.userId !== userId)
      );
    }
  };

  // ✅ Fonction pour ouvrir le modal
  const handleOpenReactionModal = async (
    parentId: string,
    type: "post" | "report" | "suggestion" | "coupdecoeur"
  ) => {
    setIsModalOpen(true);
    setSelectedParentId(parentId);
    setSelectedType(type); // ✅ Garde en mémoire le type pour bien charger les données
  };

  return (
    <>
      <div className="flex-element">
        <div className="report-reactions">
          {reactions.length > 0 && (
            <>
              <div className="reaction-summary">
                {/* ✅ Regroupement des réactions affichées */}
                <div className="reaction-icons">
                  {Object.entries(
                    reactions.reduce<{ [emoji: string]: number }>(
                      (acc, reaction) => {
                        if (!reaction || !reaction.emoji) return acc;
                        const normalizedEmoji = normalizeEmoji(reaction.emoji);
                        acc[normalizedEmoji] =
                          (acc[normalizedEmoji] || 0) + reaction.count;
                        return acc;
                      },
                      {}
                    )
                  )
                    .sort((a, b) => b[1] - a[1]) // Trie les plus populaires en premier
                    .slice(0, 3) // Affiche seulement 3 emojis maximum
                    .map(([emoji], index) => (
                      <span
                        key={index}
                        className={`reaction-icon ${userReaction?.emoji === emoji
                            ? "selected-reaction"
                            : ""
                          }`}
                        onClick={() => handleOpenReactionModal(parentId, type)}
                      >
                        {emoji}
                      </span>
                    ))}
                </div>

                {/* 🔥 Compteur total de réactions (bien aligné) */}
                <span className="reaction-total">{reactions.length}</span>
              </div>
            </>
          )}
        </div>

        {/* Section des réactions, commentaires et transmission */}
        <div className="report-meta">
          <span className="meta-info transmitted">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="myGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#4300DF" />
                  <stop offset="100%" stop-color="#FF001E" />
                </linearGradient>
              </defs>

              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="url(#myGradient)"
                stroke-width="2"
                fill="none"
              />

              <path
                d="M8 12 l3 3 l5 -5"
                stroke="url(#myGradient)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            Transmis à la marque
          </span>
        </div>
      </div>

      <div className="report-actions">
        {/* ✅ Sélecteur d'émojis au survol */}
        <div
          className="action-button-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span
            className={`action-button ${userHasReacted ? "active-button" : ""}`}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            {userReaction?.emoji ? (
              <>
                {userReaction.emoji} {/* ✅ Affichage de l’émoji */}
                <span className="emoji-label">
                  {
                    getEmojisForType(type).find(
                      (e) => e.emoji === userReaction.emoji
                    )?.label
                  }
                </span>
              </>
            ) : (
              <>
                <img src={image} alt={text} width="20" height="20" />
                <span>{text}</span>
              </>
            )}
          </span>

          {/* ✅ Affichage conditionnel des emojis */}
          {showEmojiPicker && (
            <div className="emoji-picker">
              {getEmojisForType(type).map(({ emoji, label }) => (
                <button
                  key={emoji}
                  className={`emoji-btn ${userReaction?.emoji === emoji ? "selected-emoji" : ""
                    }`}
                  onClick={() => handleReaction(parentId, emoji)}
                  onMouseEnter={() => setHoveredLabel(label)}
                  onMouseLeave={() => setHoveredLabel(null)}
                >
                  {emoji}
                  {hoveredLabel === label && (
                    <span className="emoji-tooltip">{label}</span>
                  )}
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
          {showCommentInput ? (
            <>
              <img src={commentIcon} alt="Commenter" width="20" height="20" />
              <span>Masquer</span>
            </>
          ) : (
            <>
              <img src={commentIcon} alt="Commenter" width="20" height="20" />
              {commentCount}
              <span></span>
            </>
          )}
          {brandLogo && (
                <img src={brandLogo} alt="LogoMarque" width="20" height="20" className="mini-brand-logo" />
              )}
        </span>

        {type !== "suggestion" && type !== "coupdecoeur" && (
          <>
            <span className="action-button">
              <img src={solution} alt="solution" width="20" height="20" />
            </span>
            <span className="check-button">Shake</span>
          </>
        )}
      </div>

      {isModalOpen && (
        <CommonReactionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          parentId={selectedParentId || ""}
          type={selectedType}
        />
      )}
    </>
  );
};

export default ReactionSection;

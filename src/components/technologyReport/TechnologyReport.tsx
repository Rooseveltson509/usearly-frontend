import React, { useRef, useState } from "react";
import "./ReportCard.scss";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import { Reaction, Reports } from "@src/types/Reports";
import { addReactionToReport } from "@src/services/apiService";
import defaultAvatar from "../../assets/images/user.png";
import { useAuth } from "../../contexts/AuthContext";

interface ReportCardProps {
  report: Reports;
  selectedFilter: string; // ✅ Ajout du filtre sélectionné
  getIconByFilter: (selectedAbonnement: string) => string; // ✅ Ajout de la fonction pour récupérer l'icône
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const [reactions, setReactions] = useState<Reaction[]>(
    report.reactions ?? []
  );
  const { userProfile } = useAuth();
  const [showReactions, setShowReactions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const normalizeEmoji = (emoji: string) => emoji.normalize("NFC");

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 500); // ✅ Augmente le délai avant disparition (0.5s)
  };

  /*   const handleReaction = async (reportId: string, emoji: string) => {
    try {
      const userId = userProfile?.id;
      if (!userId) {
        console.error("Utilisateur non authentifié !");
        return;
      }

      const normalizedEmoji = normalizeEmoji(emoji);

      setReactions((prevReactions) => {
        const reactionsArray = Array.isArray(prevReactions)
          ? prevReactions
          : [];

        const existingUserReaction = reactionsArray.find(
          (r) => r.userId === userId
        );
        const existingEmojiReaction = reactionsArray.find(
          (r) => r.emoji === normalizedEmoji
        );

        if (existingUserReaction) {
          if (existingUserReaction.emoji === normalizedEmoji) {
            return reactionsArray
              .map((r) =>
                r.emoji === normalizedEmoji ? { ...r, count: r.count - 1 } : r
              )
              .filter((r) => r.count > 0 && r.userId !== userId);
          } else {
            return reactionsArray
              .map((r) => {
                if (r.emoji === existingUserReaction.emoji) {
                  return { ...r, count: r.count - 1 };
                }
                if (r.emoji === normalizedEmoji) {
                  return { ...r, count: r.count + 1 };
                }
                return r;
              })
              .filter((r) => r.count > 0)
              .map((r) =>
                r.emoji === normalizedEmoji
                  ? { ...r, userId, emoji: normalizedEmoji }
                  : r
              );
          }
        }

        if (existingEmojiReaction) {
          return reactionsArray.map((r) =>
            r.emoji === normalizedEmoji ? { ...r, count: r.count + 1 } : r
          );
        }

        return [
          ...reactionsArray,
          { userId, emoji: normalizedEmoji, count: 1 },
        ];
      });

      const response = await addReactionToReport(reportId, normalizedEmoji);

      if (!response.success) {
        throw new Error("Échec de la mise à jour des réactions !");
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de la réaction :", error);
    }
  }; */

const handleReaction = async (reportId: string, emoji: string) => {
  try {
    const userId = userProfile?.id;
    if (!userId) {
      console.error("Utilisateur non authentifié !");
      return;
    }

    const normalizedEmoji = normalizeEmoji(emoji);

    // ✅ Mise à jour optimiste de l'UI (évite le délai visuel)
    setReactions((prevReactions) => {
      const existingReactionIndex = prevReactions.findIndex(
        (r) => r.userId === userId
      );
      const updatedReactions = [...prevReactions];

      if (existingReactionIndex !== -1) {
        if (updatedReactions[existingReactionIndex].emoji === normalizedEmoji) {
          return updatedReactions.filter((r) => r.userId !== userId); // ✅ Supprime si déjà cliqué
        } else {
          updatedReactions[existingReactionIndex].emoji = normalizedEmoji; // ✅ Change l'emoji
          return updatedReactions;
        }
      }

      // ✅ Vérifie si l'emoji existe déjà pour un autre utilisateur
      const existingEmojiIndex = updatedReactions.findIndex(
        (r) => r.emoji === normalizedEmoji
      );
      if (existingEmojiIndex !== -1) {
        updatedReactions[existingEmojiIndex].count += 1;
      } else {
        updatedReactions.push({ userId, emoji: normalizedEmoji, count: 1 });
      }

      return updatedReactions;
    });

    // ✅ Envoi de la requête au backend
    const response = await addReactionToReport(reportId, normalizedEmoji);
    if (!response.success) {
      throw new Error("Échec de la mise à jour des réactions !");
    }

    // ✅ Synchronisation avec le backend après mise à jour locale
    setReactions(response.reactions);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la réaction :", error);
  }
};



  // ✅ Fonction pour afficher les réactions bien regroupées
  const renderReactions = () => {
    const groupedReactions = reactions.reduce((acc, reaction) => {
      const existing = acc.find((r) => r.emoji === reaction.emoji);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ ...reaction, count: reaction.count || 1 });
      }
      return acc;
    }, [] as { emoji: string; count: number }[]);

    return groupedReactions.map((r, index) => (
      <span key={index} className="reaction">
        {r.emoji} {r.count > 1 ? r.count : ""}
      </span>
    ));
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
            C’est moi ou <strong>{report.marque}</strong> ?
          </span>
          <span className="report-time">
            • {formatRelativeTime(report.createdAt)}
          </span>
        </div>
        <div className="report-options">⋮</div>
      </div>

      <div className="report-content">
        <h3 className="report-title">{report.description}</h3>
      </div>

      {/* Section des réactions */}
      <div className="report-footer">
        {renderReactions()}

        {/* Bouton "J’aime" avec affichage d'émojis au hover */}
        <div
          className="like-button-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Bouton J'aime */}
          <button className="like-button">👍 J’aime</button>

          {/* Popup des émojis */}
          {showReactions && (
            <div
              className="emoji-picker"
              ref={emojiPickerRef}
              onMouseEnter={handleMouseEnter} // ✅ Garde le menu affiché tant que la souris est dessus
              onMouseLeave={handleMouseLeave} // ✅ Ferme après 0.5s si la souris quitte vraiment
            >
              {["👍", "❤️", "😂", "😡"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(report.id, emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

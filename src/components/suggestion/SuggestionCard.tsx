import React, { useEffect, useState } from "react";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import { Suggestion } from "@src/types/Reports";
import defaultAvatar from "../../assets/images/user.png";
import "./SuggestionCard.scss";
import CommentSection from "../comment-section/CommentSection";
import ReactionSection from "../reactions/reaction-section/ReactionSection";
import magicIcon from "../../assets/images/baguette.svg";
import defaultBrandAvatar from "../../assets/images/img-setting.jpeg";
import { fetchBrandByName, fetchSuggestionCommentCount } from "@src/services/apiService";

interface SuggestionCardProps {
  suggestion: Suggestion;
  selectedFilter: string; // ✅ Ajout du filtre sélectionné
  getIconByFilter: (selectedAbonnement: string) => string; // ✅ Ajout de la fonction pour récupérer l'icône
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [expandedSuggestion, setExpandedSuggestion] = useState<{
    [key: string]: boolean;
  }>({});
  const [brandLogo, setBrandLogo] = useState<string | null>(null);

  // ✅ Fonction pour extraire le nom de la marque en enlevant ".com", ".fr" etc.
  const extractBrandName = (marque: string): string => {
    if (!marque) return "";
    return marque.replace(/\.\w+$/, "").toLowerCase();
  };

  useEffect(() => {
    const loadCommentCount = async () => {
      const count = await fetchSuggestionCommentCount(suggestion.id);
      setCommentCount(count);
    };

    loadCommentCount();
  }, [suggestion.id]);

  // 🚀 Récupération du logo de la marque si elle existe en BDD
  useEffect(() => {
    const fetchBrandLogo = async () => {
      const brandName = extractBrandName(suggestion.marque);
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
  }, [suggestion.marque]);

  const toggleExpand = (postId: string) => {
    setExpandedSuggestion((prev) => ({
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
              suggestion.User?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}/${
                    suggestion.User.avatar
                  }`
                : defaultAvatar
            }
            alt="Avatar"
            className="user-avatar"
          />
          <span className="report-author">
            <strong>{suggestion.User?.pseudo}</strong>
          </span>
          <span className="report-time">
            {formatRelativeTime(suggestion.createdAt)}
          </span>
        </div>
        <div className="report-options">⋮</div>
      </div>

      <div className="report-content">
        <div className="post-icon">
          <img src={magicIcon} alt="icon signalement" />
        </div>
        <div className="post-details">
          <h3>
            Vous avez une suggestion pour la marque{" "}
            <strong className="report-title">
              {extractBrandName(suggestion.marque)}
            </strong>
            ?
          </h3>
          <p className="report-desc">
            {expandedSuggestion[suggestion.id] ? (
              <>
                {suggestion.description}{" "}
                <span
                  className="see-more"
                  onClick={() => toggleExpand(suggestion.id)} // ✅ Masquer le texte quand cliqué
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Voir moins
                </span>
              </>
            ) : (
              <>
                {suggestion.description.length > 150
                  ? `${suggestion.description.substring(0, 150)}... `
                  : suggestion.description}
                {suggestion.description.length > 150 && (
                  <span
                    className="see-more"
                    onClick={() => toggleExpand(suggestion.id)} // ✅ Afficher plus quand cliqué
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    Voir plus
                  </span>
                )}
              </>
            )}
          </p>
        </div>
        <div className="img-round">
          {brandLogo && (
            <img
              src={brandLogo}
              alt={extractBrandName(suggestion.marque)}
              className="brand-logo"
            />
          )}
        </div>
      </div>

      {/* ✅ Passe `showCommentInput` et `setShowCommentInput` à `ReactionSection` */}
      <ReactionSection
        parentId={suggestion.id}
        type="suggestion"
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
        commentCount={commentCount}
        brandLogo={brandLogo}
      />

      {/* ✅ Affichage de `CommentSection` si `showCommentInput` est activé */}
      {showCommentInput && (
        <CommentSection
          parentId={suggestion.id}
          type="suggestion"
          showCommentInput={showCommentInput}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
        />
      )}
    </div>
  );
};

export default SuggestionCard;
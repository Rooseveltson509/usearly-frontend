import React, { useState } from "react";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import { Suggestion } from "@src/types/Reports";
import defaultAvatar from "../../assets/images/user.png";
import "./SuggestionCard.scss";
import CommentSection from "../comment-section/CommentSection";
import ReactionSection from "../reactions/reaction-section/ReactionSection";

interface SuggestionCardProps {
  suggestion: Suggestion;
  selectedFilter: string; // ✅ Ajout du filtre sélectionné
  getIconByFilter: (selectedAbonnement: string) => string; // ✅ Ajout de la fonction pour récupérer l'icône
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
console.log("✅ SuggestionCard - ID:", suggestion.id);
console.log("✅ SuggestionCard - Type:", "suggestion");

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
        <h3 className="report-title">{suggestion.description}</h3>
        <p className="report-question">
          Avez-vous aussi rencontré ce problème ?
        </p>
      </div>

      {/* ✅ Passe `showCommentInput` et `setShowCommentInput` à `ReactionSection` */}
      <ReactionSection
        parentId={suggestion.id}
        type="suggestion"
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
      />

      {/* ✅ Affichage de `CommentSection` si `showCommentInput` est activé */}
      {showCommentInput && (
        <CommentSection
          parentId={suggestion.id}
          type="suggestion"
          showCommentInput={showCommentInput}
        />
      )}
    </div>
  );
};

export default SuggestionCard;
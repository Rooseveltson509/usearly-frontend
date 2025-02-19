import React, { useState } from "react";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import { Cdc } from "@src/types/Reports";
import defaultAvatar from "../../assets/images/user.png";
import "./CoupDeCoeurCard.scss";
import CommentSection from "../comment-section/CommentSection";
import ReactionSection from "../reactions/reaction-section/ReactionSection";

interface CoupDeCoeurCardProps {
  coupDeCoeur: Cdc;
  selectedFilter: string; // ✅ Ajout du filtre sélectionné
  getIconByFilter: (selectedAbonnement: string) => string; // ✅ Ajout de la fonction pour récupérer l'icône
}

const CoupDeCoeurCard: React.FC<CoupDeCoeurCardProps> = ({ coupDeCoeur }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);

  return (
    <div className="report-card">
      <div className="report-header">
        <div className="user-info">
          <img
            src={
              coupDeCoeur.User?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}/${
                    coupDeCoeur.User.avatar
                  }`
                : defaultAvatar
            }
            alt="Avatar"
            className="user-avatar"
          />
          <span className="report-author">
            <strong>{coupDeCoeur.User?.pseudo}</strong>
          </span>
          <span className="report-time">
            {formatRelativeTime(coupDeCoeur.createdAt)}
          </span>
        </div>
        <div className="report-options">⋮</div>
      </div>

      <div className="report-content">
        <h3 className="report-title">{coupDeCoeur.description}</h3>
        <p className="report-question">
          Avez-vous aussi rencontré ce problème ?
        </p>
      </div>

      {/* ✅ Passe `showCommentInput` et `setShowCommentInput` à `ReactionSection` */}
      <ReactionSection
        parentId={coupDeCoeur.id}
        type="coupdecoeur"
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
      />

      {/* ✅ Affichage de `CommentSection` si `showCommentInput` est activé */}
      {showCommentInput && (
        <CommentSection
          parentId={coupDeCoeur.id}
          type="coupdecoeur"
          showCommentInput={showCommentInput}
        />
      )}
    </div>
  );
};

export default CoupDeCoeurCard;

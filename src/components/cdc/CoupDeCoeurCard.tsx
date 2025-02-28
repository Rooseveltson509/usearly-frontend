import React, { useEffect, useState } from "react";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import { Cdc } from "@src/types/Reports";
import defaultAvatar from "../../assets/images/user.png";
import "./CoupDeCoeurCard.scss";
import CommentSection from "../comment-section/CommentSection";
import ReactionSection from "../reactions/reaction-section/ReactionSection";
import { fetchBrandByName, fetchCdcCommentCount } from "@src/services/apiService";
import cdcIcon from "../../assets/images/cdc.svg";
import defaultBrandAvatar from "../../assets/images/img-setting.jpeg";

interface CoupDeCoeurCardProps {
  coupDeCoeur: Cdc;
  selectedFilter: string; // ✅ Ajout du filtre sélectionné
  getIconByFilter: (selectedAbonnement: string) => string; // ✅ Ajout de la fonction pour récupérer l'icône
}
const CoupDeCoeurCard: React.FC<CoupDeCoeurCardProps> = ({ coupDeCoeur }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [expandedCdc, setExpandedCdc] = useState<{
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
      const count = await fetchCdcCommentCount(coupDeCoeur.id);
      setCommentCount(count);
    };

    loadCommentCount();
  }, [coupDeCoeur.id]);

  // 🚀 Récupération du logo de la marque si elle existe en BDD
  useEffect(() => {
    const fetchBrandLogo = async () => {
      const brandName = extractBrandName(coupDeCoeur.marque);
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
  }, [coupDeCoeur.marque]);

  const toggleExpand = (postId: string) => {
    setExpandedCdc((prev) => ({
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
        <div className="post-icon">
          <img src={cdcIcon} alt="icon signalement" />
        </div>
        <div className="post-details">
          <h3>
            Vous avez un coup de coeur pour{" "}
            <strong className="report-title">
              {extractBrandName(coupDeCoeur.marque)}
            </strong>
            ?
          </h3>
          <p className="report-desc">
            {expandedCdc[coupDeCoeur.id] ? (
              <>
                {coupDeCoeur.description}{" "}
                <span
                  className="see-more"
                  onClick={() => toggleExpand(coupDeCoeur.id)} // ✅ Masquer le texte quand cliqué
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Voir moins
                </span>
              </>
            ) : (
              <>
                {coupDeCoeur.description.length > 150
                  ? `${coupDeCoeur.description.substring(0, 150)}... `
                  : coupDeCoeur.description}
                {coupDeCoeur.description.length > 150 && (
                  <span
                    className="see-more"
                    onClick={() => toggleExpand(coupDeCoeur.id)} // ✅ Afficher plus quand cliqué
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
              alt={extractBrandName(coupDeCoeur.marque)}
              className="brand-logo"
            />
          )}
        </div>
      </div>

      {/* ✅ Passe `showCommentInput` et `setShowCommentInput` à `ReactionSection` */}
      <ReactionSection
        parentId={coupDeCoeur.id}
        type="coupdecoeur"
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
        commentCount={commentCount} // ✅ Ajout de la prop
      />

      {/* ✅ Affichage de `CommentSection` si `showCommentInput` est activé */}
      {showCommentInput && (
        <CommentSection
          parentId={coupDeCoeur.id}
          type="coupdecoeur"
          showCommentInput={showCommentInput}
          commentCount={commentCount}
          setCommentCount={setCommentCount} // ✅ Passe la mise à jour à `CommentSection`
        />
      )}
    </div>
  );
};

export default CoupDeCoeurCard;

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
import { AnimatePresence, motion } from "framer-motion";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        console.error(`❌ Erreur lors de la récupération de la marque ${brandName}:`, error);
        setBrandLogo(defaultBrandAvatar);
      }
    };

    fetchBrandLogo();
  }, [coupDeCoeur.marque]);

  const toggleExpand = (postId: string) => {
    setExpandedCdc(prev => ({
      ...prev,
      [postId]: !prev[postId], // ✅ Clé en `string`
    }));
  };
  console.log("coupDeCoeur: ", coupDeCoeur);
  return (
    <div className="report-card">
      <div className="report-header">
        <div className="user-info">
          <img
            src={
              coupDeCoeur.User?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}/${coupDeCoeur.User.avatar}`
                : defaultAvatar
            }
            alt="Avatar"
            className="user-avatar"
          />
          <span className="report-author">
            <strong>{coupDeCoeur.User?.pseudo}</strong>
          </span>
          <span className="post-author">
            a applaudit <strong>{extractBrandName(coupDeCoeur.marque)}</strong>
          </span>
          <span className="report-time">・ {formatRelativeTime(coupDeCoeur.createdAt)}</span>
        </div>
        <div className="report-options">...</div>
        {/* Ensuite le logo de la marque */}
        {brandLogo && (
          <div className="img-round">
            <img
              src={brandLogo}
              alt={extractBrandName(coupDeCoeur.marque)}
              className="brand-logo"
            />
          </div>
        )}
      </div>
      <div className="bar"></div>

      <div className="report-content">
        <div className="no-border post-icon">
          <img src={cdcIcon} alt="icon cdc" />
        </div>
        <div className="post-details">
          <h3>
            Vous avez un coup de coeur pour{" "}
            <strong className="report-title">{extractBrandName(coupDeCoeur.marque)}</strong>
          </h3>
          <p className="report-desc">
            <AnimatePresence mode="wait">
              {expandedCdc[coupDeCoeur.id] ? (
                <>
                  <motion.span
                    key="full-text"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {coupDeCoeur.description}
                  </motion.span>

                  {/* 📌 Affichage de l'image uniquement si "Voir plus" est actif */}
                  {coupDeCoeur.capture && (
                    <motion.img
                      src={coupDeCoeur.capture}
                      alt="Capture"
                      className="report-image"
                      onClick={() => coupDeCoeur.capture && setSelectedImage(coupDeCoeur.capture)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </>
              ) : (
                <>
                  <motion.span
                    key="short-text"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {coupDeCoeur.description.length > 150
                      ? `${coupDeCoeur.description.substring(0, 150)}... `
                      : coupDeCoeur.description}
                  </motion.span>
                </>
              )}
            </AnimatePresence>

            {/* 📌 Bouton "Voir plus" ou "Voir moins" avec chevron dynamique */}
            {(coupDeCoeur.description.length > 10 || coupDeCoeur.capture) && (
              <motion.span
                key="toggle"
                className="see-more"
                onClick={() => toggleExpand(coupDeCoeur.id)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {expandedCdc[coupDeCoeur.id] ? "Voir moins" : "Voir plus"}
                {/* <span
                  className={`chevron ${expandedPosts[report.id] ? "up" : "down"
                    }`}
                >
                  ▼
                </span> */}
              </motion.span>
            )}

            {/* ✅ Lightbox pour afficher l’image en grand */}
            {selectedImage && (
              <div className="lightbox" onClick={() => setSelectedImage(null)}>
                <img src={`${selectedImage}`} alt="Zoomed" />
              </div>
            )}
          </p>
        </div>
      </div>

      {/* ✅ Passe `showCommentInput` et `setShowCommentInput` à `ReactionSection` */}
      <ReactionSection
        parentId={coupDeCoeur.id}
        type="coupdecoeur"
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
        commentCount={commentCount} // ✅ Ajout de la prop
        brandLogo={brandLogo}
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

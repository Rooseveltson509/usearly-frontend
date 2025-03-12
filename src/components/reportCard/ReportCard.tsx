import React, { useEffect, useState } from "react";
import "./ReportCard.scss";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import { Reaction, Reports } from "@src/types/Reports";
import {
  fetchBrandByName,
  fetchReportCommentCount,
  fetchReportComments,
} from "@src/services/apiService";
import defaultAvatar from "../../assets/images/user.png";
import { CommentType } from "@src/types/types";
import {
  fetchReportReactions,
} from "@src/services/apiReactions";
import signalIcon from "../../assets/images/signals.svg";
import defaultBrandAvatar from "../../assets/images/img-setting.jpeg";
import { AnimatePresence, motion } from "framer-motion";
import ReactionSection from "../reactions/reaction-section/ReactionSection";
import CommentSection from "../comment-section/CommentSection";

interface ReportCardProps {
  report: Reports;
  selectedFilter: string; // ✅ Ajout du filtre sélectionné
  getIconByFilter: (selectedAbonnement: string) => string; // ✅ Ajout de la fonction pour récupérer l'icône
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const [, setReactions] = useState<Reaction[]>(
    Array.isArray(report.reactions) ? report.reactions : []
  );

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [, setComments] = useState<CommentType[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});
  const [commentCount, setCommentCount] = useState(0);
  const [, setLoading] = useState(true); // ✅ Ajout du state de chargement
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 🚀 Stocke le logo de la marque
  const [brandLogo, setBrandLogo] = useState<string | null>(null);
  // ✅ Fonction pour extraire le nom de la marque en enlevant ".com", ".fr" etc.
  const extractBrandName = (marque: string): string => {
    if (!marque) return "";
    return marque.replace(/\.\w+$/, "").toLowerCase();
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
    const loadCommentCount = async () => {
      const count = await fetchReportCommentCount(report.id);
      setCommentCount(count);
    };

    loadCommentCount();
  }, [report.id]);

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
      setLoading(true); // ✅ Active le chargement
      try {
        const response = await fetchReportComments(report.id);
        setComments(response.comments);
      } catch (error) {
        console.error("Erreur lors du chargement des commentaires :", error);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [report.id]);

  useEffect(() => {
    const loadCommentCount = async () => {
      const count = await fetchReportCommentCount(report.id);
      setCommentCount(count);
    };

    loadCommentCount();
  }, [report.id]);


  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId], // ✅ Clé en `string`
    }));
  };


  return (
    <div className="report-card">
      <div className="report-header">
        {/* Partie gauche : avatar + pseudo + description */}
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
          </span>{" "}
          <span className="post-author">
            Connecté à{" "}
            <strong>{extractBrandName(report.marque)}</strong>
          </span>
          <span className="report-time">
            ・ {formatRelativeTime(report.createdAt)}
          </span>
        </div>

        {/* Les 3 petits points “⋮” tout à droite, avant le logo */}
        <div className="report-options">...</div>

        {/* Ensuite le logo de la marque */}
        {brandLogo && (
          <div className="img-round">
            <img
              src={brandLogo}
              alt={extractBrandName(report.marque)}
              className="brand-logo"
            />
          </div>
        )}
      </div>

      <div className="bar"></div>

      <div className="report-content">
        <div className="post-icon">
          <img src={signalIcon} alt="icon signalement" />
        </div>
        <div className="post-details">
          <h3 className="report-title">Vous avez aussi ce problème ?</h3>
          {/* 📌 Description avec animation */}
          <p className="report-desc">
            <AnimatePresence mode="wait">
              {expandedPosts[report.id] ? (
                <>
                  <motion.span
                    key="full-text"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {report.description}
                  </motion.span>

                  {/* 📌 Affichage de l'image uniquement si "Voir plus" est actif */}
                  {report.capture && (
                    <motion.img
                      src={report.capture}
                      alt="Capture"
                      className="report-image"
                      onClick={() =>
                        report.capture && setSelectedImage(report.capture)
                      }
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
                    {report.description.length > 150
                      ? `${report.description.substring(0, 150)}... `
                      : report.description}
                  </motion.span>
                </>
              )}
            </AnimatePresence>


            {/* 📌 Bouton "Voir plus" ou "Voir moins" avec chevron dynamique */}
            {(report.description.length > 150 || report.capture) && (
              <motion.span
                key="toggle"
                className="see-more"
                onClick={() => toggleExpand(report.id)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {expandedPosts[report.id] ? "Voir moins" : "Voir plus"}
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

          {/* ✅ Lightbox / Modal pour l’image en grand */}
          {selectedImage && (
            <div className="lightbox" onClick={() => setSelectedImage(null)}>
              <img src={`${selectedImage}`} alt="Zoomed" />
            </div>
          )}

          <div className="poll-systems">
            <div className="vote-item">
              <span className="percent-label">20%</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "20%" }}></div>
              </div>
              <span className="system-label">Windows</span>
            </div>

            <div className="vote-item">
              <span className="percent-label">80%</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "80%" }}></div>
              </div>
              <span className="system-label">Mac</span>
            </div>
          </div>

        </div>


      </div>



      <ReactionSection
        parentId={report.id}
        type="report"
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
        commentCount={commentCount}
        brandLogo={brandLogo}
      />
      {showCommentInput && (
        <CommentSection
          parentId={report.id}
          type="report"
          showCommentInput={showCommentInput}
          commentCount={commentCount}
          setCommentCount={setCommentCount} // ✅ Passe la mise à jour à `CommentSection`
        />
      )}
    </div>
  );
};

export default ReportCard;

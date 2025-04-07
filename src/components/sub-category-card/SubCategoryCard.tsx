import React, { useEffect, useState } from "react";
import "./SubCategoryCard.scss";
import SubReportCard from "../sub-report/SubReportCard";
import ReactionSection from "../reactions/reaction-section/ReactionSection";
import CommentSection from "../comment-section/CommentSection";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import defaultAvatar from "../../assets/images/user.png";
import { fetchBrandByName } from "@src/services/apiService";
import { stringToColor } from "@src/utils/stringToColor";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
//import EmojiUsersPopup from "../emojis-popup/EmojiUsersPopup";
import EmojiReactionsPopup from "../emojis-popup/EmojiReactionsPopup";

interface User {
  id: string;
  pseudo: string;
  avatar: string | null;
}

interface Description {
  description: string;
  user: User;
  createdAt: string;
  emoji?: string;
}

interface SubCategoryCardProps {
  title: string;
  count: number;
  subCategory: string;
  reportId: string;
  brandName: string;
  mainDescription: Description;
  otherDescriptions: Description[];
  isOpen: boolean;
  onToggle: () => void;
}

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({
  title,
  count,
  subCategory,
  reportId,
  brandName,
  mainDescription,
  otherDescriptions,
  isOpen,
  onToggle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [brandLogo, setBrandLogo] = useState<string | null>(null);

  const [showEmojiPopup, setShowEmojiPopup] = useState(false);

  // Regrouper les users par emoji
  const reactionsByEmoji: Record<string, { pseudo: string; avatar: string | null }[]> = {};

  [mainDescription, ...otherDescriptions].forEach(desc => {
    if (desc.emoji) {
      if (!reactionsByEmoji[desc.emoji]) {
        reactionsByEmoji[desc.emoji] = [];
      }
      reactionsByEmoji[desc.emoji].push({
        pseudo: desc.user.pseudo,
        avatar: desc.user.avatar || null,
      });
    }
  });

  // Liste résumée pour affichage (emoji + nombre de personnes)
  /* const emojiSummary = Object.entries(reactionsByEmoji).map(([emoji, users]) => ({
  emoji,
  count: users.length,
})); */

  useEffect(() => {
    const loadBrandLogo = async () => {
      if (!brandName) return;
      const brand = await fetchBrandByName(brandName);
      setBrandLogo(brand?.avatar || null);
    };

    loadBrandLogo();
  }, [brandName]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % otherDescriptions.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? otherDescriptions.length - 1 : prev - 1));
  };
  const emojiMap: Record<string, { pseudo: string; avatar: string | null }[]> = {};

  [mainDescription, ...otherDescriptions].forEach(desc => {
    if (desc.emoji) {
      if (!emojiMap[desc.emoji]) emojiMap[desc.emoji] = [];
      emojiMap[desc.emoji].push({
        pseudo: desc.user.pseudo,
        avatar: desc.user.avatar,
      });
    }
  });
  /* const getGroupedEmojiSummary = () => {
  const emojiCount: Record<string, number> = {};
  [...otherDescriptions, mainDescription].forEach((desc) => {
    if (desc.emoji) {
      emojiCount[desc.emoji] = (emojiCount[desc.emoji] || 0) + 1;
    }
  });

  const sortedEmojis = Object.entries(emojiCount).sort((a, b) => b[1] - a[1]);

  const total = sortedEmojis.reduce((acc, [, count]) => acc + count, 0);
  const displayed = sortedEmojis.slice(0, 3);
  const remaining = sortedEmojis.length - displayed.length;

  return {
    displayed,
    remaining,
    total,
  };
};

const { displayed, remaining, total } = getGroupedEmojiSummary(); */
  return (
    <div className="subcategory-card">
      <div className="subcategory-header" onClick={onToggle}>
        <div className="subcategory-left">
          <h3 className="subcategory-title">{title}</h3>
          <span className="count">{count} signalements</span>
        </div>

        <div className="avatar-brand-wrapper">
          <img
            src={
              mainDescription.user.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}/${mainDescription.user.avatar}`
                : defaultAvatar
            }
            alt={mainDescription.user.pseudo}
            className="user-avatar"
          />

          {brandLogo ? (
            <img src={brandLogo} alt="Logo marque" className="brand-logo" />
          ) : (
            <div
              className="brand-logo-fallback"
              title={brandName}
              style={{
                backgroundColor: stringToColor(brandName),
                color: "#fff",
              }}
            >
              {brandName.length > 4 ? brandName.slice(0, 3) + "…" : brandName}
            </div>
          )}
        </div>

        <span className={`toggle-icon ${isOpen ? "open" : ""}`}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </div>

      {isOpen && (
        <div className={`subcategory-details ${isOpen ? "" : "collapsed"}`}>
          {/* Premier signaleur */}
          <div className="subreportcard-slide">
            <div className="avatar-wrapper">
              <img
                src={
                  mainDescription.user.avatar
                    ? `${import.meta.env.VITE_API_BASE_URL}/${mainDescription.user.avatar}`
                    : defaultAvatar
                }
                alt={mainDescription.user.pseudo}
                className="avatar"
              />
              {mainDescription.emoji && (
                <span className="emoji-overlay">{mainDescription.emoji}</span>
              )}
            </div>

            <div className="info">
              <strong>{mainDescription.user.pseudo}</strong>
              {mainDescription.createdAt && (
                <span className="date">・{formatRelativeTime(mainDescription.createdAt)}</span>
              )}
              <p className="description">{mainDescription.description}</p>
            </div>
          </div>

          {/* Autres signaleurs */}
          {otherDescriptions.length > 0 && (
            <>
              <div className="slider-section">
                {otherDescriptions.length > 1 && (
                  <button onClick={prevSlide} className="slider-button">
                    <ChevronLeft className="chevron-icon" />
                  </button>
                )}
                <div className="slide-card">
                  <SubReportCard
                    user={otherDescriptions[currentIndex].user}
                    description={otherDescriptions[currentIndex].description}
                    createdAt={otherDescriptions[currentIndex].createdAt}
                    emoji={otherDescriptions[currentIndex].emoji}
                    reportId={reportId}
                    brandName={brandName}
                    subCategory={subCategory}
                  />
                </div>
                {otherDescriptions.length > 1 && (
                  <button onClick={nextSlide} className="slider-button">
                    <ChevronRight className="chevron-icon" />
                  </button>
                )}
              </div>

              {/* 🔢 Compteur déplacé ici */}
              {otherDescriptions.length > 1 && (
                <div className="slider-counter">
                  {currentIndex + 1} / {otherDescriptions.length}
                </div>
              )}
            </>
          )}
          {/*           {emojiSummary.length > 0 && (
            <div
              className="emoji-summary"
              onClick={() => setShowEmojiPopup(true)}
            >
              {displayed.map(([emoji]) => (
                <span key={emoji} className="emoji-icon">
                  {emoji}
                </span>
              ))}

              {remaining > 0 && (
                <span className="emoji-more">+{remaining} autres</span>
              )}

              <span className="emoji-total">({total})</span>
            </div>
          )} */}

          <ReactionSection
            parentId={reportId}
            type="report"
            showCommentInput={showCommentInput}
            setShowCommentInput={setShowCommentInput}
            commentCount={commentCount}
            brandLogo={null}
          />
          {showCommentInput && (
            <CommentSection
              parentId={reportId}
              type="report"
              showCommentInput={showCommentInput}
              commentCount={commentCount}
              setCommentCount={setCommentCount}
            />
          )}
        </div>
      )}
      {/* Emoji popup */}

      {showEmojiPopup && (
        <EmojiReactionsPopup
          reactionsByEmoji={reactionsByEmoji}
          onClose={() => setShowEmojiPopup(false)}
        />
      )}
    </div>
  );
};

export default SubCategoryCard;

/* import React, { useState } from "react";
import "./SubCategoryCard.scss";

interface User {
  id: string;
  pseudo: string;
  avatar: string | null;
}

interface DescriptionWithUser {
  description: string;
  user: User;
}

interface SubCategoryCardProps {
  title: string;
  count: number;
  mainDescription: DescriptionWithUser;
  otherDescriptions: DescriptionWithUser[];
}

const SubCategoryCard: React.FC<SubCategoryCardProps> = ({
  title,
  mainDescription,
  otherDescriptions,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % otherDescriptions.length);

  const prev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? otherDescriptions.length - 1 : prev - 1
    );

  return (
    <div className="subcategory-card-container">
    
      <p className="subcategory-title">{title}</p>

      <div className="main-user">
        <img
          src={
            mainDescription.user.avatar
              ? `${import.meta.env.VITE_API_BASE_URL}/${
                  mainDescription.user.avatar
                }`
              : "/default-avatar.png"
          }
          alt={mainDescription.user.pseudo}
        />
        <div>
          <strong>{mainDescription.user.pseudo}</strong>
          <p>{mainDescription.description}</p>
        </div>
      </div>

     
      {otherDescriptions.length > 0 && (
        <div className="slider">
          <button onClick={prev}>&lt;</button>
          <div className="slide">
            <img
              src={
                otherDescriptions[currentIndex].user.avatar
                  ? `${import.meta.env.VITE_API_BASE_URL}/${
                      otherDescriptions[currentIndex].user.avatar
                    }`
                  : "/default-avatar.png"
              }
              alt={otherDescriptions[currentIndex].user.pseudo}
            />
            <div>
              <strong>{otherDescriptions[currentIndex].user.pseudo}</strong>
              <p>{otherDescriptions[currentIndex].description}</p>
            </div>
          </div>
          <button onClick={next}>&gt;</button>
        </div>
      )}
    </div>
  );
};

export default SubCategoryCard; */

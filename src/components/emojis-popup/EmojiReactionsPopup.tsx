import React, { useState } from "react";
import "./EmojiReactionsPopup.scss";
import defaultAvatar from "@src/assets/images/user.png";

interface User {
  pseudo: string;
  avatar: string | null;
}

interface Props {
  reactionsByEmoji: Record<string, User[]>;
  onClose: () => void;
}

const EmojiReactionsPopup: React.FC<Props> = ({ reactionsByEmoji, onClose }) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const renderUserCard = (user: User, idx: number, emoji: string) => (
    <div className="user-card" key={idx}>
      <div className="avatar-wrapper">
        <img
          src={user.avatar ? `${import.meta.env.VITE_API_BASE_URL}/${user.avatar}` : defaultAvatar}
          alt={user.pseudo}
          className="avatar"
        />
        <span className="emoji-badge">{emoji}</span>
      </div>
      <span className="pseudo">{user.pseudo}</span>
    </div>
  );

  return (
    <div className="emoji-popup-overlay">
      <div className="emoji-popup">
        <div className="popup-header">
          <h3>Réactions des utilisateurs</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="emoji-filters">
          <button
            className={activeFilter === "all" ? "active" : ""}
            onClick={() => setActiveFilter("all")}
          >
            Tous ({Object.values(reactionsByEmoji).flat().length})
          </button>

          {Object.keys(reactionsByEmoji).map(emoji => (
            <button
              key={emoji}
              className={activeFilter === emoji ? "active" : ""}
              onClick={() => setActiveFilter(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="emoji-popup-content">
          {activeFilter === "all" ? (
            Object.entries(reactionsByEmoji).map(([emoji, users]) => (
              <div key={emoji} className="emoji-group">
                <div className="user-list">
                  {users.map((user, idx) => renderUserCard(user, idx, emoji))}
                </div>
              </div>
            ))
          ) : (
            <div className="emoji-group">
              <div className="user-list">
                {(reactionsByEmoji[activeFilter] || []).map((user, idx) =>
                  renderUserCard(user, idx, activeFilter)
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmojiReactionsPopup;

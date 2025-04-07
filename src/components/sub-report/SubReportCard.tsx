import React from "react";
import "./SubReportCard.scss";
import defaultAvatar from "@src/assets/images/user.png";
import { formatRelativeTime } from "@src/utils/formatRelativeTime";
import { getEmojiLabel } from "@src/utils/emojiLabels";

interface User {
  id: string;
  pseudo: string;
  avatar: string | null;
}

interface Props {
  description: string;
  user: User;
  createdAt: string;
  subCategory: string;
  reportId: string;
  brandName: string;
  emoji?: string;
}

const SubReportCard: React.FC<Props> = ({ description, user, createdAt, emoji }) => {
  return (
    <div className="subreportcard-slide">
      <div className="avatar-wrapper">
        <img
          src={user.avatar ? `${import.meta.env.VITE_API_BASE_URL}/${user.avatar}` : defaultAvatar}
          alt={user.pseudo}
          className="avatar"
        />

        {emoji && (
          <span
            className="emoji-overlay"
            role="img"
            aria-label={getEmojiLabel(emoji, "report")}
            title={getEmojiLabel(emoji, "report")}
          >
            {emoji}
          </span>
        )}
      </div>

      <div className="info">
        <div className="meta">
          <strong>{user.pseudo}</strong>
          <span className="date">・{formatRelativeTime(createdAt)}</span>
        </div>
        <p className="description">{description}</p>
      </div>
    </div>
  );
};

export default SubReportCard;

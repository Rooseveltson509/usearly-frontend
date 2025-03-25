import React from "react";
import "./UserResponseCard.scss";

interface UserResponseCardProps {
  avatars: string[];
  count: number;
  title: string;
  subtitle: string;
  status?: { count: number }[];
  mainIcon: string;
}

const UserResponseCard: React.FC<UserResponseCardProps> = ({
  avatars,
  count,
  title,
  subtitle,
  status,
  mainIcon,
}) => {
  return (
    <div className="user-response-card">
      <div className="avatars">
        {avatars.map((avatar, index) => (
          <img
            src={avatar}
            alt={`avatar-${index}`}
            key={index}
            className="avatar"
          />
        ))}
      </div>

      <div className="count">{count}</div>
      <div className="title">{title}</div>

      <div className="main-icon-container">
        <img src={mainIcon} alt="main-icon" />
      </div>

      <div className="status-container">
        {status &&
          status.map((item, index) => (
            <div key={index} className="status-item">
              <span>{item.count}</span>
            </div>
          ))}
      </div>

      <div className="subtitle">{subtitle}</div>

      <button className="reply-button">Répondre</button>
    </div>
  );
};

export default UserResponseCard;

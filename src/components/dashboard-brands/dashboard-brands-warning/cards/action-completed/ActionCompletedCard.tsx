import React from "react";
import "./ActionCompletedCard.scss";

interface ActionCompletedCardProps {
  icon: string;
  count: number;
  title: string;
  description: string;
  userCount: number;
}

const ActionCompletedCard: React.FC<ActionCompletedCardProps> = ({
  icon,
  count,
  title,
  description,
  userCount,
}) => {
  return (
    <div className="action-completed-card">
      <img src={icon} alt="icon" className="action-icon" />
      <div className="count">{count}</div>
      <div className="title">{title}</div>
      <div className="description">
        {description}{" "}
        <span className="highlight">{userCount} utilisateurs)</span>
      </div>
    </div>
  );
};

export default ActionCompletedCard;

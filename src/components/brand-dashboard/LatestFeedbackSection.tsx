import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LatestFeedbacksSection.scss";
import { FeedbackItem } from "@src/types/feedbackItem";
//mport defaultAvatar from "../../../assets/images/user.png";

type FeedbackType = "reporting" | "coupdecoeur" | "suggestion";

export const LatestFeedbacksSection: React.FC<{ marque: string }> = ({ marque }) => {
  const [selectedType, setSelectedType] = useState<FeedbackType>("reporting");
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/brand/${marque}/latest-feedbacks?type=${selectedType}`
        );
        setFeedbacks(data);
      } catch (err) {
        console.error("Erreur lors du chargement des feedbacks", err);
      }
    };
    fetchFeedbacks();
  }, [selectedType, marque]);

  return (
    <div className="latest-feedbacks-section">
      <div className="header">
        <h3>Derniers feedbacks</h3>
        <select
          className="filter-select"
          value={selectedType}
          onChange={e => setSelectedType(e.target.value as FeedbackType)}
        >
          <option value="reporting">Signalements</option>
          <option value="coupdecoeur">Coup de cœur</option>
          <option value="suggestion">Suggestions</option>
        </select>
      </div>
      <div className="feedback-list">
        {feedbacks.length === 0 ? (
          <p className="empty">Aucun feedback pour le moment.</p>
        ) : (
          feedbacks.map((item, index) => (
            <div key={index} className="feedback-item">
              <div className="left">
                <span className="emoji">{item.emoji}</span>
              </div>
              <div className="middle">
                <p className="desc">{item.description}</p>
                <div className="user-info">
                  <img
                    src={
                      item.user.avatar
                        ? `${import.meta.env.VITE_API_BASE_URL}/${item.user.avatar}`
                        : "defaultAvatar"
                    }
                    alt={item.user.pseudo}
                    className="avatar"
                  />
                  <span className="pseudo">{item.user.pseudo}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default LatestFeedbacksSection;

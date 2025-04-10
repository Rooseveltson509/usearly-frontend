import React from "react";
import "./AnalyticsBrandView.scss";
import { FeedbackItem } from "@src/types/feedbackItem";
import defaultAvatar from "../../../assets/images/user.png";


interface AnalyticsBrandViewProps {
  total: number;
  angry: number;
  comments: number;
  monthlyCount: number;
  averagePerDay: number;
  topCategory: string;
  latestFeedbacks: FeedbackItem[];
}

const AnalyticsBrandView: React.FC<AnalyticsBrandViewProps> = ({
  total,
  angry,
  comments,
  monthlyCount,
  averagePerDay,
  topCategory,
  latestFeedbacks,
}) => {
  return (
    <div className="analytics-brand-view">
      <div className="top-section">
        <div className="card">
          <div className="card-title">⚠️ Signalements</div>
          <div className="card-value">{total}</div>
          <div className="card-sub">
            <a href="#">Voir les statistiques</a>
          </div>
        </div>

        <div className="card stats">
          <div className="card-title">📊 Statistiques</div>
          <div className="stat-list">
            <div className="stat-item">
              • <strong>{monthlyCount}</strong> signalements ce mois–ci
            </div>
            <div className="stat-item">
              • <strong>{averagePerDay.toFixed(1)}</strong> signalements par jour
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">🔥 En colère</div>
          <div className="card-value">{angry}</div>
        </div>

        <div className="card">
          <div className="card-title">💬 Commentaires</div>
          <div className="card-value">{comments}</div>
        </div>
      </div>

      <div className="bottom-section">
        <div className="recent-reports">
          <div className="section-title">Signalements récents</div>
          {latestFeedbacks.map((item, index) => (
            <div key={index} className="report-item">
              <div className="emoji">{item.emoji}</div>
              <div className="report-content">
                <div className="user-info">
                  <img
                    src={
                      item.user.avatar
                        ? `${import.meta.env.VITE_API_BASE_URL}/${item.user.avatar}`
                        : defaultAvatar // Remplacer si l'avatar est manquant
                    }
                    alt={item.user.pseudo}
                    className="brand-logo"
                  />
                  <span className="pseudo">{item.user.pseudo}</span>
                </div>
                <div className="description">{item.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="top-feedback">
          <div className="section-title">Top signalement</div>
          {topCategory ? (
            <div className="report-item">
              <div className="emoji">🔥</div>
              <div className="description">{topCategory}</div>
            </div>
          ) : (
            <p>Aucun signalement populaire.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsBrandView;

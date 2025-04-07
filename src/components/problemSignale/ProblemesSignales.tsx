import React from "react";
import "./ProblemesSignales.scss";

const problemes = [
  {
    id: 1,
    icon: "⏳",
    name: "Temps de chargement",
    percentage: 50,
    count: 250,
    trend: "up",
    color: "red",
  },
  {
    id: 2,
    icon: "🛒",
    name: "Panier",
    percentage: 20,
    count: 100,
    trend: "down",
    color: "red",
  },
  {
    id: 3,
    icon: "📞",
    name: "Service client",
    percentage: 15,
    count: 75,
    trend: "neutral",
    color: "orange",
  },
  {
    id: 4,
    icon: "🖥",
    name: "Affichage incorrect",
    percentage: 10,
    count: 50,
    trend: "down",
    color: "grey",
  },
  {
    id: 5,
    icon: "🛤",
    name: "Parcours complexe",
    percentage: 5,
    count: 25,
    trend: "up",
    color: "purple",
  },
];

const ProblemesSignales: React.FC = () => {
  return (
    <div className="problemes-card">
      <div className="header">
        <h3>Problèmes les plus signalés</h3>
        <button className="btn-next">→</button>
      </div>
      <div className="problemes-list">
        {problemes.map(item => (
          <div key={item.id} className="probleme-item">
            <span className="icon">{item.icon}</span>
            <div className="details">
              <span className="probleme-name">{item.name}</span>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    inlineSize: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
            </div>
            <span className="percentage">{item.percentage}%</span>
            <span className="count">{item.count}</span>
            <span className={`trend ${item.trend}`}>
              {item.trend === "up" ? "🔺" : item.trend === "down" ? "🔻" : "➖"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemesSignales;

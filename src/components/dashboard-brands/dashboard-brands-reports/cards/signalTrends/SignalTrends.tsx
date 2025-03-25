import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./SignalTrends.scss";
import { CartesianGrid } from "recharts";
import { FiChevronRight } from "react-icons/fi";

const data = [
  { month: "Janv.", critiques: 100, majeurs: 30, mineures: 20 },
  { month: "Fév.", critiques: 120, majeurs: 40, mineures: 25 },
  { month: "Mars", critiques: 90, majeurs: 35, mineures: 22 },
  { month: "Avr.", critiques: 80, majeurs: 30, mineures: 20 },
  { month: "Mai", critiques: 160, majeurs: 50, mineures: 40 },
  { month: "Juin", critiques: 200, majeurs: 60, mineures: 50 },
];

const SignalTrends = () => {
  return (
    <div className="signal-trends">
      <button className="card-btn">
        <FiChevronRight className="card-btn-icon" />
      </button>
      <h2>Évolution des signalements</h2>
      <p className="subtitle">Visualisez l’évolution des signalements.</p>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            barCategoryGap={18}
          >
            <Tooltip cursor={{ fill: "rgba(200, 200, 200, 0.1)" }} />
            <CartesianGrid
              strokeDasharray="0"
              stroke="#EBEBEB"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              stroke="#EBEBEB" // Atténue la barre
              tick={{ fill: "#333", fontSize: 11 }} // Garde le texte visible et sombre
            />

            <YAxis
              width={30}
              stroke="#FFFFFF" // Atténue la barre
              tick={{ fill: "#333", fontSize: 11 }} // Garde le texte visible et sombre
            />
            <Tooltip />

            <Bar
              dataKey="critiques"
              stackId="a"
              fill="#EB5757"
              radius={[0, 0, 20, 20]}
            />
            <Bar
              dataKey="majeurs"
              stackId="a"
              fill="#F2C94C"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="mineures"
              stackId="a"
              fill="#9B51E0"
              radius={[20, 20, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="dot red"></span> Critiques
        </div>
        <div className="legend-item">
          <span className="dot yellow"></span> Majeurs
        </div>
        <div className="legend-item">
          <span className="dot purple"></span> Mineures
        </div>
      </div>
    </div>
  );
};

export default SignalTrends;

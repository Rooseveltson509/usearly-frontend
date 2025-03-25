import React from "react";
import "./ExperienceLine.scss";

/**
 * "ExperienceLine":
 *  - 7 points (x=0..6)
 *  - Fond alterné (blanc / gris) pour chaque colonne
 *  - 4 lignes horizontales (haut, 1/3, 2/3, bas)
 *  - Une barre à gauche composée de 3 segments (vert en haut, jaune au milieu, rouge en bas)
 *  - Le label "Expérience" avec le style vertical-rl + rotation(180deg) (via CSS)
 *  - Ligne reliant les 7 émojis, avec dégradés
 *  - Responsive (viewBox + width="100%" height="auto")
 */
const ExperienceLine: React.FC = () => {
  // Données d'exemple
  const data = [
    { x: 0, y: 60, color: "#f2cd68", emoji: "😐" },
    { x: 1, y: 80, color: "#7ed386", emoji: "😊" },
    { x: 2, y: 55, color: "#f2cd68", emoji: "😐" },
    { x: 3, y: 20, color: "#f37b7b", emoji: "☹️" },
    { x: 4, y: 45, color: "#f2cd68", emoji: "😐" },
    { x: 5, y: 30, color: "#f37b7b", emoji: "☹️" },
    { x: 6, y: 15, color: "#f37b7b", emoji: "☹️" },
  ];

  // Dimensions "internes" pour le SVG (viewBox)
  const WIDTH = 600;
  const HEIGHT = 90;

  // Barre de gauche
  const LEFT_BAR_WIDTH = 5;

  // 7 colonnes
  const columnsCount = data.length;
  const graphWidth = WIDTH - LEFT_BAR_WIDTH;
  const columnWidth = graphWidth / columnsCount;

  // Échelle Y
  const scaleY = (val: number) => HEIGHT - (val / 100) * HEIGHT;
  // Échelle X
  const scaleX = (val: number) => LEFT_BAR_WIDTH + (val + 0.5) * columnWidth;

  // Points pour la polyline
  const linePoints = data.map((d) => `${scaleX(d.x)},${scaleY(d.y)}`).join(" ");

  // 4 lignes horizontales
  const horizontalLines = [0, HEIGHT / 3, (2 * HEIGHT) / 3, HEIGHT];

  return (
    <div className="experience-line-container">
      {/* 
        Le texte "Expérience" est un <span> sur lequel on applique
        .title-experience (écrit en vertical + rotation via CSS).
      */}
      <span className="title-experience">Expérience</span>

      {/* SVG responsive */}
      <svg
        className="experience-chart"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
      >
        {/* 3 segments (vert / jaune / rouge) à gauche */}
        <rect
          x={0}
          y={0}
          width={LEFT_BAR_WIDTH}
          height={HEIGHT / 3}
          fill="#7ed386"
        />
        <rect
          x={0}
          y={HEIGHT / 3}
          width={LEFT_BAR_WIDTH}
          height={HEIGHT / 3}
          fill="#f2cd68"
        />
        <rect
          x={0}
          y={(2 * HEIGHT) / 3}
          width={LEFT_BAR_WIDTH}
          height={HEIGHT / 3}
          fill="#f37b7b"
        />

        {/* Fond alterné (colonnes) */}
        {Array.from({ length: columnsCount }).map((_, i) => (
          <rect
            key={i}
            x={LEFT_BAR_WIDTH + i * columnWidth}
            y={0}
            width={columnWidth}
            height={HEIGHT}
            fill={i % 2 === 0 ? "#f7f7f7" : "#fff"}
          />
        ))}

        {/* 4 lignes horizontales */}
        {horizontalLines.map((yPos, i) => (
          <line
            key={i}
            x1={0}
            y1={yPos}
            x2={WIDTH}
            y2={yPos}
            stroke="#D6D6D6"
            strokeWidth={0.5}
          />
        ))}

        {/* Polyline grise */}
        <polyline
          fill="none"
          stroke="#D6D6D6"
          strokeWidth={2}
          points={linePoints}
        />

        {/* Segments colorés (dégradés) */}
        {data.slice(0, -1).map((d, i) => {
          const next = data[i + 1];
          const gradId = `grad-${i}`;
          return (
            <React.Fragment key={i}>
              <defs>
                <linearGradient
                  id={gradId}
                  gradientUnits="userSpaceOnUse"
                  x1={scaleX(d.x)}
                  y1={scaleY(d.y)}
                  x2={scaleX(next.x)}
                  y2={scaleY(next.y)}
                >
                  <stop offset="0%" stopColor={d.color} />
                  <stop offset="100%" stopColor={next.color} />
                </linearGradient>
              </defs>
              <line
                x1={scaleX(d.x)}
                y1={scaleY(d.y)}
                x2={scaleX(next.x)}
                y2={scaleY(next.y)}
                stroke={`url(#${gradId})`}
                strokeWidth={3}
              />
            </React.Fragment>
          );
        })}

        {/* Cercles + émojis */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={scaleX(d.x)} cy={scaleY(d.y)} r={5} fill={d.color} />
            <text
              x={scaleX(d.x)}
              y={scaleY(d.y) + 1}
              fontSize={8}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {d.emoji}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default ExperienceLine;

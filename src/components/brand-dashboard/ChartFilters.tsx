import React from "react";
import "./ChartFilters.scss";

export interface ChartFiltersProps {
  visibleCurves: {
    signalements: boolean;
    coupsDeCoeur: boolean;
    suggestions: boolean;
  };
  toggleCurve: (key: keyof ChartFiltersProps["visibleCurves"]) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const ChartFilters: React.FC<ChartFiltersProps> = ({
  visibleCurves,
  toggleCurve,
  selectedPeriod,
  onPeriodChange,
}) => {
  return (
    <div className="chart-filters">
      <div className="curve-buttons">
        <button
          className={`filter-btn blue ${visibleCurves.signalements ? "active" : ""}`}
          onClick={() => toggleCurve("signalements")}
        >
          📢 Signalements
        </button>
        <button
          className={`filter-btn red ${visibleCurves.coupsDeCoeur ? "active" : ""}`}
          onClick={() => toggleCurve("coupsDeCoeur")}
        >
          ❤️ Coup de cœur
        </button>
        <button
          className={`filter-btn orange ${visibleCurves.suggestions ? "active" : ""}`}
          onClick={() => toggleCurve("suggestions")}
        >
          💡 Suggestions
        </button>
      </div>

      <div className="period-select">
        <label>Période :</label>
        <select value={selectedPeriod} onChange={e => onPeriodChange(e.target.value)}>
          <option value="7">7 jours</option>
          <option value="15">15 jours</option>
          <option value="30">30 jours</option>
          <option value="60">2 mois</option>
        </select>
      </div>
    </div>
  );
};

export default ChartFilters;

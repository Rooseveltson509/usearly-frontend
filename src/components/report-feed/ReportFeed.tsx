import React from "react";
//import ReportCard from "../reportCard/ReportCard";
import CoupDeCoeurCard from "../cdc/CoupDeCoeurCard";
import SuggestionCard from "../suggestion/SuggestionCard";
import { Cdc, Suggestion, GroupedReport } from "@src/types/Reports";
import "./ReportFeed.scss";
import GroupedReportCard from "../group-report-card/GroupedReportCard";

interface ReportFeedProps {
  selectedFilter: string;
  groupedReports: GroupedReport[];
  coupDeCoeurs: Cdc[];
  suggestions: Suggestion[];
  loading: boolean;
  error: string | null;
  getIconByFilter: (filter: string) => string;
  activeSubCategory: string | null;
  handleToggle: (subCategory: string) => void;
  totalCount?: number;
}

const ReportFeed: React.FC<ReportFeedProps> = ({
  selectedFilter,
  groupedReports,
  coupDeCoeurs,
  suggestions,
  loading,
  error,
  activeSubCategory,
  handleToggle,
  getIconByFilter, // Récupération de la fonction ici
}) => {
  return (
    <div className="report-feed">
      {loading && <p className="loading-message">Chargement en cours...</p>}
      {error && <p className="error-message">{error}</p>}

      {selectedFilter === "Coup de Cœur" && coupDeCoeurs.length > 0 ? (
        coupDeCoeurs.map(coupDeCoeur => (
          <CoupDeCoeurCard
            key={coupDeCoeur.id}
            coupDeCoeur={coupDeCoeur}
            selectedFilter={selectedFilter}
            getIconByFilter={getIconByFilter}
          />
        ))
      ) : selectedFilter === "Suggestions" && suggestions.length > 0 ? (
        suggestions.map(suggestion => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            selectedFilter={selectedFilter}
            getIconByFilter={getIconByFilter}
          />
        ))
      ) : selectedFilter === "Signalements" && groupedReports.length > 0 ? (
        groupedReports.map(report => (
          <GroupedReportCard
            key={report.reportingId}
            report={report}
            activeSubCategory={activeSubCategory}
            handleToggle={handleToggle}
            totalCount={report.totalCount}
          />
        ))
      ) : (
        <p>Aucun {selectedFilter.toLowerCase()} trouvé</p>
      )}
    </div>
  );
};

export default ReportFeed;

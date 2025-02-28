import React from "react";
import ReportCard from "../reportCard/ReportCard";
import CoupDeCoeurCard from "../cdc/CoupDeCoeurCard";
import SuggestionCard from "../suggestion/SuggestionCard";
import { Reports, Cdc, Suggestion } from "@src/types/Reports";

interface ReportFeedProps {
  selectedFilter: string;
  reports: Reports[];
  coupDeCoeurs: Cdc[];
  suggestions: Suggestion[];
  loading: boolean;
  error: string | null;
  getIconByFilter: (filter: string) => string; // Ajout de la fonction en prop
}

const ReportFeed: React.FC<ReportFeedProps> = ({
  selectedFilter,
  reports,
  coupDeCoeurs,
  suggestions,
  loading,
  error,
  getIconByFilter, // Récupération de la fonction ici
}) => {
  return (
    <div className="report-feed">
      {loading && <p className="loading-message">Chargement en cours...</p>}
      {error && <p className="error-message">{error}</p>}

      {selectedFilter === "Coup de Cœur" && coupDeCoeurs.length > 0 ? (
        coupDeCoeurs.map((coupDeCoeur) => (
          <CoupDeCoeurCard
            key={coupDeCoeur.id}
            coupDeCoeur={coupDeCoeur}
            selectedFilter={selectedFilter}
            getIconByFilter={getIconByFilter}
          />
        ))
      ) : selectedFilter === "Suggestions" && suggestions.length > 0 ? (
        suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            selectedFilter={selectedFilter}
            getIconByFilter={getIconByFilter}
          />
        ))
      ) : selectedFilter === "Signalements" && reports.length > 0 ? (
        reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            selectedFilter={selectedFilter}
            getIconByFilter={getIconByFilter}
          />
        ))
      ) : (
        <p>Aucun {selectedFilter.toLowerCase()} trouvé.</p>
      )}
    </div>
  );
};

export default ReportFeed;

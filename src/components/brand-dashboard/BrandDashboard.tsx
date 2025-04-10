import { useEffect, useState } from "react";
import "./BrandDashboard.scss";
import ChartFilters from "./ChartFilters";
import AnalyticsChart from "./Analiticschart";
import LatestFeedbacksSection from "./LatestFeedbackSection";
import AnalyticsBrandView from "./view/AnalyticsBrandView";
import { useAuth } from "@src/contexts/AuthContext";
import defaultAvatar from "../../assets/images/user.png";
import { FeedbackItem } from "@src/types/feedbackItem";

interface ChartDataPoint {
  date: string;
  signalements: number;
  coupsDeCoeur: number;
  suggestions: number;
  dayLabel: string;
}

interface SummaryData {
  signalementsTotal: number;
  coupsDeCoeurTotal: number;
  suggestionsTotal: number;
  enColere: number;
  commentaires: number;
}

const BrandDashboard = () => {
  const { userProfile } = useAuth();
  const marque = userProfile?.name;
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  const [viewMode, setViewMode] = useState<"default" | "analytics">("default");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [visibleCurves, setVisibleCurves] = useState({
    signalements: true,
    coupsDeCoeur: true,
    suggestions: true,
  });
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [topFeedback, setTopFeedback] = useState<string>("");
  const [latestFeedbacks, setLatestFeedbacks] = useState<FeedbackItem[]>([]);

  const getDayLabel = (dateStr: string): string => {
    const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const date = new Date(dateStr);
    return jours[date.getDay()];
  };

  useEffect(() => {
    if (!marque) return;

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/brand/${userProfile?.name}/analytics/weekly?days=${selectedPeriod}`
        );
        const data = await res.json();
        const formatted: ChartDataPoint[] = data.map((d: Omit<ChartDataPoint, "dayLabel">) => ({
          ...d,
          dayLabel: getDayLabel(d.date),
        }));
        setChartData(formatted);
      } catch (err) {
        console.error("Erreur chargement analytics:", err);
      }
    };

    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/brand/${userProfile?.name}/analytics/summary`
        );
        const data: SummaryData = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Erreur chargement résumé:", err);
      }
    };

    const fetchTopFeedback = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/brand/${userProfile?.name}/top-report`
        );
        const data = await res.json();
        setTopFeedback(data.description);
      } catch (err) {
        console.error("Erreur top report:", err);
      }
    };

    const fetchLatestFeedbacks = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/brand/${userProfile?.name}/latest-feedbacks?type=reporting`
        );
        const data = await res.json();
        setLatestFeedbacks(data);
      } catch (err) {
        console.error("Erreur derniers feedbacks:", err);
      }
    };

    fetchAnalytics();
    fetchSummary();
    fetchTopFeedback();
    fetchLatestFeedbacks();
  }, [marque, selectedPeriod, userProfile?.name]);

  const toggleCurve = (key: keyof typeof visibleCurves) => {
    setVisibleCurves(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDateRange = (days: number): string => {
    const end = new Date(); // aujourd'hui
    const start = new Date();
    start.setDate(end.getDate() - (days - 1)); // début de la période

    const format = (d: Date) =>
      d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });

    return `${format(start)} → ${format(end)}`;
  };

  const isChartEmpty = (data: ChartDataPoint[]) => {
    return data.every(
      point => point.signalements === 0 && point.coupsDeCoeur === 0 && point.suggestions === 0
    );
  };

  return (
    <div className="brand-dashboard">
      <div className="dashboard-switch">
        <button
          className={viewMode === "default" ? "active" : ""}
          onClick={() => setViewMode("default")}
        >
          Vue classique
        </button>
        <button
          className={viewMode === "analytics" ? "active" : ""}
          onClick={() => setViewMode("analytics")}
        >
          Vue analytique
        </button>
      </div>

      <div className="brand-info">
        <div className="brand-avatar">
          <img
            src={
              userProfile?.avatar
                ? `${import.meta.env.VITE_API_BASE_URL}/${userProfile.avatar}`
                : defaultAvatar
            }
            alt="Logo de la marque"
            className="brand-logo"
          />
        </div>
        <div className="brand-details">
          <p className="brand-name">{userProfile?.name}</p>
          <p className="brand-offre">Offre : {userProfile?.offres}</p>
        </div>
      </div>

      {viewMode === "default" ? (
        <>
          <h1>Bienvenue sur votre tableau de bord, Marque !</h1>
          <p className="subtitle">Cette page est dédiée à votre activité sur Usearly.</p>

          <div className="cards-wrapper">
            <div className="info-card">
              <span className="emoji">🥺</span>
              <div>
                <p className="count">{summary?.signalementsTotal ?? "-"}</p>
                <p className="label">Signalements total</p>
              </div>
            </div>
            <div className="info-card">
              <span className="emoji">❤️</span>
              <div>
                <p className="count">{summary?.coupsDeCoeurTotal ?? "-"}</p>
                <p className="label">Coup de cœur</p>
              </div>
            </div>
            <div className="info-card">
              <span className="emoji">💡</span>
              <div>
                <p className="count">{summary?.suggestionsTotal ?? "-"}</p>
                <p className="label">Suggestions</p>
              </div>
            </div>
            <div className="info-card">
              <span className="emoji">😡</span>
              <div>
                <p className="count">{summary?.enColere ?? "-"}</p>
                <p className="label">En colère</p>
              </div>
            </div>
            <div className="info-card">
              <span className="emoji">💬</span>
              <div>
                <p className="count">{summary?.commentaires ?? "-"}</p>
                <p className="label">Commentaires</p>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="chart-container">
              <h3>
                Activité hebdomadaire{" "}
                <span className="period-range">({formatDateRange(Number(selectedPeriod))})</span>
              </h3>

              <ChartFilters
                visibleCurves={visibleCurves}
                toggleCurve={toggleCurve}
                selectedPeriod={selectedPeriod}
                onPeriodChange={p => setSelectedPeriod(p)}
              />
              {!isChartEmpty(chartData) ? (
                <AnalyticsChart data={chartData} visibleCurves={visibleCurves} />
              ) : (
                <p className="empty-chart">Aucune donnée pour cette période.</p>
              )}
            </div>

            <div className="latest-feedbacks-wrapper">
              {userProfile?.name && <LatestFeedbacksSection marque={userProfile.name} />}
            </div>
          </div>
        </>
      ) : (
        <AnalyticsBrandView
          total={summary?.signalementsTotal ?? 0}
          angry={summary?.enColere ?? 0}
          comments={summary?.commentaires ?? 0}
          monthlyCount={summary?.signalementsTotal ?? 0}
          averagePerDay={summary ? summary.signalementsTotal / 7 : 0}
          topCategory={topFeedback}
          latestFeedbacks={latestFeedbacks}
        />
      )}
    </div>
  );
};

export default BrandDashboard;

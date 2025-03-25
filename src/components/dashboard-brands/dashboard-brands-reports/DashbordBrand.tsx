import signalIcon from "../../../assets/icons/report.svg";
import "./DashboardBrand.scss";
import { FaChevronDown } from "react-icons/fa"; // Import de l'icône
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SideBarLeft from "../aside-bar/SideBarLeft";
import ProblemesSignales from "./cards/problemSignales/ProblemesSignales";
import Signalements from "./cards/signalements/Signalements";
import ExperienceEmotionnelle from "./cards/experiencesEmotionnelles/ExperienceEmotionnelle";
import ProblemesCritiques from "./cards/problemesCritiques/ProblemesCritiques";
import Technologie from "./cards/technologie/Technologie";
import { ResolutionChart } from "./cards/resolutionChart/ResolutionChart";
import { ResolutionTrends } from "./cards/resolutionTrends/ResolutionTrends";
import SignalTrends from "./cards/signalTrends/SignalTrends";
//import DashboardHeader from "../header/DashboardHeader";

// ✅ Déplace DateSelector ici, AVANT DashboardBrand
const DateSelector = () => {
  return (
    <div className="date-filter">
      <button className="prev">
        <FaChevronLeft style={{ fontSize: "14px", fontWeight: "normal" }} />
      </button>
      <span className="date-text">30 derniers jours</span>
      <button className="next">
        <FaChevronRight style={{ fontSize: "14px", fontWeight: "normal" }} />
      </button>
    </div>
  );
};

<button className="filter-btn">
  Filtrer <FaChevronDown className="filter-icon" />
</button>;

const DashboardBrand: React.FC = () => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar gauche */}
      <SideBarLeft />

      {/* Contenu principal */}
      <main className="dashboard-main">
        {/* <DashboardHeader /> */}
        <section className="dashboard-content">
          <div className="header-container">
            <h1>Signalements</h1>
            <div className="header-stats">
              <div className="stat">
                <span className="negative">🔻 -10% cette semaine</span>
                <div className="stat-number">
                  <span className="icon">
                    <img src={signalIcon} alt="signal comment" />
                  </span>
                  <div className="compteur">1230</div>
                </div>
              </div>
            </div>
          </div>

          {/* Première ligne avec les signalements */}
          <div className="dashboard-row">
            <Signalements />
            <ProblemesSignales />
          </div>

          {/* Autres sections */}
          <div className="dashboard-row">
            <div className="card emotional-experience">
              <ExperienceEmotionnelle />
            </div>
          </div>
          <div className="dashboard-row">
            <div className="card correction-graph">
              <ProblemesCritiques />
            </div>
          </div>
          <div className="dashboard-row">
            <div className="card evolution-signalements">
              <Technologie />
            </div>
          </div>
        </section>
      </main>

      {/* Sidebar droite - 🔥 Elle est revenue ! */}
      <aside className="sidebar-right">
        <DateSelector />

        <div className="card">
          <ResolutionChart />
        </div>
        <div className="card">
          <ResolutionTrends />
        </div>
        <div className="card">
          <SignalTrends />
        </div>
      </aside>
    </div>
  );
};

export default DashboardBrand;

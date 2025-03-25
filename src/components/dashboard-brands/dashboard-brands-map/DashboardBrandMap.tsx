import "./DashboardBrandMap.scss";

import { FaChevronDown } from "react-icons/fa"; // Import de l'icône

// Import des icônes actifs et inactifs

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import Signalements from "./cards/signalements/Signalements";
// import ProblemesSignales from "./cards/problem-signales/ProblemesSignales";
import SideBarLeft from "../aside-bar/SideBarLeft";
import Steps from "./cards/steps/Steps";
import ExperienceLine from "./cards/experienceLine/ExperienceLine";
import EmotionsSection from "./cards/emotionsSection/EmotionsSection";
import SignalSection from "./cards/signalSection/SignalSection";
import CdcSection from "./cards/cdcSection/CdcSection";
import SuggestionSection from "./cards/suggestSection/SuggestionSection";

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

const DashboardBrandMap: React.FC = () => {
  return (
    <div className="dashboard-layout flexColumn">
      {/* Sidebar gauche */}
      <SideBarLeft />
      {/* Contenu principal */}
      <div className="dashboard-map">
        <main className="dashboard-main">
          <section className="dashboard-content">
            <div className="header-container">
              <h2>Map experience</h2>
              <DateSelector />
            </div>

            {/* Première ligne avec les signalements */}
            <div className="dashboard-row mt-20">
              <Steps />
            </div>
            <div>
              <ExperienceLine />
            </div>
            <div>
              <EmotionsSection />
            </div>
            <div>
              <SignalSection />
            </div>
            <div>
              <CdcSection />
            </div>
            <div>
              <SuggestionSection />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardBrandMap;

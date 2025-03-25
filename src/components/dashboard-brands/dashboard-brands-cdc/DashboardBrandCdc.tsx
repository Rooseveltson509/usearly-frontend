import "./DashboardBrandCdc.scss";

import { FaChevronDown } from "react-icons/fa"; // Import de l'icône

// Import des icônes actifs et inactifs

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import Signalements from "./cards/signalements/Signalements";
// import ProblemesSignales from "./cards/problem-signales/ProblemesSignales";
import SideBarLeft from "../aside-bar/SideBarLeft";

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

const DashboardBrandCdc: React.FC = () => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar gauche */}
      <SideBarLeft />
      {/* Contenu principal */}
      <main className="dashboard-main">
        <section className="dashboard-content">
          <div className="header-container"></div>

          {/* Première ligne avec les signalements */}
          <div className="dashboard-row">
            {/* <Signalements />
            <ProblemesSignales /> */}
          </div>
          <div className="dashboard-row">
            <div className="card emotional-experience">
              {/* <UserResponse /> */}
            </div>
          </div>
        </section>
      </main>

      {/* Sidebar droite - 🔥 Elle est revenue ! */}
      <aside className="sidebar-right">
        <DateSelector />

        {/* <div className="card">
          <ResolutionChart />
        </div> */}
      </aside>
    </div>
  );
};

export default DashboardBrandCdc;

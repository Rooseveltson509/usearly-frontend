import "./DashboardBrandWarning.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SideBarLeft from "../aside-bar/SideBarLeft";
import UserResponseCard from "./cards/user-response-card/UserResponseCard";
import heartIcon from "../../../assets/icons/heart-icon.svg";
import ideaIcon from "../../../assets/images/baguette.svg";
import solutionIcon from "../../../assets/icons/solution.svg";
import validIcon from "../../../assets/icons/valid-icon.svg";
import chatIcon from "../../../assets/icons/chat-icon.svg";
import SignalIcon from "../../../assets/icons/signal-icon.svg";
import ReportIcon from "../../../assets/icons/report.svg";
import HeartIcon from "../../../assets/icons/heart.svg";
import SuggestIcon from "../../../assets/icons/suggest.svg";
import DiscussIcon from "../../../assets/icons/discussion-icon.svg";
import ApplauseIcon from "../../../assets/icons/applause-icon.svg";

import avatar1 from "../../../assets/slide1.jpg";
import avatar2 from "../../../assets/slide1.jpg";
import avatar3 from "../../../assets/slide1.jpg";
import ActionCompletedCard from "./cards/action-completed/ActionCompletedCard";
// import { ResolutionChart } from "../dashboard-brands-reports/cards/resolutionChart/ResolutionChart";
import SignalTrends from "../dashboard-brands-reports/cards/signalTrends/SignalTrends";
import ResolutionCard from "./cards/resolutionCard/ResolutionCard";
import Tickets from "./cards/tickets/Tickets";
import ExperienceEmotionnelleSmall from "./cards/experiencesEmotionnelles/ExperienceEmotionnelleSmall";
//import DashboardHeader from "../header/DashboardHeader";

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

const DashboardBrandWarning: React.FC = () => {
  return (
    <div className="dashboard-layout">
      {/* <DashboardHeader /> */}
      {/* Sidebar gauche */}
      <SideBarLeft />

      {/* Contenu principal */}
      <main className="dashboard-main">
        <section className="dashboard-content">
          <div className="header-container"></div>

          <div className="signalTitle">
            <img src={SignalIcon} alt="icone-suggestion" />
            <h2>Nouveaux tickets</h2>
          </div>
          <div className="dashboard-row">
            <Tickets />
          </div>

          <div className="signalTitle">
            <img src={DiscussIcon} alt="logo-discussion" />
            <h2>Répondez à vos utilisateurs</h2>
          </div>
          <div className="dashboard-row flexAround">
            <UserResponseCard
              avatars={[avatar1, avatar2, avatar3]}
              count={2340}
              title="Signalements"
              subtitle="Tickets en attente"
              mainIcon={solutionIcon}
              status={[{ count: 46 }]}
            />

            <UserResponseCard
              avatars={[avatar2, avatar3]}
              count={976}
              title="Votes"
              subtitle="Validez les idées populaires !✨"
              mainIcon={ideaIcon}
              status={[{ count: 3 }]}
            />

            <UserResponseCard
              avatars={[avatar1, avatar3, avatar2]}
              count={223}
              title="Coup de cœur"
              subtitle="Fidélisez vos meilleurs contributeurs 👋"
              mainIcon={heartIcon}
              status={[{ count: 5 }]}
            />
          </div>

          <div className="signalTitle">
            <img src={ApplauseIcon} alt="logo-discussion" />
            <h2>Actions terminées</h2>
          </div>

          <div className="cards-container dashboard-row flexRow">
            <ActionCompletedCard
              icon={validIcon}
              count={78}
              title="Tickets résolus"
              description="(impactant"
              userCount={320}
            />

            <ActionCompletedCard
              icon={ideaIcon}
              count={5}
              title="Nouvelles idées intégrées"
              description="(votées par"
              userCount={120}
            />

            <ActionCompletedCard
              icon={chatIcon}
              count={10}
              title="Réponses marquées utiles"
              description="(aimés par"
              userCount={87}
            />
          </div>
        </section>
      </main>

      {/* Sidebar droite - 🔥 Elle est revenue ! */}
      <aside className="sidebar-right">
        <DateSelector />

        <div className="activity-summary">
          <div className="activity-item">
            <div className="icon">
              <img src={ReportIcon} alt="icone-suggestion" />
            </div>
            <strong>1230</strong>
            <span>Signalement</span>
          </div>
          <div className="activity-item">
            <div className="icon">
              <img src={HeartIcon} alt="icone-suggestion" />
            </div>
            <strong>34</strong>
          </div>
          <div className="activity-item">
            <div className="icon">
              <img src={SuggestIcon} alt="icone-suggestion" />
            </div>
            <strong>20</strong>
          </div>
        </div>

        <div className="card">
          <ResolutionCard />
        </div>

        <div className="card">
          <ExperienceEmotionnelleSmall />
        </div>

        <div className="card">
          <SignalTrends />
        </div>
      </aside>
    </div>
  );
};

export default DashboardBrandWarning;

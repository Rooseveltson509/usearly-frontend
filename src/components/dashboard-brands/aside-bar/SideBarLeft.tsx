import { NavLink, useLocation } from "react-router-dom";
import favicon from "@src/assets/images/logoU2.svg";
import "./SideBarLeft.scss";

import DashboardActive from "../../../assets/icons/dashboard/dashboard-active.svg";
import DashboardInactive from "../../../assets/icons/dashboard/dashboard-inactive.svg";
import SignalActive from "../../../assets/icons/dashboard/signal-active.svg";
import SignalInactive from "../../../assets/icons/dashboard/signal-inactive.svg";
import CoupdecoeurActive from "../../../assets/icons/dashboard/coupdecoeur-active.svg";
import CoupdecoeurInactive from "../../../assets/icons/dashboard/coupdecoeur-inactive.svg";
import SuggestionActive from "../../../assets/icons/dashboard/suggestion-active.svg";
import SuggestionInactive from "../../../assets/icons/dashboard/suggestion.svg";
import ParcoursActive from "../../../assets/icons/dashboard/parcours-active.svg";
import ParcoursInactive from "../../../assets/icons/dashboard/parcours.svg";
import CollaborationActive from "../../../assets/icons/dashboard/collaboration-active.svg";
import CollaborationInactive from "../../../assets/icons/dashboard/collaboration.svg";

const SideBarLeft: React.FC = () => {
  const location = useLocation();

  const activeTab = () => {
    if (location.pathname.includes("/dashboard/parcours")) return "parcours";
    if (location.pathname.includes("/dashboard/signalements")) return "signal";
    if (location.pathname.includes("/dashboard/cdc")) return "coupdecoeur";
    if (location.pathname.includes("/dashboard/suggestions"))
      return "suggestions";
    if (location.pathname.includes("/dashboard/collaboration"))
      return "collaboration";
    return "dashboard"; // Par défaut
  };

  return (
    <aside className="sidebar-left-dash">
      <img src={favicon} alt="Usearly Logo" className="logo" />

      <nav>
        <ul>
          <li className={activeTab() === "dashboard" ? "active" : ""}>
            <NavLink to="/dashboard/warning" className="menu-item">
              <img
                src={
                  activeTab() === "dashboard"
                    ? DashboardActive
                    : DashboardInactive
                }
                alt="Dashboard"
              />
            </NavLink>
          </li>
          <li className={activeTab() === "parcours" ? "active" : ""}>
            <NavLink to="/dashboard/parcours" className="menu-item">
              <img
                src={
                  activeTab() === "parcours" ? ParcoursActive : ParcoursInactive
                }
                alt="parcours"
              />
            </NavLink>
          </li>
          <li className={activeTab() === "signal" ? "active" : ""}>
            <NavLink to="/dashboard/signalements" className="menu-item">
              <img
                src={activeTab() === "signal" ? SignalActive : SignalInactive}
                alt="Signalements"
              />
            </NavLink>
          </li>
          <li className={activeTab() === "coupdecoeur" ? "active" : ""}>
            <NavLink to="/dashboard/cdc" className="menu-item">
              <img
                src={
                  activeTab() === "coupdecoeur"
                    ? CoupdecoeurActive
                    : CoupdecoeurInactive
                }
                alt="Coup de cœur"
              />
            </NavLink>
          </li>
          <li className={activeTab() === "suggestions" ? "active" : ""}>
            <NavLink to="/dashboard/suggestions" className="menu-item">
              <img
                src={
                  activeTab() === "suggestions"
                    ? SuggestionActive
                    : SuggestionInactive
                }
                alt="suggestions"
              />
            </NavLink>
          </li>
          <li className={activeTab() === "collaboration" ? "active" : ""}>
            <NavLink to="/dashboard/collaboration" className="menu-item">
              <img
                src={
                  activeTab() === "collaboration"
                    ? CollaborationActive
                    : CollaborationInactive
                }
                alt="collaboration"
              />
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBarLeft;

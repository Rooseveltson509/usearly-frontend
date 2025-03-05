import React, { useEffect } from "react";
import "./Dashboard.scss"; // Ajoutez des styles si nécessaire
import RightSidebar from "../sidebarRight/RightSidebar";
import LeftSidebar from "../sidebarLeft/LeftSidebar";
import MainContent from "../mainContent/MainContent";

interface DashboardProps {
  userProfile: {
    avatar: string | undefined; // Permettre que avatar soit undefined
    pseudo: string;
  };
}

const Dashboard: React.FC<DashboardProps> = () => {
  // Modification : Ajoute la classe "dashboard-page" au body lorsque le Dashboard est monté
  useEffect(() => {
    document.body.classList.add("dashboard-page");

    // Modification : Supprime la classe "dashboard-page" du body lorsque le composant est démonté
    return () => {
      document.body.classList.remove("dashboard-page");
    };
  }, []);
  return (
    <div className="app-layout container" id="sidebar-left">
      <div className="sidebar-left">
        <LeftSidebar />
      </div>
      <MainContent />
      <div className="sidebar-right" id="sidebar-right">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;

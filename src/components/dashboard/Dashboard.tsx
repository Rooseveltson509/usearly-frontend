import React from "react";
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
  return (
    <div className="app-layout container">
      <div className="sidebar-left">
        <LeftSidebar />
      </div>
        <MainContent />
      <div className="sidebar-right">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;

import React from "react";
import { useAuth } from "@src/contexts/AuthContext";

const DashboardHeader: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <span className="user-name">
          Hello {userProfile?.name || "Brand"} ▼
        </span>
      </div>
      <div className="header-right">
        <button className="btn-new-user">New user +</button>
        <i className="icon-bell" />
        <i className="icon-search" />
        <img src="avatar.png" alt="User" className="user-avatar" />
      </div>
    </header>
  );
};

export default DashboardHeader;

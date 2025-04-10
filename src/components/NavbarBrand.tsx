import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoUsearly from "../assets/images/logo-usearly.svg";
import "./Navbar.scss";

const NavbarBrand: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserMenuOpen(prev => !prev);
  };
console.log("marque...... : ", userProfile);
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-logo">
          <img src={logoUsearly} alt="Usearly Logo" />
        </div>
        <ul className="navbar-links">
          <li>
            <NavLink to="/brand-dash" className="navbar-link">
              Tableau de bord
            </NavLink>
          </li>
          <li>
            <NavLink to="/brand-reports" className="navbar-link">
              Signalements
            </NavLink>
          </li>
          <li>
            <NavLink to="/brand-statistics" className="navbar-link">
              Statistiques
            </NavLink>
          </li>
          <li>
            <NavLink to="/brand-rewards" className="navbar-link">
              Récompenses
            </NavLink>
          </li>

          {/* Menu utilisateur */}
          <div className="user-dropdown">
            <li>
              <div
                className={`user-dropdown ${userMenuOpen ? "open" : ""}`}
                onClick={toggleUserMenu}
              >
                <span className="user-icon">
                  <i className="far fa-user"></i>
                </span>
                <span className="user-name">Bonjour {userProfile?.name || "Marque"}</span>
                <span className="dropdown-icon">
                  <i className="fa fa-chevron-down"></i>
                </span>
              </div>
            </li>
            {userMenuOpen && (
              <div className="dropdown-menu">
                <NavLink to="/brand-profile" className="menu-item">
                  Mon profil
                </NavLink>
                <button className="menu-item" onClick={logout}>
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarBrand;

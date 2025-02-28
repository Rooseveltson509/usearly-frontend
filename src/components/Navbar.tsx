import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom"; // On utilise NavLink pour active class
import "./Navbar.scss";
import { useAuth } from "../contexts/AuthContext";
import logoUsearly from "../assets/images/logo-usearly.svg";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, userProfile, isLoadingProfile } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  //const location = useLocation(); // Permet de récupérer le chemin actuel

  const toggleNavbar = () => setNavbarOpen((prev) => !prev);
  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isSticky ? "sticky" : ""}`}>
      <div className="container">
        <div className="navbar-logo">
          <img src={logoUsearly} alt="Usearly Logo" />
        </div>
        <button className="navbar-toggle" onClick={toggleNavbar}>
          ☰
        </button>
        <ul className={`navbar-links ${navbarOpen ? "open" : ""}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setNavbarOpen(false)}
            >
              Accueil
            </NavLink>
          </li>
          {userProfile?.role === "admin" && (
            <li>
              <NavLink
                to="/admin/brands"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
                onClick={() => setNavbarOpen(false)}
              >
                Marques partenaires
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/collaboration"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setNavbarOpen(false)}
            >
              Qui sommes-nous ?
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setNavbarOpen(false)}
            >
              Impact
            </NavLink>
          </li>

          {isAuthenticated ? (
            isLoadingProfile ? (
              <li className="navbar-link">
                <span>Chargement...</span>
              </li>
            ) : (
              <div className="user-dropdown">
                <li>
                  <div
                    className={`user-dropdown ${userMenuOpen ? "open" : ""}`}
                    onClick={toggleUserMenu}
                  >
                    <span className="user-icon">
                      <i className="far fa-user"></i>
                    </span>
                    <span className="user-name">
                      Bonjour {userProfile?.pseudo || "Utilisateur"}
                    </span>
                    <span className="dropdown-icon">
                      <i className="fa fa-chevron-down"></i>
                    </span>
                  </div>
                </li>
                {userMenuOpen && (
                  <div ref={dropdownRef} className="dropdown-menu">
                    <NavLink
                      to="/profile"
                      className="menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mon profil
                    </NavLink>
                    <NavLink
                      to="/my-account"
                      className="menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mon compte
                    </NavLink>
                    <button className="menu-item" onClick={logout}>
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            )
          ) : (
            <>
              <div className="user-dropdown">
                <li>
                  <div
                    className={`user-dropdown ${userMenuOpen ? "open" : ""}`}
                    onClick={toggleUserMenu}
                  >
                    <span className="user-icon">
                      <i className="far fa-user"></i> S'identifier
                    </span>
                    <span className="dropdown-icon">
                      <i className="fa fa-chevron-down"></i>
                    </span>
                  </div>
                </li>
                {userMenuOpen && (
                  <div ref={dropdownRef} className="dropdown-menu">
                    <NavLink
                      to="/login"
                      className="menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Se connecter
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      S'inscrire
                    </NavLink>
                  </div>
                )}
              </div>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
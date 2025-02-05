import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import "./Navbar.scss";
import { useAuth } from "../contexts/AuthContext";
import logoUsearly from "../assets/images/logo-usearly.svg";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, userProfile, isLoadingProfile } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); // Permet de récupérer le chemin actuel

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
            <Link
              to="/"
              className={`navbar-link ${
                location.pathname === "/" ? "active" : ""
              }`}
              onClick={() => setNavbarOpen(false)}
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              to="/marques"
              className={`navbar-link ${
                location.pathname === "/marques" ? "active" : ""
              }`}
              onClick={() => setNavbarOpen(false)}
            >
              Marques partenaires
            </Link>
          </li>
          <li>
            <Link
              to="/collaboration"
              className={`navbar-link ${
                location.pathname === "/collaboration" ? "active" : ""
              }`}
              onClick={() => setNavbarOpen(false)}
            >
              Qui sommes-nous ?
            </Link>
          </li>
          <li>
            <Link
              to="/home"
              className={`navbar-link ${
                location.pathname === "/home" ? "active" : ""
              }`}
              onClick={() => setNavbarOpen(false)}
            >
              Impact
            </Link>
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
                    <Link
                      to="/profile"
                      className="menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <Link
                      to="/my-account"
                      className="menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mon compte
                    </Link>
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
                    <Link
                      to="/login"
                      className="menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/signup"
                      className="menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      S'inscrire
                    </Link>
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
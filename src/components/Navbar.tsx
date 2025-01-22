import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import { useAuth } from "../contexts/AuthContext";
import logoUsearly from "../assets/images/logo-usearly.svg";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, userProfile, isLoadingProfile } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false); // État pour la navbar
  const [userMenuOpen, setUserMenuOpen] = useState(false); // État pour le menu utilisateur
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleNavbar = () => {
    setNavbarOpen((prev) => !prev);
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche le clic de se propager
    setUserMenuOpen((prev) => !prev);
  };

  const closeUserMenu = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setUserMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Ajoute la classe `sticky` si l'utilisateur fait défiler vers le bas
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", closeUserMenu);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", closeUserMenu);
    };
  }, []);

  return (
    <nav className={`navbar ${isSticky ? "sticky" : ""}`}>
      <div className="container">
        <div className="navbar-logo">
          <span className="logo-icon"> <img src={logoUsearly} alt={logoUsearly} /></span>
        </div>
        <button className="navbar-toggle" onClick={toggleNavbar}>
          ☰
        </button>
        <ul className={`navbar-links ${navbarOpen ? "open" : ""}`}>
          <li>
            <Link to="/" className="navbar-link" onClick={() => setNavbarOpen(false)}>
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/marques" className="navbar-link" onClick={() => setNavbarOpen(false)}>
              Marques partenaires
            </Link>
          </li>
          <li>
            <Link to="/collaboration" className="navbar-link" onClick={() => setNavbarOpen(false)}>
              Qui sommes-nous ?
            </Link>
          </li>
          <li>
            <Link to="/home" className="navbar-link" onClick={() => setNavbarOpen(false)}>
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
                  <div className={`user-dropdown ${userMenuOpen ? "open" : ""}`} onClick={toggleUserMenu}>
                    <span className="user-icon"><i className="far  fa-light fa-user"></i></span> {/* Icône utilisateur */}
                    <span className="user-name">Bonjour {userProfile?.pseudo || "Utilisateur"}</span>
                    <span className="dropdown-icon">▼</span> {/* Chevron */}
                  </div>

                </li>
                {userMenuOpen && (
                  <div ref={dropdownRef} className="dropdown-menu">
                    <Link to="/profile" className="menu-item" onClick={() => setUserMenuOpen(false)}>
                      Mon profil
                    </Link>
                    <Link to="/my-account" className="menu-item" onClick={() => setUserMenuOpen(false)}>
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
              <li>
                <Link to="/login" className="navbar-link" onClick={() => setNavbarOpen(false)}>
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/signup" className="navbar-link" onClick={() => setNavbarOpen(false)}>
                  Inscription
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
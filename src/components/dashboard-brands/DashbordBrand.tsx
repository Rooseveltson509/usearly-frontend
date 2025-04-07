import { useState } from "react";
import signalIcon from "../../assets/images/signal.svg";
import "./DashboardBrand.scss";
import ProblemesSignales from "../problemSignale/ProblemesSignales";
import ExperienceEmotionnelle from "../experiencesEmotionnelles/ExperienceEmotionnelle";
import ProblemesCritiques from "../problemesCritiques/ProblemesCritiques";
import Technologie from "../technologie/Technologie";
import { useAuth } from "@src/contexts/AuthContext";

const DashboardBrand: React.FC = () => {
  const { userProfile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Panier");
  const [selectedEmoji, setSelectedEmoji] = useState({
    emoji: "😔",
    name: "Blasé",
    count: 56,
  });

  const categories = ["Panier", "Service client", "Affichage", "Paiement"];
  const emojis = [
    { emoji: "😀", name: "Joyeux", count: 34 },
    { emoji: "😡", name: "Fâché", count: 21 },
    { emoji: "😔", name: "Blasé", count: 56 },
    { emoji: "😢", name: "Triste", count: 15 },
  ];

  const comments = [
    "Je suis saoulé. Je ne sais pas quoi faire. Je vais devoir aller ailleurs.",
    "Le service client est vraiment lent.",
    "L'affichage bug sur mon téléphone.",
    "Impossible d'ajouter un produit au panier.",
  ];

  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  const goToNextComment = () => {
    setCurrentCommentIndex(prevIndex => (prevIndex === comments.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevComment = () => {
    setCurrentCommentIndex(prevIndex => (prevIndex === 0 ? comments.length - 1 : prevIndex - 1));
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar gauche */}
      <aside className="sidebar-left">
        <div className="logo">U.</div>
        <nav>
          <ul>
            <li className="active">🏠 Dashboard</li>
            <li>📊 Analytics</li>
            <li>⚙️ Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <span className="user-name"> Hello {userProfile?.name || "Brand"} ▼</span>
          </div>
          <div className="header-right">
            <button className="btn-new-user">New user +</button>
            <i className="icon-bell" />
            <i className="icon-search" />
            <img src="avatar.png" alt="User" className="user-avatar" />
          </div>
        </header>

        <section className="dashboard-content">
          <span className="negative">🔻 -10% cette semaine</span>
          <div className="header-container">
            <h1>Signalements</h1>
            <div className="header-stats">
              <div className="stat">
                <div className="stat-number">
                  <span className="icon">
                    <img src={signalIcon} alt="signal comment" />
                  </span>
                  <h2>1230</h2>
                </div>
              </div>
              <div className="date-filter">
                <button className="btn-filter">
                  <span className="prev"></span>
                  30 derniers jours
                  <span className="next"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Première ligne avec deux cartes */}
          <div className="dashboard-row">
            <div className="signalements-card">
              <div className="signalements-header">
                <span className="icon">🔔</span>
                <h2>
                  Signalements <span>(1230)</span>
                </h2>
                <button className="filter-btn">Filtrer ⌄</button>
              </div>

              <div className="signalements-filters">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedEmoji.name}
                  onChange={e => {
                    const selected = emojis.find(emoji => emoji.name === e.target.value);
                    if (selected) setSelectedEmoji(selected);
                  }}
                >
                  {emojis.map(emoji => (
                    <option key={emoji.name} value={emoji.name}>
                      {emoji.emoji} {emoji.name} ({emoji.count})
                    </option>
                  ))}
                </select>
              </div>

              <div className="signalements-carousel">
                <p>{comments[currentCommentIndex]}</p>
                <div className="carousel-controls">
                  <button onClick={goToPrevComment}>{"<"}</button>
                  <button onClick={goToNextComment}>{">"}</button>
                </div>
              </div>
            </div>
            <ProblemesSignales />
          </div>

          {/* Deuxième ligne avec trois cartes */}

          <div className="dashboard-row">
            <div className="card emotional-experience">
              <ExperienceEmotionnelle />
            </div>
          </div>
          <div className="dashboard-row">
            <div className="card correction-graph">
              <ProblemesCritiques />
            </div>
          </div>
          <div className="dashboard-row">
            <div className="card evolution-signalements">
              <Technologie />
            </div>
          </div>
        </section>
      </main>

      {/* Sidebar droite */}
      <aside className="sidebar-right">
        <div className="card">
          <h3>Tickets résolus</h3>
          <p>50</p>
          <p>Temps moyen de résolution</p>
          <p>Taux de résolution</p>
        </div>
        <div className="card">
          <h3>Correction des problèmes</h3>
          <p>Graphique ici</p>
          <p>Vous êtes 5% au-dessus de la moyenne du secteur.</p>
        </div>
        <div className="card">
          <h3>Évolution des signalements</h3>
          <p>Graphique ici</p>
        </div>
      </aside>
    </div>
  );
};

export default DashboardBrand;

import { useState } from "react";
import "./ProblemesCritiques.scss";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const ProblemesCritiques = () => {
  const [hoveredVerbatim, setHoveredVerbatim] = useState<number | null>(null); // ✅ Correction ici
  const [tooltipPosition, setTooltipPosition] = useState<string>("top"); // Etat pour la position du tooltip

  const data = [
    {
      id: 1,
      issue: "Validation bancaire bloquée",
      signal: 129,
      impact: "😡 60%",
      verbatim: "Le site bug pendant le paiement.",
    },
    {
      id: 2,
      issue: "Recherche imprécise",
      signal: 29,
      impact: "😕 50%",
      verbatim: "Impossible de trouver ce que je cherche.",
    },
    {
      id: 3,
      issue: "Retards de livraison",
      signal: 17,
      impact: "😟 40%",
      verbatim: "Livraison arrivée plus tard que prévu.",
    },
    {
      id: 4,
      issue: "Problème d'affichage produit",
      signal: 12,
      impact: "😖 30%",
      verbatim:
        "Les images ne chargent pas correctement. J'en ai assez car cela devient récurrent et je trouve que ce n'est pas normal.",
    },
    {
      id: 5,
      issue: "Erreur de prix affiché",
      signal: 9,
      impact: "🤨 25%",
      verbatim: "Le montant affiché est incorrect.",
    },
    {
      id: 6,
      issue: "Mauvaise gestion du stock",
      signal: 7,
      impact: "😤 20%",
      verbatim: "Produit marqué disponible mais en rupture.",
    },
  ];

  // Calculer la position du tooltip en fonction de l'espace
  const handleMouseEnter = (id: number) => {
    setHoveredVerbatim(id);
    const element = document.getElementById(`verbatim-${id}`);
    if (element) {
      const rect = element.getBoundingClientRect();
      // Si le tooltip dépasse le bas de l'écran, on le place en haut
      if (window.innerHeight - rect.bottom < 100) {
        setTooltipPosition("bottom");
      } else {
        setTooltipPosition("top");
      }
    }
  };

  return (
    <div className="problemes-critiques">
      <button className="card-btn">
        <FiChevronRight className="card-btn-icon" />
      </button>
      <button className="filter-btn">
        Filtrer <FiChevronDown className="filter-icon" />
      </button>
      <div className="header">
        <h2>Problèmes critiques & impact 🔥</h2>
      </div>

      <p className="subtitle">
        Les signalements critiques ont diminué de{" "}
        <span className="highlight">10%</span> par rapport à la semaine
        dernière.
      </p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Problème</th>
              <th className="center">Signals</th>
              <th className="center">Impact émotionnel</th>
              <th>Verbatim</th>
              <th className="center">Détails</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td className="problemes">
                  <span
                    className={`dot ${row.id % 2 === 0 ? "red" : "orange"}`}
                  ></span>{" "}
                  {row.issue}
                </td>
                <td className="signals">{row.signal}</td>
                <td className="impact">
                  <span className="emoji">{row.impact.split(" ")[0]}</span>{" "}
                  {row.impact.split(" ")[1]}
                </td>
                <td
                  id={`verbatim-${row.id}`} // Assure une identification unique de chaque cellule
                  className="verbatim-cell"
                  onMouseEnter={() => handleMouseEnter(row.id)}
                  onMouseLeave={() => setHoveredVerbatim(null)}
                >
                  <span className="verbatim">
                    <span className="verbatim-icon">💬</span>
                    {row.verbatim.length > 40 ? (
                      <>
                        <span className="quote">"</span>
                        {row.verbatim.substring(0, 40)}...
                        <span className="quote">"</span>
                        {hoveredVerbatim === row.id && (
                          <span
                            className={`tooltip ${tooltipPosition}`} // Applique la position dynamique
                          >
                            {row.verbatim}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="quote">"</span>
                        {row.verbatim}
                        <span className="quote">"</span>
                      </>
                    )}
                  </span>
                </td>

                <td className="details">
                  <span className="details-icon">🔍</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemesCritiques;

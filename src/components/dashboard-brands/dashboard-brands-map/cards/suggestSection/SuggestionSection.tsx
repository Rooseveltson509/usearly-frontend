import React, { useState } from "react";
import "./SuggestionSection.scss";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import starIcon from "@src/assets/icons/dashboard/suggestion.svg";
// Icône de pouce pour les likes
import likeIcon from "@src/assets/icons/like-icon.svg";
import { FiChevronRight } from "react-icons/fi";

type SuggestionItem = {
  value: number;
  plusOne?: boolean;
  suggestions: {
    text: string;
    likes?: number;
  }[];
};
type OpportunityItem = {
  title: string;
  subtitle: string;
};

/** Données d’exemple */
const suggestionData: SuggestionItem[] = [
  {
    value: 1,
    suggestions: [
      {
        text: "Ajouter le filtre “Lorem Ipsum” dans la catégorie voyage",
        likes: 17,
      },
    ],
  },
  {
    value: 4,
    suggestions: [
      { text: "Ajouter des avis certifiés", likes: 91 },
      { text: "Informer des conditions de retour", likes: 47 },
      { text: "Informer de retour", likes: 147 },
      { text: "Informer de retour", likes: 147 },
      { text: "Ajouter des...", likes: 38 },
      { text: "Ajouter des...", likes: 38 },
    ],
  },
  {
    value: 0,
    suggestions: [],
  },
  {
    value: 1,
    suggestions: [
      {
        text: "Rendre possible l’enregistrement de la carte bleue sur mobile",
        likes: 92,
      },
    ],
  },
  {
    value: 0,
    suggestions: [],
  },
  {
    value: 1,
    plusOne: true,
    suggestions: [
      { text: "Retour des produits en point relais", likes: 2 },
      { text: "Échange sous 30 jours", likes: 16 },
    ],
  },
  {
    value: 2,
    suggestions: [
      { text: "Numéro de téléphone plus visible", likes: 79 },
      { text: "Pouvoir contacter directement le service client", likes: 5 },
    ],
  },
];

// Données opportunités (ligne rose)
const opportunitiesData: OpportunityItem[] = [
  {
    title: "Menu",
    subtitle: "Réduire le nombre de catégories",
  },
  {
    title: "Filtres",
    subtitle: "Ajouter de nouveaux filtres",
  },
  {
    title: "Lorem ipsum",
    subtitle: "Réduire le nombre de catégories",
  },
  {
    title: "Lorem ipsum",
    subtitle: "Réduire le nombre de catégories",
  },
  {
    title: "Lorem ipsum",
    subtitle: "Réduire le nombre de catégories",
  },
  {
    title: "Lorem ipsum",
    subtitle:
      "Réduire le nombre de catégories, Réduire le nombre de catégories",
  },
  {
    title: "Lorem ipsum",
    subtitle: "Réduire le nombre de catégories",
  },
  // etc.
];

const SuggestionSection: React.FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="suggestion-section">
      {/* Titre vertical à gauche */}
      <div className="titles-bar">
        <div>
          <span className="title-icon">
            <img src={starIcon} alt="icon" />
          </span>
        </div>
        <div className="title-name">
          {open && <span className="title-vertical">Suggestions</span>}
          {open && <span className="title-vertical">Opportunités</span>}
        </div>
      </div>

      <div className="suggestions-main">
        {/* TOP BAR + TOGGLE */}
        <div className="suggestions-header">
          <div className="top-bar">
            {suggestionData.map((item, i) => (
              <div className="value-block" key={i}>
                {!item.plusOne && <span className="value">{item.value}</span>}
                {item.plusOne && (
                  <span className="value plus-one">{item.value} +1</span>
                )}
              </div>
            ))}
          </div>
          <button className="toggle-btn" onClick={() => setOpen(!open)}>
            {open ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        {/* PARTIE SUGGESTIONS (ligne du haut) */}
        {open && (
          <div className="details-row">
            {/* Boites "blanches" */}
            {suggestionData.map((item, i) => (
              <div className="suggestion-box" key={i}>
                {item.suggestions.map((sugg, idx) => (
                  <div className="suggestion-line" key={idx}>
                    {sugg.likes != null && (
                      <span className="like-icon">
                        <img src={likeIcon} alt="like" />
                        {sugg.likes}
                      </span>
                    )}
                    {sugg.text}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* PARTIE OPPORTUNITÉS (ligne du bas) */}
        {open && (
          <div className="opportunities-row">
            {/* Titre vertical à gauche */}
            {/* <div className="opportunities-cards"> */}
            {opportunitiesData.map((opp, i) => (
              <div className="opportunity-card" key={i}>
                <div className="description">
                  <div className="title">{opp.title}</div>
                  <div className="subtitle">
                    <span>{opp.subtitle}</span>
                    <span>
                      <FiChevronRight />
                    </span>
                  </div>
                </div>
                <span className="more-dots">⋯</span>
              </div>
            ))}
            {/* </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionSection;

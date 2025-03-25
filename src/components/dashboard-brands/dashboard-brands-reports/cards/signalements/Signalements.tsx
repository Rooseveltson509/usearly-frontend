import React, { useState } from "react";
import "./Signalements.scss";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import signalHeaderIcon from "../../../../../assets/icons/signal.svg";

const Signalements: React.FC = () => {
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
    setCurrentCommentIndex((prevIndex) =>
      prevIndex === comments.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevComment = () => {
    setCurrentCommentIndex((prevIndex) =>
      prevIndex === 0 ? comments.length - 1 : prevIndex - 1
    );
  };
  return (
    <div className="signalements-card">
      <div className="signalements-header">
        <div className="title-container">
          <span className="icon">
            <img
              src={signalHeaderIcon}
              alt="Signal Icon"
              className="signal-icon"
            />
          </span>
          <h2>
            Signalements <span>(1230)</span>
          </h2>
        </div>
        <button className="filter-btn">
          Filtrer <FiChevronDown className="filter-icon" />
        </button>
      </div>

      <div className="signalements-filters">
        <div className="custom-select">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <FiChevronDown className="custom-select-icon" />
        </div>

        <div className="custom-select">
          <select
            value={selectedEmoji.name}
            onChange={(e) => {
              const selected = emojis.find(
                (emoji) => emoji.name === e.target.value
              );
              if (selected) setSelectedEmoji(selected);
            }}
          >
            {emojis.map((emoji) => (
              <option key={emoji.name} value={emoji.name}>
                {emoji.emoji} {emoji.name} ({emoji.count})
              </option>
            ))}
          </select>
          <FiChevronDown className="custom-select-icon" />
        </div>
      </div>

      <div className="signalements-carousel-container">
        {/* Boîte grise contenant le texte du signalement */}
        <div className="signalements-carousel">
          <p>{comments[currentCommentIndex]}</p>
        </div>

        {/* Boutons de navigation placés sous la boîte grise */}
        <div className="carousel-controls">
          <button onClick={goToPrevComment} className="carousel-btn">
            <FiChevronLeft className="carousel-icon" />
          </button>
          <button onClick={goToNextComment} className="carousel-btn">
            <FiChevronRight className="carousel-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signalements;

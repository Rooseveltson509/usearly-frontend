import { useState } from "react";
import "./EmotionsSection.scss";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";

type EmotionItem = {
  emoji: string;
  count: number;
  label: string;
  textList: string[];
};

const data: EmotionItem[] = [
  {
    emoji: "😒",
    count: 24,
    label: "Blasé",
    textList: [
      "Je suis saoulée. Je ne sais pas quoi faire. Je vais devoir aller ailleurs.",
      "Je ne sais pas si c'est un bug, mais c'est frustrant...",
      "Je suis obligée de recommencer toute la procédure... c'est pénible. Je suis obligée de recommencer toute la procédure... c'est pénible.",
    ],
  },
  {
    emoji: "👏",
    count: 7,
    label: "Applaudissement",
    textList: [
      "Le Lorem Ipsum est simplement du faux texte employé dans la...",
      "Je ne sais pas si c'est un bug, mais c'est frustrant...",
      "Je suis obligée de recommencer toute la procédure... c'est pénible. Je suis obligée de recommencer toute la procédure... c'est pénible.",
    ],
  },
  {
    emoji: "😡",
    count: 14,
    label: "Ennervé",
    textList: [
      "J'aurais espéré un message d'erreur, au moins voir une animation...",
      "Je ne sais pas si c'est un bug, mais c'est frustrant...",
      "Je suis obligée de recommencer toute la procédure... c'est pénible. Je suis obligée de recommencer toute la procédure... c'est pénible.",
    ],
  },
  {
    emoji: "😖",
    count: 19,
    label: "Frustré",
    textList: [
      "Je ne sais pas si c'est un bug mais c'est mal foutu...",
      "Je ne sais pas si c'est un bug, mais c'est frustrant...",
      "Je suis obligée de recommencer toute la procédure... c'est pénible. Je suis obligée de recommencer toute la procédure... c'est pénible.",
    ],
  },
  {
    emoji: "😒",
    count: 35,
    label: "Blasé",
    textList: [
      "Le Lorem Ipsum est simplement du faux texte employé...",
      "Je ne sais pas si c'est un bug, mais c'est frustrant...",
      "Je suis obligée de recommencer toute la procédure... c'est pénible. Je suis obligée de recommencer toute la procédure... c'est pénible.",
    ],
  },
  {
    emoji: "🥵",
    count: 10,
    label: "Épuisé",
    textList: [
      "Le Lorem Ipsum est simplement du faux texte employé...",
      "Je ne sais pas si c'est un bug, mais c'est frustrant...",
      "Je suis obligée de recommencer toute la procédure... c'est pénible. Je suis obligée de recommencer toute la procédure... c'est pénible.",
    ],
  },
  {
    emoji: "😤",
    count: 12,
    label: "Agacé",
    textList: [
      "Le Lorem Ipsum est simplement du faux texte employé...",
      "Je ne sais pas si c'est un bug, mais c'est frustrant...",
      "Je suis obligée de recommencer toute la procédure... c'est pénible. Je suis obligée de recommencer toute la procédure... c'est pénible.",
    ],
  },
];

const EmotionsSection: React.FC = () => {
  const [textIndexes, setTextIndexes] = useState<number[]>(
    Array(data.length).fill(0)
  );

  const handlePrev = (i: number) => {
    setTextIndexes((prev) => {
      const copy = [...prev];
      copy[i] = Math.max(0, copy[i] - 1);
      return copy;
    });
  };

  const handleNext = (i: number) => {
    setTextIndexes((prev) => {
      const copy = [...prev];
      const max = data[i].textList.length - 1;
      copy[i] = Math.min(max, copy[i] + 1);
      return copy;
    });
  };

  return (
    <div className="emotions-section">
      <div className="titles-bar">
        <div>
          <span className="title-emotions">Emotions</span>
        </div>
        <span className="title-ressentis">Ressentis</span>
      </div>

      <div className="cards-row">
        {data.map((item, i) => (
          <div className="emotion-card" key={i}>
            <div>
              <div className="emoji-container">
                <div className="emoji-position">
                  <span className="emoji">{item.emoji}</span>
                </div>
                <span className="count">{item.count}</span>
              </div>
              <div className="label">
                {item.label} <span className="arrow">▼</span>
              </div>
            </div>

            <div>
              <p className="text">{item.textList[textIndexes[i]]}</p>
              <div className="nav-arrows">
                <button onClick={() => handlePrev(i)}>
                  <FiChevronLeft />
                </button>
                <button onClick={() => handleNext(i)}>
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionsSection;

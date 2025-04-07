import React from "react";
import "./MainTopBar.scss";

interface MainTopBarProps {
  /** Couleur de fond de la barre */
  backgroundColor: string;
  /** URL ou chemin local de l'image à afficher */
  imageSrc: string;
}

const MainTopBar: React.FC<MainTopBarProps> = ({
  backgroundColor,
  imageSrc,
}) => {
  return (
    <div className="main-top-bar" style={{ backgroundColor }}>
      {/* Illustration ou icône à gauche */}
      <img className="main-top-bar__image" src={imageSrc} alt="Top bar icon" />
    </div>
  );
};

export default MainTopBar;

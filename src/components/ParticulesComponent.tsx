import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticulesComponent: React.FC = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine); // Charge tous les modules nécessaires
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "500px", // Taille du conteneur
        height: "500px",
        margin: "0 auto",
      }}
    >
      {/* SVG du "U" */}
      <svg
        className="u-shape-svg"
        viewBox="0 0 770 645"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="u-clip-path">
            <path d="M384.38 4C384.38 1.79086 386.17 0 388.38 0H533.635C535.844 0 537.635 1.79086 537.635 4V410.229C537.635 457.638 526.363 498.941 503.82 534.136C481.276 569.124 449.839 596.245 409.508 615.498C369.178 634.545 322.333 644.068 268.973 644.068C214.992 644.068 167.836 634.545 127.506 615.498C87.1757 596.245 55.8421 569.124 33.5052 534.136C11.1684 498.941 0 457.638 0 410.229V4C0 1.79086 1.79086 0 4 0H149.566C151.775 0 153.566 1.79086 153.566 4V396.875C153.566 418.82 158.323 438.385 167.836 455.568C177.557 472.752 191.104 486.208 208.477 495.939C225.85 505.669 246.015 510.534 268.973 510.534C291.93 510.534 311.992 505.669 329.158 495.939C346.531 486.208 360.078 472.752 369.799 455.568C379.519 438.385 384.38 418.82 384.38 396.875V4Z" />
            <path d="M689.339 645C667.002 645 647.871 637.133 631.946 621.399C616.227 605.664 608.472 586.618 608.678 564.259C608.472 542.313 616.227 523.577 631.946 508.05C647.871 492.316 667.002 484.449 689.339 484.449C710.435 484.449 729.049 492.316 745.181 508.05C761.52 523.577 769.793 542.313 770 564.259C769.793 579.165 765.864 592.725 758.211 604.94C750.766 617.155 740.941 626.885 728.739 634.131C716.743 641.377 703.61 645 689.339 645Z" />
          </clipPath>
        </defs>

        {/* Affichage du U. */}
        <rect
          className="u-rect"
          width="770"
          height="645"
          clipPath="url(#u-clip-path)"
          fill="#A6087E"
        />
      </svg>

      {/* Particules */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: false, // Désactiver le plein écran
          },
          background: {
            color: {
              value: "transparent",
            },
          },
          particles: {
            number: {
              value: 50,
            },
            shape: {
              type: "char", // Utiliser des emojis
              character: {
                value: ["😊", "🥰"], // Liste des emojis
                font: "Verdana",
              },
            },
            size: {
              value: 10,
              random: true,
            },
            move: {
              enable: true,
              speed: 2,
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onHover: {
                enable: true,
                mode: "grab", // Relie les particules au survol
              },
            },
          },
        }}
        style={{
          position: "absolute",
          insetBlockStart: 0,
          left: 0,
          width: "100%",
          height: "100%",
          clipPath: "url(#u-clip-path)", // Limiter les particules au contour
        }}
      />
    </div>
  );
};

export default ParticulesComponent;

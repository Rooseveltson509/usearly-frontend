//import { particlesJS } from 'particles.js';
declare const particlesJS: any;

export const initParticles = () => {
  // Charger la configuration des particules
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 50, // Nombre de particules
        density: {
          enable: true,
          value_area: 800, // Zone de densité
        },
      },
      color: {
        value: "#8e008e", // Couleur des particules
      },
      shape: {
        type: "circle", // Forme des particules
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
      },
      opacity: {
        value: 0.5, // Opacité des particules
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3, // Taille des particules
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true, // Activer les lignes entre les particules
        distance: 150,
        color: "#8e008e", // Couleur des lignes
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true, // Activer le mouvement des particules
        speed: 6, // Vitesse du mouvement
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true, // Réaction au survol
          mode: "repulse", // Mode de réaction
        },
        onclick: {
          enable: true, // Réaction au clic
          mode: "push", // Ajouter des particules au clic
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true, // Support Retina
  });
};

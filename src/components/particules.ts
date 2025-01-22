//import { particlesJS } from 'particles.js';
declare const particlesJS: any;

export const initParticles = () => {
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      shape: {
        type: "char", // Indique que vous utilisez des caractères
        character: {
          value: ["✨", "💖", "🌟", "🔥", "🎉"], // Les émojis que vous voulez afficher
          font: "Arial", // Police utilisée pour les caractères (inutile pour les émojis)
          style: "normal",
          weight: "400",
        },
      },
      opacity: {
        value: 1, // Opacité totale
        random: false,
      },
      size: {
        value: 20, // Taille des émojis
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 10,
          sync: false,
        },
      },
      line_linked: {
        enable: false, // Désactiver les lignes pour mieux voir les émojis
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab", // Les particules interagiront à l'hover
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 200,
          line_linked: {
            opacity: 1,
          },
        },
        push: {
          particles_nb: 4,
        },
      },
    },
    retina_detect: true,
  });
};

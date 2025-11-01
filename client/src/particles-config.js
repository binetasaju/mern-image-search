// client/src/particles-config.js

const particlesConfig = {
  particles: {
    number: {
      value: 80, // Number of particles
      density: {
        enable: true,
      },
    },
    color: {
      value: '#888888', // Particle color (doodle-like gray)
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: 0.5,
      random: false,
    },
    size: {
      value: 3, // Particle size
      random: true,
    },
    links: {
      // The "doodle" connecting lines
      enable: true,
      distance: 150,
      color: '#888888',
      opacity: 0.4,
      width: 1,
    },
    move: {
      // The "self-moving" part
      enable: true,
      speed: 2, // Movement speed
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
    },
  },
  interactivity: {
    // The "hover" interaction
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse', // Pushes particles away on hover
      },
      onclick: {
        enable: true,
        mode: 'push', // Adds new particles on click
      },
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
    },
  },
  retina_detect: true,
};

export default particlesConfig;
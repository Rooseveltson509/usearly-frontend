import React, { useEffect } from 'react';
import { initParticles } from './particules'; // Assurez-vous que ce chemin est correct

const ParticlesBackground: React.FC = () => {
  useEffect(() => {
    initParticles();
  }, []);
  return <div id="particles-js" className="particles-mask"/>;
  //return <div id="particles-js" style={{ position: 'absolute', width: '100%', height: '100%' }} />;
};

export default ParticlesBackground;

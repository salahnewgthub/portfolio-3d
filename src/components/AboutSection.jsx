import React from 'react';
import './AboutSection.css';
import AboutScene from './AboutScene';

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-content">
        <h2>About Me</h2>
        <p>
          I am Salahuddin Muhammad, an educator and technology enthusiast exploring the intersection of modern web development, artificial intelligence, autonomous agents and educational technology.
        </p>
        <p>
          My work focuses on intelligent educational applications, AI agents, automation, knowledge systems and immersive digital experiences. I believe in transforming ideas into useful, intelligent and engaging digital products.
        </p>
      </div>
      <div className="about-visual">
        <AboutScene />
      </div>
    </section>
  );
};

export default AboutSection;

import React from 'react';
import './ProjectsSection.css';

const projects = [
  { title: 'AI Teacher Copilot', desc: 'Curriculum-aware AI teaching application.' },
  { title: 'AI Digital Employee', desc: 'Experiments with computer-controlling AI agents.' },
  { title: 'Knowledge System (KSoR)', desc: 'Evidence-based knowledge management.' },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="projects-section">
      <h2>Featured Projects</h2>
      <div className="projects-grid">
        {projects.map((p) => (
          <div key={p.title} className="project-card">
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;

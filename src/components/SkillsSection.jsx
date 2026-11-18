import React from 'react';
import './SkillsSection.css';

const skills = [
  { category: 'Frontend', items: ['React.js', 'Next.js', 'JavaScript', 'HTML5', 'CSS3'] },
  { category: '3D Web', items: ['Three.js', 'React Three Fiber', 'Drei', 'GSAP'] },
  { category: 'AI', items: ['Agentic AI', 'AI Agents', 'AI-Assisted Dev', 'LLM Integrations'] },
  { category: 'Tools', items: ['Claude Code', 'Git', 'Vercel', 'PostgreSQL'] },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="skills-section">
      <h2>Skills & Technologies</h2>
      <div className="skills-grid">
        {skills.map((s) => (
          <div key={s.category} className="skill-card">
            <h3>{s.category}</h3>
            <ul>
              {s.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;

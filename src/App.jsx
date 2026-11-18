import Navbar from './components/Navbar';
import HeroScene from './components/HeroScene';
import HeroContent from './components/HeroContent';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import './index.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <section id="home" style={{height: '100vh', display: 'flex', alignItems: 'center', padding: '100px 3rem'}}>
          <div style={{flex: 1}}>
            <HeroContent />
          </div>
          <div style={{flex: 1, height: '100%'}}>
            <HeroScene />
          </div>
        </section>
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;

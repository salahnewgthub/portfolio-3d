import React, { useState } from 'react';
import { Github, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import './ContactSection.css';

const ContactSection = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thank you! Message received (simulated).');
    e.target.reset();
  };

  return (
    <section id="contact" className="contact-section">
      <h2>Let's Build Something Amazing.</h2>

      <div className="social-links">
        <a href="https://github.com/salahnewgthub" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github /></a>
        {/* <a href="https://www.facebook.com/salahuddin.muhammad.391" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook /></a> */}
        <a href="https://www.linkedin.com/in/salahuddin-muhammad" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a>
        <a href="https://www.youtube.com/@MrSalah3" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube /></a>
        <a href="https://wa.me/922103222820804" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle /></a>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <input type="text" placeholder="Name" required />
        <input type="email" placeholder="Email" required />
        <textarea placeholder="Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
      {status && <p className="status-msg">{status}</p>}
    </section>
  );
};

export default ContactSection;

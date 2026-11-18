import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const HeroContent = () => {
  const container = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(container.current.querySelector('h1'),
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(container.current.querySelector('p'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      "-=0.8"
    );
  }, { scope: container });

  return (
    <div ref={container}>
      <h1 style={{fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '1rem'}}>Salahuddin Muhammad</h1>
      <p style={{fontSize: '1.2rem'}}>Building Intelligent Digital Experiences.</p>
    </div>
  );
};

export default HeroContent;

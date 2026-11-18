import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';

const AbstractVisual = () => {
  const groupRef = useRef();

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#9d4edd" wireframe />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[1.5, 0.5, -1]}>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#00d4ff" />
        </mesh>
      </Float>
    </group>
  );
};

const AboutScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <AbstractVisual />
      <Environment preset="city" />
    </Canvas>
  );
};

export default AboutScene;

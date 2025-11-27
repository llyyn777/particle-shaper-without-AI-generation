import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ShapeType } from './types';
import ParticleSystem from './components/ParticleSystem';
import UIOverlay from './components/UIOverlay';
import HandController from './components/HandController';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const App: React.FC = () => {
  const [currentShape, setCurrentShape] = useState<ShapeType>(ShapeType.SATURN);
  const [particleColor, setParticleColor] = useState<string>('#3b82f6');
  const [particleSize, setParticleSize] = useState<number>(1.0);
  const [handOpenness, setHandOpenness] = useState<number>(0);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Smooth out camera values to prevent jitter
  const handleHandOpennessChange = useCallback((rawValue: number) => {
    setHandOpenness(prev => {
      // Simple lerp for smoothing
      return prev + (rawValue - prev) * 0.1;
    });
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
        controlsRef.current.enablePan = false;
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        {/* @ts-ignore */}
        <color attach="background" args={['#020205']} />
        
        {/* Lighting */}
        {/* @ts-ignore */}
        <ambientLight intensity={1.5} />
        {/* @ts-ignore */}
        <pointLight position={[10, 10, 10]} intensity={2} />
        {/* @ts-ignore */}
        <pointLight position={[-10, -10, -10]} intensity={1.5} color={particleColor} />
        {/* @ts-ignore */}
        <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Particles */}
        <ParticleSystem 
          shapeType={currentShape}
          color={particleColor}
          handOpenness={handOpenness}
          particleSize={particleSize}
        />
        
        {/* Post Processing */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.4} 
          />
        </EffectComposer>

        {/* @ts-ignore */}
        <OrbitControls 
          ref={controlsRef}
          autoRotate={!isCameraActive} 
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Logic & UI */}
      <HandController 
        isActive={isCameraActive} 
        onHandOpennessChange={handleHandOpennessChange} 
      />
      
      <UIOverlay 
        currentShape={currentShape}
        onShapeChange={setCurrentShape}
        onColorChange={setParticleColor}
        onToggleCamera={() => setIsCameraActive(!isCameraActive)}
        isCameraActive={isCameraActive}
        handOpenness={handOpenness}
        setHandOpenness={setHandOpenness}
        particleSize={particleSize}
        onParticleSizeChange={setParticleSize}
      />
    </div>
  );
};

export default App;
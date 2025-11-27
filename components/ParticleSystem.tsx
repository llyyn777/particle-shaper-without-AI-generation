import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShapeType, Vector3 } from '../types';
import { generateSphere, generateCube, generateHeart, generateDNA, generateSaturn, generateFlower, PARTICLE_COUNT } from '../constants';

interface ParticleSystemProps {
  shapeType: ShapeType;
  color: string;
  handOpenness: number; // 0 to 1
  particleSize: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ shapeType, color, handOpenness, particleSize }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Current positions of all particles
  const currentPositions = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  // Target positions based on selected shape
  const targetPositions = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  // Colors for gradients
  const colorArray = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  
  // Generate target points based on shape
  useEffect(() => {
    let points: Vector3[] = [];
    
    switch (shapeType) {
      case ShapeType.SPHERE:
        points = generateSphere(PARTICLE_COUNT);
        break;
      case ShapeType.CUBE:
        points = generateCube(PARTICLE_COUNT);
        break;
      case ShapeType.HEART:
        points = generateHeart(PARTICLE_COUNT);
        break;
      case ShapeType.DNA:
        points = generateDNA(PARTICLE_COUNT);
        break;
      case ShapeType.SATURN:
        points = generateSaturn(PARTICLE_COUNT);
        break;
      case ShapeType.FLOWER:
        points = generateFlower(PARTICLE_COUNT);
        break;
      default:
        points = generateSphere(PARTICLE_COUNT);
    }

    // Update target buffer
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = points[i] || { x: 0, y: 0, z: 0 };
      targetPositions.current[i * 3] = p.x;
      targetPositions.current[i * 3 + 1] = p.y;
      targetPositions.current[i * 3 + 2] = p.z;
    }
  }, [shapeType]);

  // Update Colors based on position (Gradient) and selected color
  useEffect(() => {
    const baseColor = new THREE.Color(color);
    const hsl = { h: 0, s: 0, l: 0 };
    baseColor.getHSL(hsl);

    if (meshRef.current) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Create a gradient variation
            // We use the particle index or position to shift hue/lightness slightly
            const hueShift = (i / PARTICLE_COUNT) * 0.1 - 0.05; 
            const lightnessShift = (Math.random() * 0.4) - 0.2;

            const c = new THREE.Color().setHSL(
                (hsl.h + hueShift + 1.0) % 1.0, 
                Math.min(1.0, hsl.s + 0.1), // Boost saturation slightly
                Math.min(1.0, Math.max(0.1, hsl.l + lightnessShift))
            );

            colorArray[i * 3] = c.r;
            colorArray[i * 3 + 1] = c.g;
            colorArray[i * 3 + 2] = c.b;
        }
        meshRef.current.geometry.attributes.color.needsUpdate = true;
    }
  }, [color]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positions = currentPositions.current;
    const targets = targetPositions.current;
    
    const expansionFactor = handOpenness * 6.0; 
    const lerpSpeed = 0.08;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const tx = targets[ix];
      const ty = targets[iy];
      const tz = targets[iz];
      
      const breathe = Math.sin(time * 1.5 + i * 0.02) * 0.15;
      
      const dist = Math.sqrt(tx*tx + ty*ty + tz*tz) + 0.001;
      const dirX = tx / dist;
      const dirY = ty / dist;
      const dirZ = tz / dist;

      const finalTx = tx + (dirX * expansionFactor) + (dirX * breathe);
      const finalTy = ty + (dirY * expansionFactor) + (dirY * breathe);
      const finalTz = tz + (dirZ * expansionFactor) + (dirZ * breathe);
      
      positions[ix] += (finalTx - positions[ix]) * lerpSpeed;
      positions[iy] += (finalTy - positions[iy]) * lerpSpeed;
      positions[iz] += (finalTz - positions[iz]) * lerpSpeed;

      dummy.position.set(positions[ix], positions[iy], positions[iz]);
      
      dummy.rotation.set(time * 0.2 + i, time * 0.1, 0);
      
      // Base scale logic + particleSize multiplier
      const baseScale = Math.max(0.05, 0.22 - (handOpenness * 0.15));
      const scale = baseScale * particleSize;
      
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // @ts-ignore
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      {/* @ts-ignore */}
      <dodecahedronGeometry args={[0.2, 0]}>
         {/* @ts-ignore */}
         <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </dodecahedronGeometry>
      {/* @ts-ignore */}
      <meshStandardMaterial 
        vertexColors
        roughness={0.3}
        metalness={0.5}
        emissive={color}
        emissiveIntensity={0.6}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

export default ParticleSystem;
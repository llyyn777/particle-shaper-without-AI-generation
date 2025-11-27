import { Vector3 } from './types';

export const PARTICLE_COUNT = 3000;

export const generateSphere = (count: number): Vector3[] => {
  const points: Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = 4; // Radius
    points.push({
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi)
    });
  }
  return points;
};

export const generateCube = (count: number): Vector3[] => {
  const points: Vector3[] = [];
  const size = 5;
  for (let i = 0; i < count; i++) {
    points.push({
      x: (Math.random() - 0.5) * size,
      y: (Math.random() - 0.5) * size,
      z: (Math.random() - 0.5) * size
    });
  }
  return points;
};

export const generateHeart = (count: number): Vector3[] => {
  const points: Vector3[] = [];
  for (let i = 0; i < count; i++) {
    // Heart 3D Formula
    // x = 16sin^3(t)
    // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
    // z = random depth profile based on x/y
    
    // Using a rejection sampling or parametric surface approach for better volume
    // Let's use a parametric surface approach
    const t = Math.random() * Math.PI * 2;
    const u = Math.random() * Math.PI; // Depth parameter
    
    // Base 2D heart shape
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    
    // Scale down
    x *= 0.2;
    y *= 0.2;
    
    // Add volume
    const z = (Math.random() - 0.5) * 2 * (1 - Math.abs(t - Math.PI) / Math.PI); 

    points.push({ x, y, z });
  }
  return points;
};

export const generateDNA = (count: number): Vector3[] => {
  const points: Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 8; // 4 turns
    const r = 2;
    // Double helix
    const offset = i % 2 === 0 ? 0 : Math.PI;
    points.push({
      x: Math.cos(t + offset) * r,
      y: (i / count) * 8 - 4,
      z: Math.sin(t + offset) * r
    });
  }
  return points;
};

export const generateSaturn = (count: number): Vector3[] => {
  const points: Vector3[] = [];
  const planetParticles = Math.floor(count * 0.6);
  const ringParticles = count - planetParticles;

  // Planet (Sphere)
  for (let i = 0; i < planetParticles; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = 2.5; 
    points.push({
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi)
    });
  }

  // Rings
  for (let i = 0; i < ringParticles; i++) {
     const angle = Math.random() * Math.PI * 2;
     // Ring radius between 3.5 and 6
     const distance = 3.5 + Math.random() * 2.5;
     points.push({
       x: distance * Math.cos(angle),
       y: (Math.random() - 0.5) * 0.2, // Very flat
       z: distance * Math.sin(angle)
     });
  }
  return points;
};

export const generateFlower = (count: number): Vector3[] => {
  const points: Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2; // angle around
    const v = Math.random() * Math.PI; // angle from center
    
    // Mathematical flower shape (Rose)
    // r = cos(k * theta)
    const k = 4; // 4 petals
    const rShape = Math.abs(Math.cos(k * u * 0.5)); // Shape profile
    
    const r = rShape * 4 + 0.5;
    
    // Project to 3D cup shape
    const x = r * Math.sin(v) * Math.cos(u);
    const z = r * Math.sin(v) * Math.sin(u);
    const y = r * Math.cos(v) * 0.5 + Math.cos(v*2); // Add some depth curve

    points.push({ x, y, z });
  }
  return points;
};
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface ParticleState {
  positions: Float32Array;
  colors: Float32Array;
}

export enum ShapeType {
  SPHERE = 'Sphere',
  CUBE = 'Cube',
  HEART = 'Heart',
  DNA = 'DNA Helix',
  SATURN = 'Saturn',
  FLOWER = 'Flower'
}

export interface AppState {
  currentShape: ShapeType;
  particleColor: string;
  handOpenness: number; // 0.0 (Closed) to 1.0 (Open)
  isCameraActive: boolean;
}
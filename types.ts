export interface ParticleState {
  particleCount: number;
  cubeSize: number;
  greenRatio: number; // 0-100
  redRatio: number; // 0-100
  isScattered: boolean;
  
  setParticleCount: (count: number) => void;
  setCubeSize: (size: number) => void;
  setGreenRatio: (ratio: number) => void;
  setRedRatio: (ratio: number) => void;
  toggleScatter: () => void;
}

export type ParticleType = 'gold' | 'emerald' | 'red';

export interface ParticleData {
  id: number;
  type: ParticleType;
  scatterPos: [number, number, number];
  treePos: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

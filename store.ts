import { create } from 'zustand';
import { ParticleState } from './types';

export const useStore = create<ParticleState>((set) => ({
  particleCount: 1500,
  cubeSize: 1.2,
  greenRatio: 35,
  redRatio: 25,
  isScattered: true, // Start scattered for dramatic effect

  setParticleCount: (count) => set({ particleCount: count }),
  setCubeSize: (size) => set({ cubeSize: size }),
  setGreenRatio: (ratio) => set({ greenRatio: ratio }),
  setRedRatio: (ratio) => set({ redRatio: ratio }),
  toggleScatter: () => set((state) => ({ isScattered: !state.isScattered })),
}));

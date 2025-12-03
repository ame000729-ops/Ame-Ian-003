import * as THREE from 'three';
import { ParticleData, ParticleType } from '../types';

export const generateParticles = (
  count: number, 
  greenRatio: number, 
  redRatio: number
): ParticleData[] => {
  const particles: ParticleData[] = [];
  
  // Tree Dimensions
  const treeHeight = 16;
  const maxRadius = 6;
  
  // Ratios converted to thresholds
  const greenThreshold = greenRatio / 100;
  const redThreshold = greenThreshold + (redRatio / 100);

  for (let i = 0; i < count; i++) {
    const randomVal = Math.random();
    let type: ParticleType = 'gold';
    
    if (randomVal < greenThreshold) type = 'emerald';
    else if (randomVal < redThreshold) type = 'red';

    // 1. Generate Tree Position (Cone)
    // Use logarithmic distribution for height to make the bottom denser if desired, 
    // or linear for standard cone. Adding randomness to radius for "fluffy" look.
    const y = Math.random() * treeHeight; 
    const radiusAtHeight = ((treeHeight - y) / treeHeight) * maxRadius;
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radiusAtHeight; // Uniform internal volume
    // Or surface only: const r = radiusAtHeight * (0.8 + Math.random() * 0.2);
    
    // Spiral distribution for aesthetic
    const spiralAngle = y * 2.5 + angle;
    
    const tx = Math.cos(spiralAngle) * r;
    const tz = Math.sin(spiralAngle) * r;
    const ty = y - treeHeight / 2; // Center vertically

    // 2. Generate Scatter Position (Sphere)
    const scatterRadius = 15 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const sx = scatterRadius * Math.sin(phi) * Math.cos(theta);
    const sy = scatterRadius * Math.sin(phi) * Math.sin(theta);
    const sz = scatterRadius * Math.cos(phi);

    particles.push({
      id: i,
      type,
      treePos: [tx, ty, tz],
      scatterPos: [sx, sy, sz],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: 0.5 + Math.random() * 0.5
    });
  }

  return particles;
};

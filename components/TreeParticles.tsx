import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store';
import { generateParticles } from './Utils';

const tempObject = new THREE.Object3D();
const vec3_current = new THREE.Vector3();
const vec3_target = new THREE.Vector3();
const vec3_start = new THREE.Vector3();

// Interpolation Helper
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export const TreeParticles: React.FC = () => {
  const { particleCount, greenRatio, redRatio, cubeSize, isScattered } = useStore();

  // Generate data only when structural params change
  const particles = useMemo(() => 
    generateParticles(particleCount, greenRatio, redRatio), 
    [particleCount, greenRatio, redRatio]
  );

  // Separate indices for instanced meshes
  const groups = useMemo(() => {
    return {
      gold: particles.filter(p => p.type === 'gold'),
      emerald: particles.filter(p => p.type === 'emerald'),
      red: particles.filter(p => p.type === 'red'),
    };
  }, [particles]);

  // Refs for InstancedMeshes
  const goldRef = useRef<THREE.InstancedMesh>(null);
  const emeraldRef = useRef<THREE.InstancedMesh>(null);
  const redRef = useRef<THREE.InstancedMesh>(null);

  // Animation State
  const progress = useRef(isScattered ? 0 : 1); 

  useLayoutEffect(() => {
    // Initial positioning to avoid flicker
    const updateMesh = (mesh: THREE.InstancedMesh | null, data: typeof groups.gold) => {
      if (!mesh) return;
      data.forEach((particle, i) => {
        const [x, y, z] = isScattered ? particle.scatterPos : particle.treePos;
        tempObject.position.set(x, y, z);
        tempObject.rotation.set(particle.rotation[0], particle.rotation[1], particle.rotation[2]);
        tempObject.scale.setScalar(particle.scale);
        tempObject.updateMatrix();
        mesh.setMatrixAt(i, tempObject.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };

    updateMesh(goldRef.current, groups.gold);
    updateMesh(emeraldRef.current, groups.emerald);
    updateMesh(redRef.current, groups.red);
  }, [particles, groups]); // Run when particles regenerate

  useFrame((state, delta) => {
    // Smooth transition logic
    const target = isScattered ? 0 : 1;
    // Cubic easing
    const speed = 2.0;
    if (Math.abs(progress.current - target) > 0.001) {
      progress.current = lerp(progress.current, target, delta * speed);
    } else {
      progress.current = target;
    }

    const t = progress.current;
    
    // Easing function for smoother motion (InOutQuad)
    const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Time for floating animation
    const time = state.clock.getElapsedTime();

    const updateInstances = (mesh: THREE.InstancedMesh | null, data: typeof groups.gold, baseScale: number) => {
      if (!mesh) return;

      for (let i = 0; i < data.length; i++) {
        const p = data[i];
        
        // Start Position
        vec3_start.set(p.scatterPos[0], p.scatterPos[1], p.scatterPos[2]);
        // Target Position
        vec3_target.set(p.treePos[0], p.treePos[1], p.treePos[2]);
        
        // Interpolate
        vec3_current.lerpVectors(vec3_start, vec3_target, easedT);

        // Add subtle floating noise based on particle ID
        const floatY = Math.sin(time + p.id * 0.1) * 0.1;
        const rotateY = time * 0.2 + p.id;
        
        tempObject.position.copy(vec3_current);
        tempObject.position.y += floatY;
        
        // Rotate instances individually
        tempObject.rotation.set(
          p.rotation[0] + time * 0.1, 
          p.rotation[1] + rotateY, 
          p.rotation[2]
        );

        // Dynamic scale
        const s = p.scale * baseScale;
        tempObject.scale.setScalar(s);

        tempObject.updateMatrix();
        mesh.setMatrixAt(i, tempObject.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    };

    updateInstances(goldRef.current, groups.gold, cubeSize * 0.2); // Cube size factor
    updateInstances(emeraldRef.current, groups.emerald, cubeSize * 0.25);
    updateInstances(redRef.current, groups.red, cubeSize * 0.2);
  });

  return (
    <group>
      {/* 1. White-Gold Cubes: Self-luminous, Cube Shape */}
      <instancedMesh ref={goldRef} args={[undefined, undefined, groups.gold.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#E5E4E2" 
          emissive="#D4AF37"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </instancedMesh>

      {/* 2. Emeralds: Tetrahedron, Glass-like */}
      <instancedMesh ref={emeraldRef} args={[undefined, undefined, groups.emerald.length]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color="#006b3c" // Deep Emerald
          emissive="#003311"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6} // Glassy
          thickness={1.5}
          ior={1.6}
        />
      </instancedMesh>

      {/* 3. Red Spheres: Metallic Red, Sphere Shape */}
      <instancedMesh ref={redRef} args={[undefined, undefined, groups.red.length]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial 
          color="#8a0303"
          roughness={0.15}
          metalness={0.8}
          envMapIntensity={1.5}
        />
      </instancedMesh>
    </group>
  );
};

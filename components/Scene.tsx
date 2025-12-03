import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeParticles } from './TreeParticles';

export const Scene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] to-[#1a1505]">
      <Canvas
        gl={{ 
            antialias: false, 
            preserveDrawingBuffer: true, // Crucial for screenshot
            toneMappingExposure: 1.2
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 2, 25]} fov={45} />
        
        <OrbitControls 
            enablePan={false} 
            minDistance={10} 
            maxDistance={40}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5} // Don't go below ground
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} color="#ffffff" />
        <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={200} color="#ffeedd" castShadow />
        <pointLight position={[-10, 5, -10]} intensity={50} color="#00ff00" distance={20} />
        <Environment preset="city" />

        {/* Background Atmosphere */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <Suspense fallback={null}>
          <TreeParticles />
        </Suspense>

        {/* Cinematic Post Processing */}
        <EffectComposer disableNormalPass>
            {/* Gold Bloom */}
            <Bloom 
                luminanceThreshold={0.8} 
                mipmapBlur 
                intensity={1.5} 
                radius={0.4}
                color="#fff8db"
            />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>
      </Canvas>
      
      {/* Overlay specific text if needed inside canvas area */}
      <div className="absolute bottom-8 right-[20%] text-white/30 text-xs font-serif italic pointer-events-none select-none">
          Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

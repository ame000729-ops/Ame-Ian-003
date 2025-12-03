import React from 'react';
import { Scene } from './components/Scene';
import { Controls } from './components/Controls';
import { ScreenshotBtn } from './components/ScreenshotBtn';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Scene />
      <Controls />
      <ScreenshotBtn />
      
      {/* Mobile Warning */}
      <div className="absolute top-0 left-0 w-full h-full bg-black z-50 flex items-center justify-center p-8 text-center text-[#d4af37] md:hidden">
        <p className="font-serif border border-[#d4af37] p-4">
          Please view on a desktop or tablet for the full Arix Signature experience.
        </p>
      </div>
    </div>
  );
};

export default App;

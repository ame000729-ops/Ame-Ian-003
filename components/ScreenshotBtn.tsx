import React, { useState } from 'react';

export const ScreenshotBtn: React.FC = () => {
  const [flash, setFlash] = useState(false);

  const takeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Trigger Flash
      setFlash(true);
      setTimeout(() => setFlash(false), 200);

      // Capture
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.setAttribute('download', 'arix-tree-signature.png');
      link.setAttribute('href', dataUrl);
      link.click();
    }
  };

  return (
    <>
      {/* Flash Overlay */}
      <div 
        className={`fixed inset-0 bg-white pointer-events-none z-50 transition-opacity duration-200 ease-out
        ${flash ? 'opacity-80' : 'opacity-0'}`}
      />

      {/* Button */}
      <button 
        onClick={takeScreenshot}
        className="fixed bottom-8 left-8 w-14 h-14 rounded-full z-40
        bg-gradient-to-br from-[#f0e6c8] to-[#d4af37]
        shadow-[0_0_20px_rgba(212,175,55,0.4)]
        hover:scale-110 transition-transform duration-300
        flex items-center justify-center group overflow-hidden"
        title="Capture Signature"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4a3b10]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </>
  );
};

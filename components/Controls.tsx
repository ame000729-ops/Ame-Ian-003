import React, { useState } from 'react';
import { useStore } from '../store';

const PanelSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-[#d4af37] font-serif text-sm uppercase tracking-widest border-b border-[#d4af37]/30 pb-2 mb-4">
      {title}
    </h3>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const RangeSlider: React.FC<{
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  formatter?: (val: number) => string;
}> = ({ label, min, max, step, value, onChange, formatter }) => (
  <div>
    <div className="flex justify-between text-[#e5dfc7] text-xs font-light mb-2">
      <span className="uppercase tracking-wide">{label}</span>
      <span className="font-mono text-[#d4af37]">{formatter ? formatter(value) : value}</span>
    </div>
    <div className="relative h-6 flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  </div>
);

export const Controls: React.FC = () => {
  const { 
    particleCount, setParticleCount,
    cubeSize, setCubeSize,
    greenRatio, setGreenRatio,
    redRatio, setRedRatio,
    isScattered, toggleScatter
  } = useStore();

  const [loading, setLoading] = useState(false);

  // Debounced handler for heavy operations like count change
  const handleCountChange = (val: number) => {
    setLoading(true);
    // Simulate slight delay for cinematic feel
    setTimeout(() => {
      setParticleCount(val);
      setLoading(false);
    }, 100);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[18%] min-w-[280px] z-20 
      bg-[rgba(10,5,15,0.7)] backdrop-blur-xl border-l border-[#d4af37]/20
      flex flex-col shadow-2xl transition-transform duration-500 transform translate-x-0"
      style={{ backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,215,0,0.03) 0 1px, transparent 1px 4px)' }}
    >
      <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#f0e6c8] to-[#d4af37] mb-1">
            ARIX
          </h1>
          <p className="text-[#888] text-[0.6rem] uppercase tracking-[0.3em]">Signature Collection</p>
        </div>

        {/* Animation Control */}
        <div className="mb-10">
            <button 
                onClick={toggleScatter}
                className={`w-full py-4 text-xs uppercase tracking-widest font-bold border transition-all duration-500
                ${!isScattered 
                    ? 'border-[#d4af37] text-[#050505] bg-gradient-to-r from-[#f0e6c8] to-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                    : 'border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10'}`}
            >
                {isScattered ? 'Assemble Tree' : 'Scatter Particles'}
            </button>
        </div>

        {/* Controls */}
        <PanelSection title="Particle System">
          <RangeSlider 
            label="Platinum Size" 
            min={0.5} max={3.0} step={0.1} 
            value={cubeSize}
            onChange={setCubeSize}
          />

           <RangeSlider 
            label="Emerald Density" 
            min={0} max={60} step={1} 
            value={greenRatio}
            onChange={setGreenRatio}
            formatter={(v) => `${v}%`}
          />

          <RangeSlider 
            label="Ruby Density" 
            min={0} max={60} step={1} 
            value={redRatio}
            onChange={setRedRatio}
            formatter={(v) => `${v}%`}
          />
        </PanelSection>

        <PanelSection title="Performance">
             <div className="space-y-4">
                 <div className="text-[#e5dfc7] text-xs font-light uppercase tracking-wide mb-2">Particle Count</div>
                 <div className="grid grid-cols-4 gap-2">
                     {[500, 1500, 3000, 5000].map(count => (
                         <button
                            key={count}
                            onClick={() => handleCountChange(count)}
                            className={`py-2 text-[0.65rem] border transition-all
                            ${particleCount === count 
                                ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#fff]' 
                                : 'border-[#d4af37]/20 text-[#888] hover:border-[#d4af37]/50'}`}
                         >
                             {count}
                         </button>
                     ))}
                 </div>
                 {loading && <div className="h-0.5 w-full bg-[#d4af37] animate-pulse mt-2"></div>}
             </div>
        </PanelSection>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-[#d4af37]/10 text-center">
          <p className="text-[#555] text-[0.6rem] font-serif">Engineered for Arix Experience</p>
      </div>
    </div>
  );
};

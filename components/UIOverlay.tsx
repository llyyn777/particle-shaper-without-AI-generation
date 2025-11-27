import React from 'react';
import { ShapeType } from '../types';

interface UIOverlayProps {
  currentShape: ShapeType;
  onShapeChange: (shape: ShapeType) => void;
  onColorChange: (color: string) => void;
  onToggleCamera: () => void;
  isCameraActive: boolean;
  handOpenness: number;
  setHandOpenness: (val: number) => void;
  particleSize: number;
  onParticleSizeChange: (size: number) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  currentShape,
  onShapeChange,
  onColorChange,
  onToggleCamera,
  isCameraActive,
  handOpenness,
  setHandOpenness,
  particleSize,
  onParticleSizeChange
}) => {
  const colors = ['#ffffff', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#d946ef'];
  const shapes = [
    ShapeType.SPHERE, 
    ShapeType.CUBE, 
    ShapeType.HEART, 
    ShapeType.DNA,
    ShapeType.SATURN,
    ShapeType.FLOWER
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end items-end p-4 md:p-6">
      
      {/* Main Controls - Bottom Right */}
      <div className="flex flex-col gap-3 pointer-events-auto w-full max-w-sm">
        
        {/* Shape Selector & Colors */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
          
          {/* Color Selector */}
          <div className="flex flex-wrap justify-center gap-2">
             {colors.map(c => (
               <button
                 key={c}
                 onClick={() => onColorChange(c)}
                 className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform shadow-sm"
                 style={{ backgroundColor: c }}
                 title={c}
               />
             ))}
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Shape Grid */}
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((s) => (
              <button
                key={s}
                onClick={() => onShapeChange(s)}
                className={`text-[10px] py-1.5 px-1 rounded-lg transition-all font-medium uppercase tracking-wider ${
                  currentShape === s 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Visual & Interaction Controls */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-4">
          
          {/* Particle Size Slider */}
          <div className="flex flex-col gap-1">
             <div className="flex justify-between items-center text-xs text-gray-400">
               <span>Particle Size</span>
               <span className="font-mono text-blue-400">{particleSize.toFixed(1)}x</span>
             </div>
             <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={particleSize}
                onChange={(e) => onParticleSizeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:bg-white/30 transition-colors"
             />
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Interaction Mode */}
          <div className="flex justify-between items-center mb-2">
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <h3 className="text-xs font-semibold text-gray-300">
                  {isCameraActive ? 'Gesture Control' : 'Manual Slider'}
                </h3>
             </div>
             <button
               onClick={onToggleCamera}
               className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${
                 isCameraActive 
                   ? 'bg-red-500/20 border-red-500 text-red-200 hover:bg-red-500/30' 
                   : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
               }`}
             >
               {isCameraActive ? 'Stop' : 'Start Camera'}
             </button>
          </div>

          {/* Visualization / Manual Slider */}
          <div className="relative h-6 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div 
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-100 ease-out"
              style={{ width: `${handOpenness * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={handOpenness}
              onChange={(e) => setHandOpenness(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isCameraActive}
            />
          </div>
        </div>

        {/* Fullscreen Button */}
        <button 
          onClick={() => {
              if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
              } else {
                  if (document.exitFullscreen) {
                      document.exitFullscreen();
                  }
              }
          }}
          className="self-end bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-lg transition-colors border border-white/5"
          title="Toggle Fullscreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </button>

      </div>
    </div>
  );
};

export default UIOverlay;
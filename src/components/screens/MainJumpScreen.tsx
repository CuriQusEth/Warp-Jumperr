import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { motion } from 'motion/react';

export default function MainJumpScreen() {
  const { distance, score, combo, warpEnergy } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8">
      
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-bold text-cyan-400 tracking-[0.3em] uppercase">Distance</span>
          <span className="text-4xl md:text-5xl font-black font-mono tracking-tighter">
            {Math.floor(distance).toLocaleString()}<span className="text-lg text-white/40 ml-2">M</span>
          </span>
          <span className="text-sm font-mono text-cyan-300 mt-1">
            {score.toLocaleString()} <span className="text-[10px] text-white/50 tracking-widest uppercase">pts</span>
          </span>
        </div>
        
        {combo > 1 && (
          <motion.div 
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={combo}
            className="px-4 py-2 bg-black/60 rounded-xl border border-white/10 backdrop-blur-md text-right"
          >
            <span className="text-[10px] font-bold text-purple-400 block uppercase">Combo Multiplier</span>
            <span className="text-3xl font-black drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">
              x{combo}
            </span>
          </motion.div>
        )}
      </div>

      {/* Bottom HUD: Energy */}
      <div className="w-full max-w-md mx-auto mb-4 flex flex-col gap-3">
        <div className="flex justify-between items-end px-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Warp Energy</span>
          <span className="text-xs font-mono text-cyan-400">{Math.floor(warpEnergy)}%</span>
        </div>
        <div className="h-3 w-full bg-white/5 rounded-full border border-white/10 overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-white to-cyan-500 transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(34,211,238,0.8)]"
            style={{ width: `${warpEnergy}%` }}
          />
        </div>
      </div>

    </div>
  );
}


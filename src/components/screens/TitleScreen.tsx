import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';

export default function TitleScreen() {
  const { setScreen } = useGameStore();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-50 pointer-events-auto">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="text-center bg-white/5 border border-white/10 p-12 rounded-3xl shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <div className="w-4 h-4 bg-white rounded-sm -rotate-45"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase whitespace-nowrap">
            Warp <span className="text-cyan-400">Jumper</span>
          </h1>
        </div>
        <p className="text-white/40 uppercase tracking-[0.2em] text-sm mb-12 font-bold">Dimensional Acrobatics</p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setScreen('playing')}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-black text-sm uppercase tracking-tighter hover:brightness-110 shadow-lg mb-6"
        >
          Start Jump
        </motion.button>
        
        <div className="flex gap-6 justify-center">
           <button onClick={() => setScreen('leaderboard')} className="text-xs font-bold tracking-widest text-white/50 hover:text-cyan-300 uppercase transition-colors">Leaderboard</button>
           <button onClick={() => setScreen('garage')} className="text-xs font-bold tracking-widest text-white/50 hover:text-fuchsia-300 uppercase transition-colors">Garage</button>
        </div>
      </motion.div>
    </div>
  );
}


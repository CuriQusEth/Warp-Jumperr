import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function GarageScreen() {
  const { setScreen } = useGameStore();

  const skins = [
    { id: 'classic', name: 'Cyner-Blue', color: '#00f3ff', selected: true },
    { id: 'heat', name: 'Plasma Pink', color: '#ff00ff', selected: false },
    { id: 'void', name: 'Dark Matter', color: '#8800ff', selected: false },
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-black/40 backdrop-blur-md text-white z-50 p-6 overflow-y-auto pointer-events-auto">
       <button 
         onClick={() => setScreen('title')}
         className="self-start text-xs font-bold text-white/40 hover:text-white uppercase mb-6 flex items-center gap-2 transition-colors"
       >
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
         Back to Menu
       </button>
       
       <div className="flex-1 max-w-md w-full mx-auto space-y-6">
         <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
           <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
             <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11v9h-5v-6h-4v6H5v-9m14-8v3m0 0h-3m3 0H5m14-3H5v3M5 3v3"/></svg>
             Dimensional Garage
           </h3>
           
           <div className="space-y-4">
             {skins.map((skin) => (
               <div 
                 key={skin.id}
                 className={`flex items-center justify-between p-4 rounded-xl border transition-all ${skin.selected ? 'bg-white/10 border-white/20' : 'bg-white/5 border-transparent'}`}
               >
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]" style={{ backgroundColor: skin.color, boxShadow: skin.selected ? `0 0 20px ${skin.color}80` : 'none' }} />
                     <span className="font-bold tracking-wider">{skin.name}</span>
                  </div>
                  {skin.selected ? (
                     <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest border border-cyan-400/30 px-2 py-1 rounded">Equipped</span>
                  ) : (
                     <button className="text-[10px] font-bold tracking-widest px-3 py-1 bg-white/10 hover:bg-white/20 rounded uppercase transition-colors">Equip</button>
                  )}
               </div>
             ))}
           </div>
         </div>
       </div>
    </div>
  );
}


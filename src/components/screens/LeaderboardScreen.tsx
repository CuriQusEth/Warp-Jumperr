import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { motion } from 'motion/react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useERC8021Transaction } from '../../hooks/useERC8021Transaction';
import { stringToHex, Hex } from 'viem';

export default function LeaderboardScreen() {
  const { setScreen } = useGameStore();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  
  const { sendTransaction, isPending, hash, isSuccess } = useERC8021Transaction();

  const mockLeaderboard = [
    { rank: 1, address: "0x4A...2B", distance: 8420, score: 1250000 },
    { rank: 2, address: "0x89...FE", distance: 6100, score: 980000 },
    { rank: 3, address: "0x12...DC", distance: 4500, score: 760000 },
    { rank: 4, address: "0xBA...99", distance: 3800, score: 540000 },
    { rank: 5, address: "0x77...11", distance: 2900, score: 380000 },
  ];

  const handleSayGM = () => {
    if (!isConnected) {
      connect({ connector: injected() });
      return;
    }
    if (address) {
      const gmData = stringToHex('GM from Warp Jumper!');
      sendTransaction({
        to: address,
        data: gmData as Hex
      });
    }
  };

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
             <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
             Top Jumpers
           </h3>
           <div className="space-y-4">
             {mockLeaderboard.map((entry) => (
               <motion.div 
                 key={entry.rank}
                 initial={{ x: -20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ delay: entry.rank * 0.1 }}
                 className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
               >
                  <div className="flex items-center gap-3">
                     <span className={`text-xs font-bold ${entry.rank === 1 ? 'text-cyan-400' : 'text-white/40'}`}>
                       {String(entry.rank).padStart(2, '0')}
                     </span>
                     <span className="text-sm font-medium">{entry.address}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono opacity-60">{(entry.distance / 1000).toFixed(1)}k m</div>
                  </div>
               </motion.div>
             ))}
           </div>
           <div className="mt-8 space-y-4">
              <button 
                onClick={handleSayGM}
                disabled={isPending}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-tighter transition-all shadow-lg
                  ${isPending 
                    ? "bg-white/10 text-white/40 cursor-not-allowed" 
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110"
                  }`}
              >
                {isPending ? "Transmitting..." : (isConnected ? "SAY GM ON-CHAIN" : "CONNECT TO SAY GM")}
              </button>
              
              {isSuccess && hash && (
                <div className="text-[10px] text-cyan-400 font-mono text-center break-all px-4">
                  Tx: {hash}
                </div>
              )}
              
              <p className="text-[10px] text-white/30 tracking-widest uppercase font-bold text-center mt-3">Powered by Base • ERC-8004</p>
           </div>
         </div>
       </div>
    </div>
  );
}


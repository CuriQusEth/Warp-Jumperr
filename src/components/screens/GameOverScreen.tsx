import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { motion } from 'motion/react';
import { appendAttribution } from '../../lib/erc8021';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function GameOverScreen() {
  const { setScreen, distance, score, resetGame } = useGameStore();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordRun = async () => {
    if (!isConnected) {
      connect({ connector: injected() });
      return;
    }
    
    setIsRecording(true);
    try {
      // Mocking transaction submission on-chain using SIWE / Wagmi
      console.log("Preparing transaction from account:", address);
      let calldata = "0xdeadbeef"; 
      calldata = appendAttribution(calldata);
      console.log("Calculated Calldata with ERC-8021 Builder code:", calldata);
      
      // Simulate network wait
      await new Promise(r => setTimeout(r, 2000));
      
      console.log("Mock Tx Hash: 0x9876543210...");
      alert(`Run securely recorded on Base Mainnet for ${address}!`);
    } catch(e) {
      console.error(e);
      alert("Failed to record run.");
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-lg z-50 p-6 pointer-events-auto">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-sm w-full bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
      >
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#FF4848] mb-8 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Signal Lost
        </h2>
        
        <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-white/5 space-y-4">
           <div>
             <span className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase block mb-1">Distance</span>
             <span className="text-3xl font-black font-mono">
               {Math.floor(distance).toLocaleString()}<span className="text-sm text-white/40 ml-1">M</span>
             </span>
           </div>
           <div>
             <span className="text-[10px] font-bold text-cyan-400 tracking-[0.3em] uppercase block mb-1">Score</span>
             <span className="text-xl font-bold font-mono text-cyan-300">{score.toLocaleString()}</span>
           </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleRecordRun}
            disabled={isRecording}
            className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-tighter transition-all shadow-lg
              ${isRecording 
                 ? "bg-white/10 text-white/40 cursor-not-allowed" 
                 : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:brightness-110"
              }`}
          >
            {isRecording ? "Transmitting..." : (isConnected ? "Record Run On-Chain" : "Connect To Record")}
          </button>
          
          <button 
            onClick={() => {
              resetGame();
              setScreen('playing');
            }}
            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl uppercase tracking-tighter font-black text-sm hover:bg-white/10 transition-colors"
          >
            Deploy New Jumper
          </button>
          
          <button 
            onClick={() => setScreen('title')}
            className="w-full text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-widest pt-2 transition-colors"
          >
            Abort to Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Web3Provider } from './components/WagmiProvider';
import GameCanvas from './components/GameCanvas';
import TitleScreen from './components/screens/TitleScreen';
import MainJumpScreen from './components/screens/MainJumpScreen';
import GameOverScreen from './components/screens/GameOverScreen';
import LeaderboardScreen from './components/screens/LeaderboardScreen';
import GarageScreen from './components/screens/GarageScreen';
import { useGameStore } from './store/gameStore';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { Sun } from 'lucide-react';
import { useERC8021Transaction } from './hooks/useERC8021Transaction';
import { stringToHex, Hex } from 'viem';
import { DenimStatusBadge } from './components/DenimStatusBadge';

function Navbar() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending } = useERC8021Transaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      data: stringToHex('gm') as Hex
    });
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/5 border-b border-white/10 pointer-events-auto">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          <div className="w-3 h-3 bg-white rounded-sm -rotate-45"></div>
        </div>
        <span className="text-xl font-black tracking-tighter uppercase hidden sm:block">Warp <span className="text-cyan-400">Jumper</span></span>
      </div>
      <div className="flex items-center gap-4">
        {isConnected && (
          <button 
            onClick={sendGMTransaction}
            disabled={isPending}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun className="w-4 h-4" />
            {isPending ? 'Sending...' : 'Say GM'}
          </button>
        )}

        {/* Base Denim 200ms Native Blocks live status & network switcher */}
        <DenimStatusBadge />

        <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
        
        {isConnected && address ? (
          <button 
            onClick={() => disconnect()}
            className="px-4 py-2 bg-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/20 rounded-full font-bold text-xs backdrop-blur-xl transition-all font-mono"
            title="Click to Disconnect"
          >
            {`${address.slice(0, 5)}...${address.slice(-4)}`}
          </button>
        ) : (
          <button 
            onClick={() => connect({ connector: injected(), chainId: base.id })}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 rounded-full font-bold text-xs backdrop-blur-xl transition-all font-mono text-cyan-300"
          >
            Connect
          </button>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-30 px-6 py-3 flex items-center justify-between text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] border-t border-white/5 backdrop-blur-md bg-black/20 pointer-events-none hidden sm:flex">
      <div className="flex items-center gap-8">
        <span>App ID: 68f3ff7f...</span>
        <span>Builder: bc_jimjbehn</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-cyan-400/50">Powered by Base</span>
        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
        <span>Warp Jumper v1.0.4</span>
      </div>
    </footer>
  );
}

export default function App() {
  const { screen } = useGameStore();

  return (
    <Web3Provider>
      <div className="relative w-full h-screen bg-[#05050A] text-white font-sans flex flex-col overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        {/* Global Navigation (Persists across screens) */}
        <Navbar />

        {/* The Game Canvas runs in the background */}
        <div className="absolute inset-0 z-10">
          <GameCanvas />
        </div>

        {/* UI Overlay Layers */}
        <div className="absolute inset-0 z-20 pointer-events-none pt-[73px]"> {/* padding top for navbar */}
          {screen === 'playing' && <MainJumpScreen />}
          {screen === 'title' && <TitleScreen />}
          {screen === 'gameover' && <GameOverScreen />}
          {screen === 'leaderboard' && <LeaderboardScreen />}
          {screen === 'garage' && <GarageScreen />}
        </div>
        
        <Footer />
      </div>
    </Web3Provider>
  );
}


import React, { useState } from 'react';
import { useDenim200msBlocks } from '../hooks/useDenim200msBlocks';
import { useSwitchChain, useChainId } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { baseVibenet } from '../lib/wagmi.config';
import { Zap, ChevronDown, Check, Activity } from 'lucide-react';

export function DenimStatusBadge() {
  const { blockNumber, blockIntervalMs, blocksPerSec, blockTag } = useDenim200msBlocks();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);

  const chains = [
    { id: base.id, name: 'Base Mainnet', badge: 'Denim Live (200ms)', desc: 'Canonical 200ms Native Blocks (Mainnet)' },
    { id: baseSepolia.id, name: 'Base Sepolia', badge: 'Sepolia Testnet', desc: 'Denim Testnet (Active)' },
    { id: baseVibenet.id, name: 'Base Vibenet', badge: 'Vibenet Preview', desc: 'Experimental Testbed' },
  ];

  const currentChain = chains.find((c) => c.id === currentChainId) || chains[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-black/40 hover:bg-black/60 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl backdrop-blur-md transition-all text-left group"
        title="Base Denim 200ms Native Blocks Status"
      >
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute"></span>
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-white tracking-tight uppercase">
              {currentChain.name}
            </span>
            <span className="text-[9px] px-1 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-semibold">
              200ms
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/80">
            <span>
              #{blockNumber ? blockNumber.toString() : '...'}
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-0.5 text-emerald-400">
              <Activity className="w-2.5 h-2.5 inline" />
              {blockIntervalMs}ms ({blocksPerSec} blk/s)
            </span>
          </div>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors ml-1" />
      </button>

      {/* Network & Denim Migration Info Modal / Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-zinc-900/95 border border-white/10 rounded-2xl p-3 shadow-2xl backdrop-blur-xl z-50 space-y-3">
          <div className="border-b border-white/10 pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Base Denim Network
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {blockTag} state
              </span>
            </div>
            <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
              Canonical 200ms native blocks upgrade. Flashblocks &amp; 'pending' tags deprecated.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider">
              Switch Network
            </span>
            {chains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                  switchChain?.({ chainId: chain.id });
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                  chain.id === currentChainId
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-white'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent text-white/70'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{chain.name}</div>
                  <div className="text-[10px] text-white/40">{chain.desc}</div>
                </div>
                {chain.id === currentChainId && (
                  <Check className="w-4 h-4 text-cyan-400" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 text-[9px] font-mono text-white/40 flex justify-between items-center">
            <span>Canonical Block Rate: ~5 blk/s</span>
            <span>200ms/block</span>
          </div>
        </div>
      )}
    </div>
  );
}

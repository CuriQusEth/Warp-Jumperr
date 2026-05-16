import { create } from 'zustand';

export type GameScreen = 'title' | 'playing' | 'gameover' | 'leaderboard' | 'garage';

interface GameState {
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;
  
  distance: number;
  score: number;
  combo: number;
  warpEnergy: number;
  
  setStats: (stats: Partial<{ distance: number; score: number; combo: number; warpEnergy: number }>) => void;
  resetGame: () => void;
  
  // Wallet / Auth State (Mocked SIWE for preview)
  isWalletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: 'title',
  setScreen: (screen) => set({ screen }),
  
  distance: 0,
  score: 0,
  combo: 0,
  warpEnergy: 100,
  
  setStats: (stats) => set((state) => ({ ...state, ...stats })),
  resetGame: () => set({ distance: 0, score: 0, combo: 0, warpEnergy: 100, screen: 'playing' }),
  
  isWalletConnected: false,
  walletAddress: null,
  connectWallet: () => set({ isWalletConnected: true, walletAddress: '0x1234...ABCD' }),
  disconnectWallet: () => set({ isWalletConnected: false, walletAddress: null }),
}));

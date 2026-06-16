import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useSaveScore } from '../hooks/useSaveScore';
import { saveScoreViaMcp } from '../lib/baseMcp';
import { SaveScoreModal } from './SaveScoreModal';

interface SaveScoreButtonProps {
  score: number;
}

export function SaveScoreButton({ score }: SaveScoreButtonProps) {
  const { isConnected, address } = useAccount();
  const { saveScore, isPending, isSuccess, refetch } = useSaveScore(address as `0x${string}`);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [mcpData, setMcpData] = useState<{approvalUrl: string, requestId: string} | null>(null);
  const [mcpPending, setMcpPending] = useState(false);
  const [mcpSuccess, setMcpSuccess] = useState(false);

  const handleSave = async () => {
    if (isConnected) {
      saveScore(score);
    } else {
      try {
        setMcpPending(true);
        const data = await saveScoreViaMcp(score);
        if (data.approvalUrl) {
          setMcpData(data);
          setModalOpen(true);
        }
      } catch (err) {
        console.error("MCP Save Error:", err);
      } finally {
        setMcpPending(false);
      }
    }
  };

  const isSaving = isPending || mcpPending;
  const isDone = isSuccess || mcpSuccess;

  return (
    <>
      <button 
        onClick={handleSave}
        disabled={isSaving || isDone}
        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-tighter transition-all shadow-lg border
          ${isSaving 
             ? "bg-white/10 text-white/40 cursor-not-allowed border-white/10" 
             : isDone 
             ? "bg-green-500/20 text-green-400 border-green-500/50"
             : "bg-blue-600/80 text-white border-blue-500 hover:bg-blue-500"
          }`}
      >
        {isSaving ? "Saving..." : isDone ? "Score saved onchain ✓" : "Save Score"}
      </button>

      {modalOpen && mcpData && (
        <SaveScoreModal 
          approvalUrl={mcpData.approvalUrl}
          requestId={mcpData.requestId}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setMcpSuccess(true);
            setModalOpen(false);
            refetch(); // try to refetch using wagmi if possible
          }}
        />
      )}
    </>
  );
}

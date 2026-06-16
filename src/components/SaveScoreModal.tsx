import React, { useState } from 'react';

interface SaveScoreModalProps {
  approvalUrl: string;
  requestId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function SaveScoreModal({ approvalUrl, requestId, onClose, onSuccess }: SaveScoreModalProps) {
  const [status, setStatus] = useState<"pending" | "completed" | "failed">("pending");

  const checkStatus = async () => {
    try {
      const { pollStatus } = await import('../lib/baseMcp');
      const finalStatus = await pollStatus(requestId);
      setStatus(finalStatus);
      if (finalStatus === 'completed') {
        onSuccess();
      }
    } catch (e) {
      setStatus("failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-sm w-full space-y-6">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider text-center">
          Agent Approval
        </h3>
        
        {status === "pending" && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400 text-center">
              Please approve the transaction via your Base Account to record your score.
            </p>
            <a 
              href={approvalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors block text-center"
            >
              Approve Transaction →
            </a>
            <button 
              onClick={checkStatus}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-white transition-colors"
            >
              I Approved, Check Status
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-4">
            <p className="text-sm text-red-400 text-center">
              Transaction failed or was canceled.
            </p>
            <button 
              onClick={checkStatus}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-white transition-colors"
            >
              Retry Status Check
            </button>
          </div>
        )}

        {status === "completed" && (
          <div className="space-y-4">
            <p className="text-sm text-green-400 text-center">
              Score successfully recorded onchain!
            </p>
            <button 
              onClick={onClose}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-white transition-colors"
            >
              Close
            </button>
          </div>
        )}

        <button 
          onClick={onClose}
          className="w-full py-2 text-zinc-500 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { Address, Hex } from 'viem';

export function useERC8021Transaction() {
  const { sendTransaction, data: hash, isPending: isSending, error: sendError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const sendAttrTransaction = async ({ to, value, data }: { to: Address, value?: bigint, data?: Hex }) => {
    sendTransaction({
      to,
      value: value || 0n,
      data: data || "0x",
    });
  };

  return {
    sendTransaction: sendAttrTransaction,
    hash,
    isPending: isSending || isConfirming,
    isSuccess,
    error: sendError || receiptError
  };
}

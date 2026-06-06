import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { appendAttribution } from '../lib/erc8021';
import { Address, Hex } from 'viem';

export function useERC8021Transaction() {
  const { sendTransaction, data: hash, isPending: isSending, error: sendError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const sendAttrTransaction = async ({ to, value, data }: { to: Address, value?: bigint, data?: Hex }) => {
    // Append attribution to calldata, default to "0x" if no data is provided.
    const baseCalldata = data || "0x";
    const attributedCalldata = appendAttribution(baseCalldata) as Hex;

    sendTransaction({
      to,
      value: value || 0n,
      data: attributedCalldata,
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

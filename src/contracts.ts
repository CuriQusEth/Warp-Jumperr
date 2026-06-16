export const SCOREBOARD_ADDRESS = "0x5C00000000000000000000000000000000000000";

export const SCOREBOARD_ABI = [
  {
    "type": "function",
    "name": "recordScore",
    "inputs": [{ "name": "score", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getScore",
    "inputs": [{ "name": "player", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ScoreRecorded",
    "inputs": [
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "score", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  }
] as const;

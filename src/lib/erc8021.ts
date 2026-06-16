import { Attribution } from "ox/erc8021";

export const BUILDER_CODE    = "bc_jimjbehn"; 
export const DATA_SUFFIX     = Attribution.toDataSuffix({ codes: [BUILDER_CODE] });
export const DATA_SUFFIX_HEX = DATA_SUFFIX.slice(2); 

export function appendAttribution(calldata: string): string {
  // If no calldata, assume "0x"
  const cleanCalldata = calldata === "" || calldata === "0x" ? "" : (calldata.startsWith("0x") ? calldata.slice(2) : calldata);
  return `0x${cleanCalldata}${DATA_SUFFIX_HEX}`;
}

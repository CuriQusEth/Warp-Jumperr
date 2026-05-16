export const ERC8021_ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const ERC8021_BUILDER_CODE = "bc_jimjbehn";

/**
 * Appends ERC-8021 builder attribution to calldata.
 * This is a mocked implementation showing where attribution would be attached.
 */
export function appendAttribution(calldata: string): string {
  // In a real implementation, this would append the hex-encoded builder code to the transaction calldata.
  // Using simple string conversion to avoid Buffer dependency in browser build.
  let hexBuilderCode = "";
  for (let i = 0; i < ERC8021_BUILDER_CODE.length; i++) {
    hexBuilderCode += ERC8021_BUILDER_CODE.charCodeAt(i).toString(16);
  }
  return `${calldata}${hexBuilderCode}`;
}

export function tokensToLamports(tokens: number, decimals = 8) {
  return Math.floor(tokens * Math.pow(10, decimals)); // Convert to integer
}

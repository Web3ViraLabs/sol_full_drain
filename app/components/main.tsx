"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import Transfer from "./transfer";

// ? This page checks if solana wallet is connected or not, if connected it will render transfer.tsx component else login button which opens login modal

const Main = () => {
  const { setVisible } = useWalletModal();
  const { publicKey, connected: solanaConnected, disconnect } = useWallet();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (solanaConnected) {
      setConnected(true);
      return;
    }
    setConnected(false);
  }, [solanaConnected, publicKey]);

  if (!connected || publicKey === undefined) {
    return (
      <button
        className="px-8 py-2 bg-blue-500 rounded-lg"
        onClick={() => setVisible(true)}
      >
        Connect your wallet
      </button>
    );
  }

  console.log(connected, publicKey?.toBase58());

  return (
    <div className="flex gap-x-4">
      <Transfer />
      <button
        className="px-4 py-2 bg-blue-500 rounded-lg"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
};

export default Main;

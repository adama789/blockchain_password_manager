import { Connection } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { network, opts } from "./config";

export const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  return new AnchorProvider(connection, window.solana, opts);
};

export const connectWallet = async () => {
  if (window.solana && window.solana.isPhantom) {
    const resp = await window.solana.connect();
    return resp.publicKey.toString();
  } else {
    throw new Error("Phantom Wallet not found");
  }
};
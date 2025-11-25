import { Connection } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { network, opts } from "./config";
import toast from "react-hot-toast";

export const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  return new AnchorProvider(connection, window.solana, opts);
};

export const connectWallet = async () => {
  if (window.solana && window.solana.isPhantom) {
    const resp = await window.solana.connect();
    return resp.publicKey.toString();
  } else {
    window.open("https://phantom.app/", "_blank");
    toast.error("Phantom Wallet not detected. Please install it to proceed.");
    return;
  }
};
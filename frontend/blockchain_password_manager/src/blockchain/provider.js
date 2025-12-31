/**
 * Utility functions for Solana wallet integration and Anchor provider setup.
 */
import { Connection } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { network, opts } from "./config";
import toast from "react-hot-toast";

/**
 * Creates and returns an AnchorProvider instance.
 * * The Provider combines:
 * 1. A Connection (how to talk to the blockchain).
 * 2. A Wallet (who is signing the transactions).
 * * @returns {AnchorProvider} The provider used to interact with the smart program.
 */
export const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  
  // 'window.solana' is the global object injected by the Phantom browser extension.
  // Note: For production, you may want to use @solana/wallet-adapter-react for better compatibility.
  return new AnchorProvider(connection, window.solana, opts);
};

/**
 * Initiates a connection with the Phantom Wallet extension.
 * * - Checks if the Phantom extension is installed.
 * - Requests the user to grant permission to access their public key.
 * - If not found, redirects the user to the Phantom download page.
 * * @returns {Promise<string | undefined>} The Base58 public key string if successful.
 */
export const connectWallet = async () => {
  // Check if 'solana' exists in the browser window and if it is the Phantom provider
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      return resp.publicKey.toString();
    } catch (err) {
      console.error("User rejected the connection request", err);
      toast.error("Connection request rejected.");
      return;
    }
  } else {
    // Redirect user to install the wallet if it's missing
    window.open("https://phantom.app/", "_blank");
    toast.error("Phantom Wallet not detected. Please install it to proceed.");
    return;
  }
};
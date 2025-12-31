/**
 * Configuration and constants for connecting to the 
 * Blockchain Password Manager on Solana.
 */
import { PublicKey } from "@solana/web3.js";
import idl from "./blockchain_password_manager.json";

/**
 * The unique Program ID (Public Key) derived from the IDL file.
 * This identifies your specific deployed program on the network.
 */
export const programID = new PublicKey(idl.address);

/**
 * The RPC (Remote Procedure Call) endpoint.
 * "http://127.0.0.1:8899" points to a local Solana validator (Localhost).
 * For production, you would change this to a Devnet or Mainnet-beta URL.
 */
export const network = "http://127.0.0.1:8899";

/**
 * Options defining how transactions are processed and confirmed.
 * 'confirmed' ensures the transaction has been voted on by a supermajority 
 * of the cluster, providing a good balance between speed and security.
 */
export const opts = {
  preflightCommitment: "confirmed", // Strategy for simulation before sending
  commitment: "confirmed",          // Level of finality required for state queries
};
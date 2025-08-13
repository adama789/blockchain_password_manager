import { PublicKey } from "@solana/web3.js";
import idl from "./blockchain_password_manager.json";

export const programID = new PublicKey(idl.address);
export const network = "http://127.0.0.1:8899";
export const opts = {
  preflightCommitment: "confirmed",
  commitment: "confirmed",
};
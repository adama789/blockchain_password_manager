import { Program, utils, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { programID } from "./config";
import idl from "./blockchain_password_manager.json";
import { getProvider } from "./provider";

export const getVaultPda = (wallet) =>
  PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("vault"), wallet.toBuffer()],
    programID
  );

export const initializeVault = async (vaultPda, vaultBump) => {
  const provider = getProvider();
  const program = new Program(idl, provider);

  return program.methods
    .initializeVault(vaultBump)
    .accounts({
      vault: vaultPda,
      user: provider.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
};

export const addEntry = async (vaultPda, title, username, password) => {
  const provider = getProvider();
  const program = new Program(idl, provider);

  return program.methods
    .addEntry(title, username, password)
    .accounts({
      vault: vaultPda,
      user: provider.wallet.publicKey,
    })
    .rpc();
};

export const fetchEntries = async (vaultPda) => {
  const provider = getProvider();
  const program = new Program(idl, provider);
  const vaultAccount = await program.account.passwordVault.fetch(vaultPda);
  return vaultAccount.entries;
};
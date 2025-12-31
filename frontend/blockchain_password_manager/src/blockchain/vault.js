/**
 * API module for interacting with the Blockchain Password Manager program.
 * Contains logic for account derivation (PDAs) and CRUD operations.
 */
import { Program, utils, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { programID } from "./config";
import idl from "./blockchain_password_manager.json";
import { getProvider } from "./provider";

/**
 * Derives the Program Derived Address (PDA) for a user's vault.
 * This is a deterministic address based on the user's public key and the "vault" seed.
 * * @param {PublicKey} wallet - The user's public key.
 * @returns {[PublicKey, number]} The PDA and its corresponding bump seed.
 */
export const getVaultPda = (wallet) =>
  PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("vault"), wallet.toBuffer()],
    programID
  );

/**
 * Checks if a vault account has already been initialized on the blockchain.
 * * @param {PublicKey} vaultPda - The derived address of the vault.
 * @returns {Promise<boolean>} True if the account exists, false otherwise.
 */
export const vaultExists = async (vaultPda) => {
  const provider = getProvider();
  const program = new Program(idl, provider);
  const vaultAccount = await program.account.passwordVault.fetchNullable(vaultPda);
  return vaultAccount !== null;
};

/**
 * Initializes a new PasswordVault account on-chain.
 * * @param {PublicKey} vaultPda - The PDA to be initialized.
 * @param {number} vaultBump - The bump seed for the PDA.
 * @param {string} masterPassword - The plaintext password to be hashed and stored.
 */
export const initializeVault = async (vaultPda, vaultBump, masterPassword) => {
  const provider = getProvider();
  const program = new Program(idl, provider);

  return program.methods
    .initializeVault(vaultBump, masterPassword)
    .accounts({
      vault: vaultPda,
      user: provider.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();
};

/**
 * Adds a new credential entry to the vault.
 */
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

/**
 * Updates an existing password entry at a specific index.
 */
export const updateEntry = async (vaultPda, index, newTitle, newUsername, newPassword) => {
  const provider = getProvider();
  const program = new Program(idl, provider);

  return program.methods
    .updateEntry(index, newTitle, newUsername, newPassword)
    .accounts({
      vault: vaultPda,
      user: provider.wallet.publicKey,
    })
    .rpc();
};

/**
 * Removes an entry from the vault and triggers account compaction on-chain.
 */
export const deleteEntry = async (vaultPda, index) => {
  const provider = getProvider();
  const program = new Program(idl, provider);

  return program.methods
    .deleteEntry(index)
    .accounts({
      vault: vaultPda,
      user: provider.wallet.publicKey,
    })
    .rpc();
};

/**
 * Retrieves all password entries stored in the vault.
 * @returns {Promise<Array>} List of entry objects {title, username, password}.
 */
export const fetchEntries = async (vaultPda) => {
  const provider = getProvider();
  const program = new Program(idl, provider);
  const vaultAccount = await program.account.passwordVault.fetch(vaultPda);
  return vaultAccount.entries;
};

/**
 * Retrieves the stored SHA-256 hash of the master password.
 * This can be used for local verification before allowing sensitive UI actions.
 */
export const fetchVaultHash = async (vaultPda) => {
  const provider = getProvider();
  const program = new Program(idl, provider);
  const vaultAccount = await program.account.passwordVault.fetch(vaultPda);
  return vaultAccount.masterHash;
};
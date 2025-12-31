import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BlockchainPasswordManager } from "../target/types/blockchain_password_manager";
import { expect } from "chai";

describe("blockchain_password_manager", () => {
  // Configure the client to use the local cluster or the provider defined in Anchor.toml
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .BlockchainPasswordManager as Program<BlockchainPasswordManager>;

  // Use the wallet public key from the provider as the test user
  const user = provider.wallet.publicKey;

  let vaultPda: anchor.web3.PublicKey;
  let bump: number;

  const MASTER_PASSWORD = "mojeHasloGlowne123!@#";

  /**
   * Before running tests, derive the Program Derived Address (PDA) for the vault.
   * The PDA is seeded with the string "vault" and the user's public key,
   * ensuring each user has exactly one unique vault.
   */
  before(async () => {
    [vaultPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), user.toBuffer()],
      program.programId
    );
  });

  it("Initializes the vault", async () => {
    // Call the initialize instruction to create the account on-chain
    await program.methods
      .initializeVault(bump, MASTER_PASSWORD)
      .accounts({
        vault: vaultPda,
        user,
      })
      .rpc();

    // Fetch the account data from the blockchain
    const vault = await program.account.passwordVault.fetch(vaultPda);

    // Verify that the owner matches the signer and the vault is empty
    expect(vault.owner.toBase58()).to.equal(user.toBase58());
    expect(vault.entries.length).to.equal(0);
  });

  it("Adds an entry", async () => {
    const title = "Email";
    const username = "adam.cedro@mat.umk.pl";
    const password = "secret123";

    await program.methods
      .addEntry(title, username, password)
      .accounts({
        vault: vaultPda,
        user,
      })
      .rpc();

    const vault = await program.account.passwordVault.fetch(vaultPda);

    // Assert the entry was pushed into the vector correctly
    expect(vault.entries.length).to.equal(1);
    expect(vault.entries[0].title).to.equal(title);
    expect(vault.entries[0].username).to.equal(username);
  });

  it("Updates an entry", async () => {
    const updatedTitle = "Email-updated";
    
    // Update the entry at index 0
    await program.methods
      .updateEntry(
        0,
        updatedTitle,
        "user2@example.com",
        "pass999"
      )
      .accounts({
        vault: vaultPda,
        user,
      })
      .rpc();

    const vault = await program.account.passwordVault.fetch(vaultPda);

    // Verify changes were applied
    expect(vault.entries[0].title).to.equal(updatedTitle);
  });

  it("Deletes an entry", async () => {
    // Remove the entry at index 0
    await program.methods
      .deleteEntry(0)
      .accounts({
        vault: vaultPda,
        user,
      })
      .rpc();

    const vault = await program.account.passwordVault.fetch(vaultPda);

    // Verify the vector is empty again
    expect(vault.entries.length).to.equal(0);
  });

  it("Fails when index is invalid", async () => {
    let failed = false;

    try {
      // Attempt to delete an entry that does not exist (index 99)
      await program.methods
        .deleteEntry(99)
        .accounts({
          vault: vaultPda,
          user,
        })
        .rpc();
    } catch (e) {
      failed = true;
    }

    expect(failed).to.be.true;
  });
});
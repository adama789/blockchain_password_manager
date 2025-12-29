import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BlockchainPasswordManager } from "../target/types/blockchain_password_manager";
import { expect } from "chai";

describe("blockchain_password_manager", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .BlockchainPasswordManager as Program<BlockchainPasswordManager>;

  const user = provider.wallet.publicKey;

  let vaultPda: anchor.web3.PublicKey;
  let bump: number;

  const MASTER_PASSWORD = "mojeHasloGlowne123!@#";

  before(async () => {
    [vaultPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), user.toBuffer()],
      program.programId
    );
  });

  it("Initializes the vault", async () => {
    await program.methods
      .initializeVault(bump, MASTER_PASSWORD)
      .accounts({
        vault: vaultPda,
        user,
      })
      .rpc();

    const vault = await program.account.passwordVault.fetch(vaultPda);

    expect(vault.owner.toBase58()).to.equal(user.toBase58());
    expect(vault.entries.length).to.equal(0);
  });

  it("Adds an entry", async () => {
    await program.methods
      .addEntry("Email", "adam.cedro@mat.umk.pl", "secret123")
      .accounts({
        vault: vaultPda,
        user,
      })
      .rpc();

    const vault = await program.account.passwordVault.fetch(vaultPda);

    expect(vault.entries.length).to.equal(1);
    expect(vault.entries[0].title).to.equal("Email");
  });

  it("Updates an entry", async () => {
    await program.methods
      .updateEntry(
        0,
        "Email-updated",
        "user2@example.com",
        "pass999"
      )
      .accounts({
        vault: vaultPda,
        user,
      })
      .rpc();

    const vault = await program.account.passwordVault.fetch(vaultPda);

    expect(vault.entries[0].title).to.equal("Email-updated");
  });

  it("Deletes an entry", async () => {
    await program.methods
      .deleteEntry(0)
      .accounts({
        vault: vaultPda,
        user,
      })
      .rpc();

    const vault = await program.account.passwordVault.fetch(vaultPda);

    expect(vault.entries.length).to.equal(0);
  });

  it("Fails when index is invalid", async () => {
    let failed = false;

    try {
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

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BlockchainPasswordManager } from "../target/types/blockchain_password_manager";

describe("blockchain_password_manager", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BlockchainPasswordManager as Program<BlockchainPasswordManager>;

  let vaultAccount: anchor.web3.Keypair;

  it("Initializes an account with a value", async () => {
    vaultAccount = anchor.web3.Keypair.generate();

    const tx = await program.methods
      .initializeVault()
      .accounts({
        vault: vaultAccount.publicKey,
        user: provider.wallet.publicKey,
        // systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([vaultAccount])
      .rpc();

    console.log("Your transaction signature", tx);

    const fetchedVault = await program.account.passwordVault.fetch(vaultAccount.publicKey);
    console.log("Fetched owner:", fetchedVault.owner.toBase58());
    console.log("Fetched entries:", fetchedVault.entries);
  });
  
  it("Adds an entry to the vault", async () => {
    const title = "My Email";
    const username = "me@example.com";
    const password = "supersecretpassword";

    const tx = await program.methods
      .addEntry(title, username, password)
      .accounts({
        vault: vaultAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    console.log("Entry added, tx:", tx);

    const vault = await program.account.passwordVault.fetch(vaultAccount.publicKey);
    console.log("Vault entries:", vault.entries);
  });
});

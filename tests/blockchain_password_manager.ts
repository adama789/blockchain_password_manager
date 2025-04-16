import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Myproject } from "../target/types/blockchain_password_manager";

describe("myproject", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.myproject as Program<Myproject>;

  it("Initializes an account with a value", async () => {
    const account = anchor.web3.Keypair.generate();

    const tx = await program.methods
      .initialize()
      .accounts({
        initialAccount: account.publicKey,
        user: provider.wallet.publicKey,
        // systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([account])
      .rpc();

    console.log("Your transaction signature", tx);

    const fetchedValue = await program.account.init.fetch(account.publicKey);
    console.log("Fetched value:", fetchedValue.value.toString());
  });
});
import React, { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3, utils } from "@coral-xyz/anchor";
import idl from "./blockchain_password_manager.json";
import "./App.css";

const programID = new PublicKey(idl.address);
const network = "http://127.0.0.1:8899";
const opts = {
  preflightCommitment: "confirmed",
  commitment: "confirmed",
};

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState([]);
  const [vaultPda, setVaultPda] = useState(null);
  const [vaultBump, setVaultBump] = useState(null);


  const connectWallet = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        const resp = await window.solana.connect();
        setWalletAddress(resp.publicKey.toString());

        const [vault, bump] = PublicKey.findProgramAddressSync(
          [utils.bytes.utf8.encode("vault"), resp.publicKey.toBuffer()],
          programID
        );
        setVaultPda(vault);
        setVaultBump(bump);
      } else {
        alert("Phantom Wallet not found! Install from https://phantom.app/");
      }
    } catch (err) {
      console.error("Wallet connect error:", err);
      alert(err.message);
    }
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    return new AnchorProvider(connection, window.solana, opts);
  };

  const initializeVault = async () => {
    if (!walletAddress) {
      alert("Connect wallet first!");
      return;
    }
    try {
      const provider = getProvider();

      const program = new Program(idl, provider);

      const tx = await program.methods
        .initializeVault(vaultBump)
        .accounts({
          vault: vaultPda,
          user: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      alert("✅ Vault initialized!");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  };

  const addEntry = async () => {
    if (!vaultPda) {
      alert("Vault not initialized yet!");
      return;
    }
    try {
      const provider = getProvider();
      const program = new Program(idl, provider);

      await program.methods
        .addEntry(title, username, password)
        .accounts({
          vault: vaultPda,
          user: provider.wallet.publicKey,
        })
        .rpc();

      alert("Entry added!");
      setTitle("");
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed: " + err.message);
    }
  };

  const fetchEntries = async () => {
    if (!vaultPda) {
      alert("Vault not initialized yet!");
      return;
    }
    try {
      const provider = getProvider();
      const program = new Program(idl, provider);

      const vaultAccount = await program.account.passwordVault.fetch(vaultPda);
      setEntries(vaultAccount.entries);
    } catch (err) {
      console.error(err);
      alert("Fetch failed: " + err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {!walletAddress ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <>
            <p>Connected: {walletAddress}</p>
            <button onClick={initializeVault}>Initialize Vault</button>

            <div style={{ marginTop: 20 }}>
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={addEntry}>Add Entry</button>
            </div>

            <div style={{ marginTop: 20 }}>
              <button onClick={fetchEntries}>Fetch Entries</button>
              <ul>
                {entries.map((e, i) => (
                  <li key={i}>
                    <b>{e.title}</b> — {e.username} / {e.password}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
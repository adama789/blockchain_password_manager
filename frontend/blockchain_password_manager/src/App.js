import React, { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils, BN } from '@project-serum/anchor';
import idl from './blockchain_password_manager.json'; // IDL wygenerowany przez Anchor
import './App.css';

const programID = new PublicKey(idl.address);
const network = "http://127.0.0.1:8899"; // solana-test-validator
const opts = { preflightCommitment: "processed" };

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState([]);
  const [vaultPda, setVaultPda] = useState(null);

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts);
    return provider;
  };

  const connectWallet = async () => {
    if (window.solana) {
      const res = await window.solana.connect();
      setWalletAddress(res.publicKey.toString());
    } else {
      alert("Wallet not found! Get Phantom Wallet!");
    }
  };

  const initializeVault = async () => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    const [vault] = await PublicKey.findProgramAddressSync (
      [utils.bytes.utf8.encode("vault"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods.initializeVault().accounts({
      vault,
      user: provider.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    }).rpc();

    setVaultPda(vault);
    alert("Vault initialized: " + vault.toString());
  };

  const addEntry = async () => {
    if (!vaultPda) {
      alert("Vault not initialized yet!");
      return;
    }

    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    await program.methods
      .addEntry(title, username, password)
      .accounts({
        vault: vaultPda,
        user: provider.wallet.publicKey
      })
      .rpc();

    alert("Entry added!");
  };

  const fetchEntries = async () => {
    if (!vaultPda) {
      alert("Vault not initialized yet!");
      return;
    }

    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    const vaultAccount = await program.account.passwordVault.fetch(vaultPda);
    setEntries(vaultAccount.entries);
  };

  return (
    <div className="App">
      <header className="App-header">
        {!walletAddress && (
          <button className="btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {walletAddress && (
          <div>
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
                    <b>{e.title}</b> - {e.username} / {e.password}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

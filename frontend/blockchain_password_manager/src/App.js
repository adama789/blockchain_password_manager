import React, { useState, useEffect } from "react";
import { connectWallet } from "./blockchain/provider";
import { getVaultPda, addEntry } from "./blockchain/vault";
import WalletConnect from "./components/WalletConnect";
import EntryForm from "./components/EntryForm";
import { Buffer } from "buffer";

window.Buffer = Buffer;

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [vaultPda, setVaultPda] = useState(null);
  const [vaultBump, setVaultBump] = useState(null);

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (window.solana?.isPhantom) {
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          setWalletAddress(resp.publicKey.toString());
          const [vault, bump] = getVaultPda(resp.publicKey);
          setVaultPda(vault);
          setVaultBump(bump);
        }
      } catch (err) {
        console.log("No wallet connection yet");
      }
    };
    checkWalletConnection();
  }, []);

  const handleConnect = async () => {
    const address = await connectWallet();
    setWalletAddress(address);
    const [vault, bump] = getVaultPda(window.solana.publicKey);
    setVaultPda(vault);
    setVaultBump(bump);
  };

  const handleAddEntry = async () => {
    if (!vaultPda) {
      alert("Vault not initialized!");
      return;
    }
    await addEntry(vaultPda, title, username, password);
    setTitle("");
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <WalletConnect onConnect={handleConnect} walletAddress={walletAddress} />
      {walletAddress && (
        <EntryForm
          title={title}
          username={username}
          password={password}
          setTitle={setTitle}
          setUsername={setUsername}
          setPassword={setPassword}
          onAdd={handleAddEntry}
        />
      )}
    </div>
  );
}

export default App;
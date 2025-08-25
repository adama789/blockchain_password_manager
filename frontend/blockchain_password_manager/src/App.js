import React, { useState, useEffect } from "react";
import { connectWallet } from "./blockchain/provider";
import { getVaultPda, initializeVault, addEntry, vaultExists, fetchVaultHash } from "./blockchain/vault";
import WalletConnect from "./components/WalletConnect";
import EntryForm from "./components/EntryForm";
import CryptoJS from "crypto-js";
import { Buffer } from "buffer";

window.Buffer = Buffer;

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [vaultPda, setVaultPda] = useState(null);
  const [vaultBump, setVaultBump] = useState(null);

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [masterPassword, setMasterPassword] = useState("");
  const [vaultInitialized, setVaultInitialized] = useState(false);
  const [masterVerified, setMasterVerified] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      try {
        if (window.solana?.isPhantom) {
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          setWalletAddress(resp.publicKey.toString());
          const [vault, bump] = getVaultPda(resp.publicKey);
          setVaultPda(vault);
          setVaultBump(bump);

          const exists = await vaultExists(vault);
          setVaultInitialized(exists);
        }
      } catch (err) {
        console.log("No wallet connection yet");
      }
    };
    checkWallet();
  }, []);

  const handleConnect = async () => {
    const address = await connectWallet();
    setWalletAddress(address);
    const [vault, bump] = getVaultPda(window.solana.publicKey);
    setVaultPda(vault);
    setVaultBump(bump);

    const exists = await vaultExists(vault);
    setVaultInitialized(exists);
  };

  const handleInitializeVault = async () => {
    if (!masterPassword) {
      alert("Set a master password!");
      return;
    }
    await initializeVault(vaultPda, vaultBump, masterPassword);
    setVaultInitialized(true);
    setMasterVerified(true);
    alert("Vault initialized! Remember your master password.");
  };

  const verifyMasterPassword = async () => {
    const storedHashArray = await fetchVaultHash(vaultPda);
    const storedHashHex = Array.from(storedHashArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const hashHex = CryptoJS.SHA256(masterPassword).toString();
    if (hashHex === storedHashHex) {
      setMasterVerified(true);
      alert("Master password correct!");
    } else {
      alert("Incorrect master password!");
    }
  };

  const handleAddEntry = async () => {
    if (!vaultPda || !vaultInitialized) return;
    if (!masterVerified) return alert("Enter correct master password!");

    const encryptedTitle = CryptoJS.AES.encrypt(title, masterPassword).toString();
    const encryptedUsername = CryptoJS.AES.encrypt(username, masterPassword).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, masterPassword).toString();
    await addEntry(vaultPda, encryptedTitle, encryptedUsername, encryptedPassword);

    setTitle("");
    setUsername("");
    setPassword("");
    alert("Entry added!");
  };

  return (
    <div>
      <WalletConnect onConnect={handleConnect} walletAddress={walletAddress} />

      {walletAddress && !vaultInitialized && (
        <div>
          <p>Set master password to initialize vault:</p>
          <input
            type="password"
            placeholder="Master password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
          />
          <button onClick={handleInitializeVault}>Initialize Vault</button>
        </div>
      )}

      {walletAddress && vaultInitialized && !masterVerified && (
        <div>
          <p>Enter master password to unlock vault:</p>
          <input
            type="password"
            placeholder="Master password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
          />
          <button onClick={verifyMasterPassword}>Verify</button>
        </div>
      )}

      {walletAddress && vaultInitialized && masterVerified && (
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

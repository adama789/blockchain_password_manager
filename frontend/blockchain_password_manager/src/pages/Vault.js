import { useState, useEffect } from "react";
import {
  getVaultPda,
  vaultExists,
  initializeVault,
  addEntry,
  fetchVaultHash,
  fetchEntries,
} from "../blockchain/vault";
import EntryForm from "../components/EntryForm";
import CryptoJS from "crypto-js";
import { Navigate } from "react-router-dom";
import { handleError } from "../utils/vaultErrors";

function Vault() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [vaultPda, setVaultPda] = useState(null);
  const [vaultBump, setVaultBump] = useState(null);

  const [masterPassword, setMasterPassword] = useState("");
  const [vaultInitialized, setVaultInitialized] = useState(false);
  const [masterVerified, setMasterVerified] = useState(false);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWallet = async () => {
      if (window.solana?.isPhantom) {
        try {
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          setWalletAddress(resp.publicKey.toString());
          const [vault, bump] = getVaultPda(resp.publicKey);
          setVaultPda(vault);
          setVaultBump(bump);

          const exists = await vaultExists(vault);
          setVaultInitialized(exists);
        } catch (err) {
          console.log("No wallet connected");
        }
      }
      setLoading(false);
    };
    checkWallet();
  }, []);

  const handleInitializeVault = async () => {
    if (!masterPassword) {
      return alert("Set a master password!");
    }

    try {
      await initializeVault(vaultPda, vaultBump, masterPassword);
      setVaultInitialized(true);
      setMasterVerified(true);
      alert("Vault initialized!");
    } catch (error) {
      handleError(error, "Vault initialization");
    }
  };

  const handleAddEntry = async (title, username, password) => {
    const encryptedTitle = CryptoJS.AES.encrypt(title, masterPassword).toString();
    const encryptedUsername = CryptoJS.AES.encrypt(username, masterPassword).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, masterPassword).toString();

    try {
      await addEntry(vaultPda, encryptedTitle, encryptedUsername, encryptedPassword);
      alert("Entry added!");
    } catch (error) {
      handleError(error, "Add entry");
    }
  };

  const verifyMasterPassword = async () => {
    try {
      const storedHashArray = await fetchVaultHash(vaultPda);
      if (!storedHashArray) {
        return alert("Vault not found. Please initialize it first.");
      }

      const storedHashHex = Array.from(storedHashArray)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const hashHex = CryptoJS.SHA256(masterPassword).toString();
      if (hashHex === storedHashHex) {
        setMasterVerified(true);
        alert("Master password correct!");
      } else {
        alert("Incorrect master password!");
      }
    } catch (error) {
      handleError(error, "Verify master password");
    }
  };

  const handleFetchEntries = async () => {
    try {
      const rawEntries = await fetchEntries(vaultPda);
      if (!rawEntries || rawEntries.length === 0) {
        return alert("No entries found in the vault.");
      }

      const decrypted = rawEntries.map((entry) => ({
        title: CryptoJS.AES.decrypt(entry.title, masterPassword).toString(CryptoJS.enc.Utf8),
        username: CryptoJS.AES.decrypt(entry.username, masterPassword).toString(CryptoJS.enc.Utf8),
        password: CryptoJS.AES.decrypt(entry.password, masterPassword).toString(CryptoJS.enc.Utf8),
      }));

      setEntries(decrypted);
    } catch (error) {
      handleError(error, "Fetch entries");
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!walletAddress) return <Navigate to="/" replace />;

  return (
    <div>
      <h2>Your Vault</h2>

      {!vaultInitialized && (
        <div>
          <p>Set master password to initialize vault:</p>
          <input
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
          />
          <button onClick={handleInitializeVault}>Initialize Vault</button>
        </div>
      )}

      {vaultInitialized && !masterVerified && (
        <div>
          <p>Enter master password:</p>
          <input
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
          />
          <button onClick={verifyMasterPassword}>Unlock</button>
        </div>
      )}

      {vaultInitialized && masterVerified && (
        <>
          <EntryForm onAdd={handleAddEntry} />
          <button onClick={handleFetchEntries}>Load Entries</button>

          <ul>
            {entries.map((e, i) => (
              <li key={i}>
                <b>{e.title}</b> – {e.username} / {e.password}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Vault;

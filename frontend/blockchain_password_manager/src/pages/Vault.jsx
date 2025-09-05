import { useState, useEffect } from "react";
import { useWallet } from "../blockchain/walletContext";
import {
  initializeVault,
  addEntry,
  fetchVaultHash,
  fetchEntries,
} from "../blockchain/vault";
import CryptoJS from "crypto-js";
import { handleError } from "../utils/vaultErrors";
import Layout from "./Layout";
import EntryForm from "../components/EntryForm";

function Vault() {
  const { walletAddress, vaultPda, vaultBump } = useWallet();
  const [masterPassword, setMasterPassword] = useState("");
  const [vaultInitialized, setVaultInitialized] = useState(false);
  const [masterVerified, setMasterVerified] = useState(false);
  const [entries, setEntries] = useState([]);
  const [vaultChecked, setVaultChecked] = useState(false);

  useEffect(() => {
    const checkVault = async () => {
      if (!vaultPda) return;
      try {
        const storedHashArray = await fetchVaultHash(vaultPda);
        if (storedHashArray) setVaultInitialized(true);
      } catch {
        console.log("No vault found yet");
      } finally {
        setVaultChecked(true);
      }
    };
    checkVault();
  }, [vaultPda]);

  const handleInitializeVault = async () => {
    if (!masterPassword) return alert("Set a master password!");
    try {
      await initializeVault(vaultPda, vaultBump, masterPassword);
      setVaultInitialized(true);
      setMasterVerified(true);
      alert("Vault initialized!");
    } catch (error) {
      handleError(error, "Vault initialization");
    }
  };

  const verifyMasterPassword = async () => {
    try {
      const storedHashArray = await fetchVaultHash(vaultPda);
      if (!storedHashArray) return alert("Vault not found. Please initialize it first.");
      const storedHashHex = Array.from(storedHashArray)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const hashHex = CryptoJS.SHA256(masterPassword).toString();
      if (hashHex === storedHashHex) {
        setMasterVerified(true);
        alert("Master password correct!");
      } else alert("Incorrect master password!");
    } catch (error) {
      handleError(error, "Verify master password");
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

  const handleFetchEntries = async () => {
    try {
      const rawEntries = await fetchEntries(vaultPda);
      if (!rawEntries || rawEntries.length === 0)
        return alert("No entries found in the vault.");
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

  if (!vaultChecked) {
    return (
      <Layout>
      </Layout>
    );
  }

  return (
    <Layout walletAddress={walletAddress}>
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">
          Your Vault
        </h2>
      </header>

      <div className="max-w-6xl mx-auto space-y-12">
        {!vaultInitialized && (
          <div className="bg-white/5 backdrop-blur-xl border border-primary/30 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <p className="mb-4 text-sm text-gray-300">
              Set master password to initialize vault:
            </p>
            <input
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="w-full rounded-xl bg-dark/70 border border-primary/30 p-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-accent shadow-inner"
            />
            <button
              onClick={handleInitializeVault}
              className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-bold py-2 rounded-xl shadow-md transition"
            >
              Initialize Vault
            </button>
          </div>
        )}

        {vaultInitialized && !masterVerified && (
          <div className="bg-white/5 backdrop-blur-xl border border-secondary/30 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <p className="mb-4 text-sm text-gray-300">Enter master password:</p>
            <input
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="w-full rounded-xl bg-dark/70 border border-secondary/30 p-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-secondary shadow-inner"
            />
            <button
              onClick={verifyMasterPassword}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-2 rounded-xl shadow-md transition"
            >
              Unlock
            </button>
          </div>
        )}

        {vaultInitialized && masterVerified && (
          <div className="space-y-12">
            <div className="bg-white/5 backdrop-blur-xl border border-secondary/30 rounded-2xl p-8 shadow-lg">
              <EntryForm onAdd={handleAddEntry} />
              <button
                onClick={handleFetchEntries}
                className="mt-6 w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-bold py-2 rounded-xl shadow-md transition"
              >
                Load Entries
              </button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((e, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-lg border border-secondary/30 rounded-2xl p-6 shadow-md hover:shadow-glow hover:scale-[1.02] transition transform flex flex-col justify-between"
                >
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary mb-3">
                    {e.title}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-300 text-sm flex items-center gap-2">
                      <span className="text-accent">👤</span>
                      <span className="font-semibold text-white">Username:</span>{" "}
                      {e.username}
                    </p>
                    <p className="text-gray-300 text-sm flex items-center gap-2">
                      <span className="text-primary">🔒</span>
                      <span className="font-semibold text-white">Password:</span>{" "}
                      {e.password}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Vault;

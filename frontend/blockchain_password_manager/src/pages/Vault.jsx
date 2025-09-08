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
import { Eye, EyeOff, User, Lock } from "lucide-react";
import SpotlightCard from "../components/ReactBits/SpotlightCard/SpotlightCard";

function Vault() {
  const { walletAddress, vaultPda, vaultBump } = useWallet();
  const [masterPassword, setMasterPassword] = useState("");
  const [vaultInitialized, setVaultInitialized] = useState(false);
  const [masterVerified, setMasterVerified] = useState(false);
  const [entries, setEntries] = useState([]);
  const [vaultChecked, setVaultChecked] = useState(false);
  const [revealed, setRevealed] = useState({});

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
      if (!storedHashArray)
        return alert("Vault not found. Please initialize it first.");
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
      setRevealed({});
    } catch (error) {
      handleError(error, "Fetch entries");
    }
  };

  const toggleCard = (index) => {
    setRevealed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!vaultChecked) {
    return <Layout />;
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
          <div className="bg-light backdrop-blur-xl border border-primary/30 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <p className="mb-4 text-gray-300">
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
          <div className="bg-light backdrop-blur-xl border border-primary/30 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <p className="mb-4 text-gray-300">Enter master password:</p>
            <input
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="w-full rounded-xl bg-dark/70 border border-primary/30 p-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-secondary shadow-inner"
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
            <div className="bg-light backdrop-blur-xl border border-primary/30 rounded-2xl p-8 shadow-lg">
              <EntryForm onAdd={handleAddEntry} />
              <button
                onClick={handleFetchEntries}
                className="mt-6 w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-bold py-2 rounded-xl shadow-md transition"
              >
                Load Entries
              </button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((e, i) => {
                const isRevealed = revealed[i];

                return !isRevealed ? (
                  <SpotlightCard
                    key={i}
                    className="relative bg-light border border-primary/30 
                               rounded-2xl p-6 shadow-md transition transform 
                               hover:scale-[1.02] min-h-[220px] 
                               flex flex-col justify-center items-center"
                    spotlightColor="rgba(168,85,247,0.6)"
                  >
                    <h4 className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4">
                      {e.title}
                    </h4>
                    <button
                      onClick={() => toggleCard(i)}
                      className="p-4 rounded-full bg-gradient-to-r from-accent to-primary 
                                 hover:shadow-glow transition transform hover:scale-110"
                    >
                      <Eye className="w-6 h-6 text-white" />
                    </button>
                  </SpotlightCard>
                ) : (
                  <div
                    key={i}
                    className="relative bg-light border border-primary/30
                               rounded-2xl p-6 shadow-md transition transform 
                               hover:scale-[1.02] min-h-[220px] 
                               flex flex-col justify-between animate-fadeIn"
                  >
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                      {e.title}
                    </h3>
                    <div className="space-y-2 mt-3">
                      <p className="flex items-center gap-2 text-gray-200">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-white">Username:</span> {e.username}
                      </p>
                      <p className="flex items-center gap-2 text-gray-200">
                        <Lock className="w-4 h-4 text-accent" />
                        <span className="font-semibold text-white">Password:</span> {e.password}
                      </p>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => toggleCard(i)}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-primary to-accent 
                                   text-white text-xs font-medium shadow-md hover:opacity-90"
                      >
                        <EyeOff className="w-4 h-4 inline mr-1" />
                        Hide
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Vault;

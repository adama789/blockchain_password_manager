import { useState, useEffect, useRef } from "react";
import { useWallet } from "../../blockchain/walletContext";
import {
  initializeVault,
  addEntry,
  fetchVaultHash,
  fetchEntries,
} from "../../blockchain/vault";
import CryptoJS from "crypto-js";
import { handleError } from "../../utils/vaultErrors";

import VaultHeader from "./VaultHeader";
import VaultInitForm from "./VaultInitForm";
import VaultUnlockForm from "./VaultUnlockForm";
import VaultEntryForm from "./VaultEntryForm";
import VaultEntryList from "./VaultEntryList";

function VaultContainer() {
  const { vaultPda, vaultBump } = useWallet();
  const [masterPassword, setMasterPassword] = useState("");
  const [vaultInitialized, setVaultInitialized] = useState(false);
  const [masterVerified, setMasterVerified] = useState(false);
  const [entries, setEntries] = useState([]);
  const [vaultChecked, setVaultChecked] = useState(false);
  const [revealed, setRevealed] = useState({});
  const [copied, setCopied] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const copyTimeout = useRef(null);

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

  useEffect(() => {
    if (masterVerified) {
      const fetchEntriesOnUnlock = async () => {
        try {
          const rawEntries = await fetchEntries(vaultPda);
          if (!rawEntries || rawEntries.length === 0) return;
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
      fetchEntriesOnUnlock();
    }
  }, [masterVerified, vaultPda, masterPassword]);

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
      const rawEntries = await fetchEntries(vaultPda);
      if (!rawEntries || rawEntries.length === 0) return;
      const decrypted = rawEntries.map((entry) => ({
        title: CryptoJS.AES.decrypt(entry.title, masterPassword).toString(CryptoJS.enc.Utf8),
        username: CryptoJS.AES.decrypt(entry.username, masterPassword).toString(CryptoJS.enc.Utf8),
        password: CryptoJS.AES.decrypt(entry.password, masterPassword).toString(CryptoJS.enc.Utf8),
      }));
      setEntries(decrypted);
      setRevealed({});
    } catch (error) {
      handleError(error, "Add entry");
    }
  };

  const toggleCard = (index) => {
    setRevealed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);

    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopied(null), 2000);
  };

  const togglePassword = (index) => {
    setShowPassword((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!vaultChecked) return null;

  return (
    <>
      <VaultHeader />

      <div className="max-w-6xl mx-auto space-y-12">
        {!vaultInitialized && (
          <VaultInitForm
            masterPassword={masterPassword}
            setMasterPassword={setMasterPassword}
            handleInitializeVault={handleInitializeVault}
          />
        )}

        {vaultInitialized && !masterVerified && (
          <VaultUnlockForm
            masterPassword={masterPassword}
            setMasterPassword={setMasterPassword}
            verifyMasterPassword={verifyMasterPassword}
          />
        )}

        {vaultInitialized && masterVerified && (
          <div className="space-y-12">
            <div className="bg-light backdrop-blur-xl border border-primary/30 rounded-2xl p-8 shadow-lg">
              <VaultEntryForm onAdd={handleAddEntry} />
            </div>
            <VaultEntryList
              entries={entries}
              revealed={revealed}
              toggleCard={toggleCard}
              copied={copied}
              handleCopy={handleCopy}
              showPassword={showPassword}
              togglePassword={togglePassword}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default VaultContainer;

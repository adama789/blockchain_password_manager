import { useState, useEffect, useRef } from "react";
import { useWallet } from "../../blockchain/walletContext";
import {
  initializeVault,
  addEntry,
  fetchVaultHash,
  fetchEntries,
  updateEntry,
  deleteEntry
} from "../../blockchain/vault";
import CryptoJS from "crypto-js";
import { handleError } from "../../utils/vaultErrors";
import { isStrongPassword } from "../../utils/validation";

import VaultHeader from "./VaultHeader";
import VaultEntryForm from "./VaultEntryForm";
import VaultEntryList from "./VaultEntryList";
import VaultEmpty from "./VaultEmpty";
import VaultSearchEntries from "./VaultSearchEntries";
import VaultAuth from "./VaultAuth";
import toast from "react-hot-toast";

/**
 * Main container component for the Password Manager.
 * Handles the logic for:
 * 1. Detecting if a vault exists on the blockchain.
 * 2. Authenticating the user via Master Password (SHA-256 hash comparison).
 * 3. Encrypting/Decrypting credentials using AES-256.
 * 4. Performing CRUD operations on the Solana blockchain.
 */
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
  const [searchQuery, setSearchQuery] = useState("");
  const copyTimeout = useRef(null);

  /**
   * Effect: Initial check to see if the user has an initialized vault on-chain.
   * Fetches the master password hash to confirm vault existence.
   */
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

  /**
   * Effect: Automatically fetches and decrypts entries once the master password is verified.
   */
  useEffect(() => {
    if (masterVerified) {
      const fetchEntriesOnUnlock = async () => {
        try {
          const rawEntries = await fetchEntries(vaultPda);
          if (!rawEntries || rawEntries.length === 0) return;
          
          // Decrypt fields locally using the Master Password
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

  /**
   * Creates a new vault account on the Solana blockchain.
   * Validates password strength before proceeding.
   */
  const handleInitializeVault = async () => {
    toast.dismiss();
    if (!masterPassword) return toast.error("Set a master password!");

    if (!isStrongPassword(masterPassword)) {
      return toast.error("Master password must be strong!");
    }

    try {
      await initializeVault(vaultPda, vaultBump, masterPassword);
      setVaultInitialized(true);
      setMasterVerified(true);
      toast.success("Vault initialized successfully!");
    } catch (error) {
      handleError(error, "Vault initialization");
    }
  };

  /**
   * Verifies the provided Master Password against the SHA-256 hash stored on-chain.
   */
  const verifyMasterPassword = async () => {
    toast.dismiss();
    try {
      const storedHashArray = await fetchVaultHash(vaultPda);
      if (!storedHashArray)
        return toast.error("Vault not found. Please initialize it first.");

      // Convert Uint8Array hash from Solana to Hex string
      const storedHashHex = Array.from(storedHashArray)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      
      const hashHex = CryptoJS.SHA256(masterPassword).toString();

      if (hashHex === storedHashHex) {
        setMasterVerified(true);
        toast.success("Welcome back! Vault unlocked.");
      } else {
        toast.error("Master password incorrect.");
      }
    } catch (error) {
      handleError(error, "Verify master password");
    }
  };

  /**
   * Encrypts and adds a new password entry to the blockchain.
   */
  const handleAddEntry = async (title, username, password) => {
    toast.dismiss();
    const encryptedTitle = CryptoJS.AES.encrypt(title, masterPassword).toString();
    const encryptedUsername = CryptoJS.AES.encrypt(username, masterPassword).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, masterPassword).toString();
    
    try {
      await addEntry(vaultPda, encryptedTitle, encryptedUsername, encryptedPassword);
      toast.success("Entry added to Vault!");
      
      // Refresh entries after addition
      const rawEntries = await fetchEntries(vaultPda);
      const decrypted = rawEntries.map((entry) => ({
        title: CryptoJS.AES.decrypt(entry.title, masterPassword).toString(CryptoJS.enc.Utf8),
        username: CryptoJS.AES.decrypt(entry.username, masterPassword).toString(CryptoJS.enc.Utf8),
        password: CryptoJS.AES.decrypt(entry.password, masterPassword).toString(CryptoJS.enc.Utf8),
      }));
      setEntries(decrypted);
    } catch (error) {
      handleError(error, "Add entry");
    }
  };

  /**
   * Updates an existing entry by index with newly encrypted data.
   */
  const handleUpdateEntry = async (index, newData) => {
    toast.dismiss();
    const encryptedTitle = CryptoJS.AES.encrypt(newData.title, masterPassword).toString();
    const encryptedUsername = CryptoJS.AES.encrypt(newData.username, masterPassword).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(newData.password, masterPassword).toString();

    try {
      await updateEntry(vaultPda, index, encryptedTitle, encryptedUsername, encryptedPassword);
      toast.success("Entry updated!");

      const rawEntries = await fetchEntries(vaultPda);
      const decrypted = rawEntries.map((entry) => ({
        title: CryptoJS.AES.decrypt(entry.title, masterPassword).toString(CryptoJS.enc.Utf8),
        username: CryptoJS.AES.decrypt(entry.username, masterPassword).toString(CryptoJS.enc.Utf8),
        password: CryptoJS.AES.decrypt(entry.password, masterPassword).toString(CryptoJS.enc.Utf8),
      }));
      setEntries(decrypted);
    } catch (error) {
      handleError(error, "Update entry");
    }
  };

  /**
   * Deletes an entry from the on-chain vector.
   */
  const handleDeleteEntry = async (index) => {
    toast.dismiss();
    try {
      await deleteEntry(vaultPda, index);
      toast.success("Entry deleted!");

      const rawEntries = await fetchEntries(vaultPda);
      const decrypted = rawEntries.map((entry) => ({
        title: CryptoJS.AES.decrypt(entry.title, masterPassword).toString(CryptoJS.enc.Utf8),
        username: CryptoJS.AES.decrypt(entry.username, masterPassword).toString(CryptoJS.enc.Utf8),
        password: CryptoJS.AES.decrypt(entry.password, masterPassword).toString(CryptoJS.enc.Utf8),
      }));
      setEntries(decrypted);
    } catch (error) {
      handleError(error, "Delete entry");
    }
  };

  const toggleCard = (index) => {
    setRevealed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  /**
   * Copies text to clipboard and manages a temporary 'copied' status.
   */
  const handleCopy = (text, key) => {
    toast.dismiss();
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success("Copied to clipboard!");

    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopied(null), 4000);
  };

  const togglePassword = (index) => {
    setShowPassword((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!vaultChecked) return null;

  return (
    <div className="text-accent">
      <VaultHeader masterVerified={masterVerified} />
      <div className="max-w-6xl mx-auto space-y-12">
        {!masterVerified && (
          <VaultAuth 
            vaultInitialized={vaultInitialized}
            masterVerified={masterVerified}
            masterPassword={masterPassword}
            setMasterPassword={setMasterPassword}
            handleInitializeVault={handleInitializeVault}
            verifyMasterPassword={verifyMasterPassword}
          />
        )}
        
        {vaultInitialized && masterVerified && (
          <div className="space-y-8">
            <div className="bg-light backdrop-blur-xl border border-primary/30 rounded-2xl p-8 shadow-xl transition duration-500 hover:shadow-[0_0_100px_rgba(199,94,255,0.2)]">
              <VaultEntryForm onAdd={handleAddEntry} />
            </div>

            <VaultSearchEntries 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
            {filteredEntries.length > 0 ? (
              <VaultEntryList
                entries={filteredEntries}
                revealed={revealed}
                toggleCard={toggleCard}
                copied={copied}
                handleCopy={handleCopy}
                showPassword={showPassword}
                togglePassword={togglePassword}
                onUpdate={handleUpdateEntry}
                onDelete={handleDeleteEntry}
              />
            ) : (
              <VaultEmpty
                entries={entries} 
                searchQuery={searchQuery}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VaultContainer;
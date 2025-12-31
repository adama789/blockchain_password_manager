import { Lock } from "lucide-react";
import React from "react";

/**
 * VaultUnlockForm Component
 * * The "Login" interface for the vault. This component is rendered when a vault 
 * is already detected on the blockchain, but the local session is locked.
 * * Logic flow:
 * 1. User inputs the Master Password.
 * 2. On submit, the hash of this password is compared with the on-chain stored hash.
 * 3. If they match, the masterPassword is used as the AES decryption key for all entries.
 */
function VaultUnlockForm({ masterPassword, setMasterPassword, verifyMasterPassword }) {
  
  /**
   * Handles form submission.
   * Prevents default page reload and triggers the verification process.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyMasterPassword();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-light backdrop-blur-xl border border-primary/30 rounded-2xl p-8 max-w-md mx-auto shadow-xl transition duration-500 hover:shadow-[0_0_100px_rgba(199,94,255,0.2)]"
    >
      {/* Header Section with Lock Icon */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-primary/10 p-5 rounded-full mb-5 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(199,94,255,0.2)]">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-wider">ACCESS VAULT</h2>
        <p className="mt-2 text-primary/90 text-sm">Decrypted access required.</p>
      </div>

      {/* Master Key Input Field */}
      <label htmlFor="master-password" className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text font-semibold text-sm">
        Master Key:
      </label>

      <input
        id="master-password"
        placeholder="Input a master password..."
        type="password"
        autoFocus
        value={masterPassword}
        onChange={(e) => setMasterPassword(e.target.value)}
        className="w-full rounded-xl font-semibold bg-dark/60 border border-primary/50 shadow-[0_0_100px_rgba(199,94,255,0.15)] 
        p-3 mb-6 mt-2 text-accent placeholder-accent/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition duration-300"
      />

      {/* Action Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-accent 
                    text-white font-bold py-3 rounded-xl transition duration-300 
                    shadow-[0_0_40px_rgba(199,94,255,0.4)] hover:shadow-[0_0_60px_rgba(199,94,255,0.6)]
                    transform hover:scale-[1.01]"
      >
        UNLOCK
      </button>
    </form>
  );
}

export default VaultUnlockForm;
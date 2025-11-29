import { Key } from "lucide-react";
import React, { useState } from "react";

function VaultInitForm({ masterPassword, setMasterPassword, handleInitializeVault }) {
  const [confirmPassword, setConfirmPassword] = useState("");

  const checks = {
    length: masterPassword.length >= 16,
    upper: /[A-Z]/.test(masterPassword),
    lower: /[a-z]/.test(masterPassword),
    digit: /[0-9]/.test(masterPassword),
    match: masterPassword === confirmPassword && masterPassword.length > 0,
  };

  const requirementClass = (ok) => (ok ? "text-green-400 font-bold" : "text-accent/60");
  const allChecksPassed = Object.values(checks).every(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (allChecksPassed) {
      handleInitializeVault();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-light backdrop-blur-xl border border-primary/30 rounded-2xl p-8 max-w-md mx-auto shadow-xl transition duration-500 hover:shadow-[0_0_100px_rgba(199,94,255,0.2)]"
    >
      <div className="flex flex-col items-center mb-6">
        <div className="bg-primary/10 p-5 rounded-full mb-5 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(199,94,255,0.2)]">
          <Key className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-wider">INITIATE VAULT</h2>
        <p className="mt-2 text-primary/90 text-sm">Create the vault encryption key.</p>
      </div>

      <label htmlFor="init-password" className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text font-semibold text-sm">
        New Master Key:
      </label>
      <input
        id="init-password"
        placeholder="Set a master password..."
        type="password"
        value={masterPassword}
        onChange={(e) => setMasterPassword(e.target.value)}
        className="w-full rounded-xl font-semibold bg-dark/60 border border-primary/50 shadow-[0_0_100px_rgba(199,94,255,0.15)] 
        p-3 mb-4 mt-2 text-accent placeholder-accent/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition duration-300"
      />

      <label htmlFor="confirm-password" className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text font-semibold text-sm">
        Confirm Master Key:
      </label>
      <input
        id="confirm-password"
        placeholder="Repeat master password..."
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full rounded-xl font-semibold bg-dark/60 border border-primary/50 shadow-[0_0_100px_rgba(199,94,255,0.15)] 
        p-3 mb-6 mt-2 text-accent placeholder-accent/50 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition duration-300"
      />

      <div className="bg-dark/70 border border-primary/40 rounded-xl p-4 mb-6 shadow-inner">
        <p className="text-white font-bold mb-3 border-b border-primary/30 pb-2">KEY STRENGTH REQUIREMENTS:</p>
        <ul className="text-sm space-y-2 font-mono">
          <li className={`flex items-center gap-2 ${requirementClass(checks.length)}`}>Minimum 16 characters</li>
          <li className={`flex items-center gap-2 ${requirementClass(checks.upper)}`}>At least one uppercase letter (A-Z)</li>
          <li className={`flex items-center gap-2 ${requirementClass(checks.lower)}`}>At least one lowercase letter (a-z)</li>
          <li className={`flex items-center gap-2 ${requirementClass(checks.digit)}`}>At least one number (0-9)</li>
          <li className={`flex items-center gap-2 ${requirementClass(checks.match)}`}>Passwords match</li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={!allChecksPassed}
        className={`w-full text-white font-bold py-3 rounded-xl transition duration-300 
                    ${allChecksPassed 
                      ? "bg-gradient-to-r from-primary to-accent shadow-[0_0_40px_rgba(199,94,255,0.4)] hover:shadow-[0_0_60px_rgba(199,94,255,0.6)] transform hover:scale-[1.01]" 
                      : "bg-gray-700/50 cursor-not-allowed shadow-none"}`}
      >
        CREATE VAULT
      </button>
    </form>
  );
}

export default VaultInitForm;

function VaultInitForm({ masterPassword, setMasterPassword, handleInitializeVault }) {
  return (
    <div className="bg-light backdrop-blur-xl border border-primary/30 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
      <p className="mb-4 text-gray-300">Set master password to initialize vault:</p>
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
  );
}

export default VaultInitForm;

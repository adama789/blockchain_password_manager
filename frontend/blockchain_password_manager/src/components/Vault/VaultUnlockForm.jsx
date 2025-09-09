function VaultUnlockForm({ masterPassword, setMasterPassword, verifyMasterPassword }) {
  return (
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
  );
}

export default VaultUnlockForm;

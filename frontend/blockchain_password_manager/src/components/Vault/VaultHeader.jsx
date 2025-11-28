function VaultHeader( {masterVerified} ) {
  if (masterVerified) {
      return (
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">
            Your Vault
          </h2>
        </header>
      );
    }
  }

export default VaultHeader;

import VaultEntryCard from "./VaultEntryCard";

function VaultEntryList({ entries, revealed, toggleCard, copied, handleCopy, showPassword, togglePassword }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-8">
      {entries.map((entry, i) => (
        <VaultEntryCard
          key={i}
          entry={entry}
          index={i}
          isRevealed={revealed[i]}
          toggleCard={toggleCard}
          copied={copied}
          handleCopy={handleCopy}
          showPassword={showPassword}
          togglePassword={togglePassword}
        />
      ))}
    </div>
  );
}

export default VaultEntryList;

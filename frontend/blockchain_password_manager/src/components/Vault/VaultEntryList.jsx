import VaultEntryCard from "./VaultEntryCard";

/**
 * VaultEntryList Component
 * * Responsible for rendering the collection of vault entries in a responsive grid.
 * It maps through the decrypted entries and passes down the necessary state 
 * and control functions to each individual VaultEntryCard.
 */

function VaultEntryList({
  entries,
  revealed,
  toggleCard,
  showPassword,
  togglePassword,
  onUpdate,
  onDelete
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-8">
      {entries.map((entry, i) => (
        <VaultEntryCard
          key={i}
          entry={entry}
          index={i}
          isRevealed={revealed[i]}
          toggleCard={toggleCard}
          showPassword={showPassword}
          togglePassword={togglePassword}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default VaultEntryList;
import { ShieldAlert } from "lucide-react";

/**
 * VaultEmpty Component
 * * A fallback UI component rendered when there are no items to display.
 * It serves two scenarios:
 * 1. The vault is completely empty (initial state).
 * 2. The user has entries, but the current search query filters all of them out.
 */
function VaultEmpty({ entries, searchQuery }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl border-2 border-dashed border-primary/20 bg-light/5 text-center transition-all hover:border-primary/40 group">
            
            {/* Animated Icon Container with Glow effect */}
            <div className="bg-primary/10 p-5 rounded-full mb-5 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(199,94,255,0.2)]">
                <ShieldAlert className="w-10 h-10 text-primary" />
            </div>

            {/* Dynamic Title based on Vault State */}
            <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
            {entries.length === 0
                ? "Your Vault is Empty"
                : "No Matches Found"}
            </h3>

            {/* Dynamic Description with search query feedback */}
            <p className="text-accent/60 max-w-sm text-sm">
            {entries.length === 0
                ? "Your digital assets are safe, but there's nothing here yet. Use the form above to add your first secured entry."
                : `No entries found for "${searchQuery}". Try a different keyword.`}
            </p>
        </div>
    );
}

export default VaultEmpty;
import { Search, X } from "lucide-react";

function VaultSearchEntries({ searchQuery, setSearchQuery }) {
  return (
    <div className="mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by title or username..."
            maxLength={32}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-light pl-12 pr-8 py-2 font-semibold rounded-xl 
                      border border-primary/50 shadow-[0_0_300px_rgba(199,94,255,0.15)] text-accent placeholder-accent/50
                      focus:outline-none focus:ring-2 focus:ring-accent shadow-inner transition"
          />

          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/70">
            <Search />
          </span>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 
                          text-accent hover:text-accent transition-colors p-1"
            >
              <X />
            </button>
          )}
        </div>
    </div>
  );
}

export default VaultSearchEntries;
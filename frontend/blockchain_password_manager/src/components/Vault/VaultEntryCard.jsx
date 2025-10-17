import { Eye, EyeOff, User, Lock, Copy } from "lucide-react";
import SpotlightCard from "../ReactBits/SpotlightCard/SpotlightCard";

function VaultEntryCard({ entry, index, isRevealed, toggleCard, copied, handleCopy, showPassword, togglePassword }) {
  if (!isRevealed) {
    return (
      <SpotlightCard
        className="relative bg-light border border-primary/30 
                   rounded-2xl p-6 shadow-md transition transform 
                   hover:scale-[1.02] min-h-[220px] 
                   flex flex-col justify-center items-center"
        spotlightColor="rgba(168,85,247,0.6)"
      >
        <h4
          className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4 max-w-[300px] truncate"
          title={entry.title}
        >
          {entry.title}
        </h4>
        <button
          onClick={() => toggleCard(index)}
          className="p-4 rounded-full bg-gradient-to-r from-accent to-primary 
                     hover:shadow-glow transition transform hover:scale-110"
        >
          <Eye className="w-6 h-6 text-white" />
        </button>
      </SpotlightCard>
    );
  }

  return (
    <div
      className="relative bg-light border border-primary/30
                 rounded-2xl p-6 shadow-md transition transform 
                 hover:scale-[1.02] min-h-[220px] 
                 flex flex-col justify-between animate-fadeIn"
    >
      <h3
        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary max-w-[300px] truncate"
        title={entry.title}
      >
        {entry.title}
      </h3>

      <div className="space-y-2 mt-3">
        {/* Username */}
        <p className="flex items-center gap-2 text-gray-200">
          <User className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-white shrink-0">Username:</span>
          <span className="text-white max-w-[120px] truncate" title={entry.username}>
            {entry.username}
          </span>
          <button
            onClick={() => handleCopy(entry.username, `username-${index}`)}
            className="p-1 rounded-md hover:bg-dark/40 transition flex items-center justify-center shrink-0"
            title="Copy username"
          >
            <Copy className="w-4 h-4 text-gray-300 hover:text-white" />
          </button>
        </p>

        {/* Password */}
        <p className="flex items-center gap-2 text-gray-200">
          <Lock className="w-4 h-4 text-accent shrink-0" />
          <span className="font-semibold text-white shrink-0">Password:</span>
          <span className="text-white max-w-[120px] truncate" title={entry.password}>
            {showPassword[index] ? entry.password : "••••••••"}
          </span>
          <button
            onClick={() => togglePassword(index)}
            className="p-1 rounded-md hover:bg-dark/40 transition flex items-center justify-center shrink-0"
            title={showPassword[index] ? "Hide password" : "Show password"}
          >
            {showPassword[index] ? (
              <EyeOff className="w-4 h-4 text-gray-300 hover:text-white" />
            ) : (
              <Eye className="w-4 h-4 text-gray-300 hover:text-white" />
            )}
          </button>
          <button
            onClick={() => handleCopy(entry.password, `password-${index}`)}
            className="p-1 rounded-md hover:bg-dark/40 transition flex items-center justify-center shrink-0"
            title="Copy password"
          >
            <Copy className="w-4 h-4 text-gray-300 hover:text-white" />
          </button>
        </p>
      </div>

      {/* Bottom buttons */}
      <div className="pt-4 flex justify-between items-center">
        {copied?.startsWith(`username-${index}`) || copied?.startsWith(`password-${index}`) ? (
            <span className="text-accent text-sm font-medium">Copied!</span>
        ) : (
            <span />
        )}

        <button
            onClick={() => toggleCard(index)}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-primary to-accent 
                    text-white text-xs font-medium shadow-md hover:opacity-90"
        >
            <EyeOff className="w-4 h-4 inline mr-1" />
            Hide
        </button>
      </div>
    </div>
  );
}

export default VaultEntryCard;

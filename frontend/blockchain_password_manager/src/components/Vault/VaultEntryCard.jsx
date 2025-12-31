import { Eye, EyeOff, User, Lock, Copy, Check, Pencil, Trash } from "lucide-react";
import SpotlightCard from "../ReactBits/SpotlightCard/SpotlightCard";
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * VaultEntryCard Component
 * * Displays an individual password entry. It features two main states:
 * 1. Hidden (Collapsed): Shows only the title and a toggle button.
 * 2. Revealed (Expanded): Shows credentials, copy buttons, and management tools (Edit/Delete).
 */
function VaultEntryCard({
  entry,
  index,
  isRevealed,
  toggleCard,
  showPassword,
  togglePassword,
  onUpdate,
  onDelete
}) {
  // Local state for UI feedback (copy confirmation)
  const [copied, setCopied] = useState({});
  // Local state for the editing modal overlay
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: entry.title,
    username: entry.username,
    password: entry.password,
  });
  const [showEditPassword, setShowEditPassword] = useState(false);

  /**
   * Copies a value to the system clipboard and provides visual feedback.
   */
  const handleCopy = (value, key) => {
    navigator.clipboard.writeText(value);
    setCopied({ [key]: true });
    toast.dismiss();
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied({}), 4000);
  };

  /**
   * Submits edited data to the blockchain via the parent's onUpdate handler.
   */
  const handleSaveEdit = () => {
    onUpdate(index, editData);
    setIsEditing(false);
  };

  const inputClass =
    "w-full rounded-xl font-semibold bg-dark/60 border border-primary/50 shadow-[0_0_300px_rgba(199,94,255,0.15)] " +
    "p-3 pr-12 text-accent placeholder-accent/50 focus:outline-none focus:ring-2 focus:ring-accent shadow-inner transition";

  const revealedCardClasses =
    "shadow-xl hover:scale-[1.005] transition duration-500 hover:shadow-[0_0_100px_rgba(199,94,255,0.2)]";

  // STATE: HIDDEN CARD
  if (!isRevealed) {
    return (
      <SpotlightCard
        className="relative bg-light border border-primary/30 rounded-2xl p-6 shadow-md transition transform min-h-[220px] flex flex-col justify-center items-center"
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
          className="p-4 rounded-full bg-gradient-to-r from-accent to-primary transition transform hover:scale-110 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
        >
          <Eye className="w-6 h-6 text-white" />
        </button>
      </SpotlightCard>
    );
  }

  // STATE: REVEALED CARD (Expanded view + Edit Overlay)
  return (
    <div
      className={`relative bg-light border border-primary/30 rounded-2xl p-6 shadow-md transition transform min-h-[240px] flex flex-col justify-between animate-fadeIn ${revealedCardClasses}`}
    >
      {/* EDITING OVERLAY MODAL */}
      {isEditing && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm rounded-2xl p-6 z-20 flex justify-center items-center">
          <div className="bg-dark p-6 rounded-2xl space-y-4 border border-primary/40 w-full max-w-md">
            <h3 className="text-xl font-bold text-accent">Edit Entry</h3>

            <input
              placeholder="Title"
              maxLength={64}
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className={inputClass}
            />
            <input
              placeholder="Username"
              maxLength={64}
              value={editData.username}
              onChange={(e) => setEditData({ ...editData, username: e.target.value })}
              className={inputClass}
            />

            <div className="relative">
              <input
                type={showEditPassword ? "text" : "password"}
                placeholder="Password"
                maxLength={64}
                value={editData.password}
                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => setShowEditPassword(!showEditPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-primary/90 p-1 rounded-md hover:bg-primary/20 transition"
              >
                {showEditPassword ? <EyeOff className="w-6 h-6 text-accent/70" /> : <Eye className="w-6 h-6 text-accent/70" />}
              </button>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-600 text-white font-semibold hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-[0_0_20px_rgba(199,94,255,0.3)] hover:scale-[1.02] transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVEALED CARD CONTENT */}
      <h3
        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary max-w-[300px] truncate"
        title={entry.title}
      >
        {entry.title}
      </h3>

      <div className="space-y-2 mt-3">
        {/* Username Row */}
        <p className="flex items-center gap-2 text-gray-200">
          <User className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-white shrink-0">Username:</span>
          <span className="text-white max-w-[120px] truncate">{entry.username}</span>
          <button
            onClick={() => handleCopy(entry.username, `username-${index}`)}
            className="p-1 rounded-md hover:bg-dark/40 transition"
          >
            {copied[`username-${index}`] ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-primary/70" />}
          </button>
        </p>

        {/* Password Row */}
        <p className="flex items-center gap-2 text-gray-200">
          <Lock className="w-4 h-4 text-accent shrink-0" />
          <span className="font-semibold text-white shrink-0">Password:</span>
          <span className="text-white max-w-[120px] truncate">
            {showPassword[index] ? entry.password : "••••••••"}
          </span>
          <button onClick={() => togglePassword(index)} className="p-1 rounded-md hover:bg-primary/20">
            {showPassword[index] ? <EyeOff className="w-4 h-4 text-accent" /> : <Eye className="w-4 h-4 text-accent" />}
          </button>
          <button
            onClick={() => handleCopy(entry.password, `password-${index}`)}
            className="p-1 rounded-md hover:bg-primary/20"
          >
            {copied[`password-${index}`] ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-accent/70" />}
          </button>
        </p>
      </div>

      {/* Action Buttons Container */}
      <div className="pt-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="p-2 rounded-md bg-primary/20 hover:bg-primary/30 transition">
            <Pencil className="w-4 h-4 text-primary" />
          </button>

          <button onClick={() => onDelete(index)} className="p-2 rounded-md bg-red-500/20 hover:bg-red-500/30 transition">
            <Trash className="w-4 h-4 text-red-400" />
          </button>
        </div>

        <button onClick={() => toggleCard(index)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-xs font-bold hover:scale-105 transition">
          <EyeOff className="w-4 h-4 inline mr-1" />
          HIDE
        </button>
      </div>
    </div>
  );
}

export default VaultEntryCard;
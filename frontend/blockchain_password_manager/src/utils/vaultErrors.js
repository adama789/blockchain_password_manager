import toast from "react-hot-toast";

/**
 * Global Error Handler Utility
 * * This function acts as a translator between raw blockchain/provider errors 
 * and user-friendly notifications. It intercepts exceptions from wallet 
 * adapters (like Phantom) and Solana RPC nodes.
 */
export const handleError = (error, context = "Transaction") => {
  // UX: Remove existing toasts to avoid cluttered UI
  toast.dismiss(); 
  
  // LOGGING: Keep the full stack trace available in the dev tools
  console.error(`${context} error:`, error);

  // EXTRACTION: Standardize the error message from different possible formats
  const msg = error?.message || error?.toString() || "Unknown error";

  let userMessage;

  /**
   * ERROR MAPPING LOGIC
   * 4001: Solana Wallet standard for user cancellation.
   * -32002: Request already pending or provider connection issues.
   */
  if (error?.code === 4001 || msg.includes("User rejected")) {
    userMessage = "Transaction rejected by user.";
  } else if (error?.code === -32002) {
    userMessage = "Connection failed, please refresh the page and try again."
  } else if (msg.includes("debit")) {
    // Solana-specific: Occurs when the account cannot pay for transaction fees (gas)
    userMessage = "Not enough SOL in wallet. Please top up your balance.";
  } else if (msg.includes("already in use")) {
    // Anchor/Solana: Thrown when trying to initialize a PDA that already exists
    userMessage = "Vault already exists for this wallet.";
  } else {
    // FALLBACK: Display the raw message if no mapping is found
    userMessage = `${context} failed: ${msg}`;
  }
  
  // UI TRIGGER: Display the final mapped message as a toast notification
  toast.error(userMessage);
};
export const handleError = (error, context = "Transaction") => {
  console.error(`${context} error:`, error);

  const msg = error?.message || error?.toString() || "Unknown error";

  if (error?.code === 4001 || msg.includes("User rejected")) {
    return "Transaction rejected by user.";
  } else if (msg.includes("debit")) {
    return "Not enough SOL in wallet. Please top up your balance.";
  } else if (msg.includes("already in use")) {
    return "Vault already exists for this wallet.";
  } else {
    return `${context} failed: ${msg}`;
  }
};
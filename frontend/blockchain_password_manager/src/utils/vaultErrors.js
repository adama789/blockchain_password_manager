export const handleError = (error, context = "Transaction") => {
  console.error(`${context} error:`, error);

  const msg = error?.message || error?.toString() || "Unknown error";

  if (error?.code === 4001 || msg.includes("User rejected")) {
    alert("Transaction rejected by user.");
  } else if (msg.includes("debit")) {
    alert("Not enough SOL in wallet. Please top up your balance.");
  } else if (msg.includes("already in use")) {
    alert("Vault already exists for this wallet.");
  } else {
    alert(`${context} failed: ${msg}`);
  }
};

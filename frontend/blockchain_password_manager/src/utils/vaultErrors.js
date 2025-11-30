import toast from "react-hot-toast";

export const handleError = (error, context = "Transaction") => {
  toast.dismiss(); 
  
  console.error(`${context} error:`, error);

  const msg = error?.message || error?.toString() || "Unknown error";

  let userMessage;

  if (error?.code === 4001 || msg.includes("User rejected")) {
    userMessage = "Transaction rejected by user.";
  } else if (error?.code == -32002) {
    userMessage = "Connection failed, please refresh the page and try again."
  } else if (msg.includes("debit")) {
    userMessage = "Not enough SOL in wallet. Please top up your balance.";
  } else if (msg.includes("already in use")) {
    userMessage = "Vault already exists for this wallet.";
  } else {
    userMessage = `${context} failed: ${msg}`;
  }
  
  toast.error(userMessage);
};
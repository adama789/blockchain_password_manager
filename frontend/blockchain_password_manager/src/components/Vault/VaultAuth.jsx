/**
 * VaultAuth Component
 * * Acts as an authentication gateway. It decides whether to show the 
 * Vault Initialization form (for new users) or the Unlock form (for returning users).
 */
import VaultInitForm from "./VaultInitForm";
import VaultUnlockForm from "./VaultUnlockForm";

/**
 * @param {boolean} vaultInitialized - Whether the user has a vault account on the blockchain.
 * @param {boolean} masterVerified - Whether the user has successfully entered their master password locally.
 * @param {string} masterPassword - Current state of the password input field.
 * @param {function} setMasterPassword - State setter for the password input.
 * @param {function} handleInitializeVault - Logic to create the on-chain vault account.
 * @param {function} verifyMasterPassword - Logic to compare the input password against the stored on-chain hash.
 */
function VaultAuth({ 
    vaultInitialized, 
    masterVerified, 
    masterPassword, 
    setMasterPassword, 
    handleInitializeVault, 
    verifyMasterPassword 
}) {
    // STATE 1: User has no vault. Show the setup screen.
    if (!vaultInitialized) {
        return (
            <div className="p-8">
                <VaultInitForm
                    masterPassword={masterPassword}
                    setMasterPassword={setMasterPassword}
                    handleInitializeVault={handleInitializeVault}
                />
            </div>
        );
    }

    // STATE 2: Vault exists, but it's locked. Show the login screen.
    if (vaultInitialized && !masterVerified) {
        return (
            <div className="p-8">
                <VaultUnlockForm
                    masterPassword={masterPassword}
                    setMasterPassword={setMasterPassword}
                    verifyMasterPassword={verifyMasterPassword}
                />
            </div>
        );
    }
    
    // STATE 3: Vault is initialized and unlocked. Render nothing (allows main app to show).
    return null; 
}

export default VaultAuth;
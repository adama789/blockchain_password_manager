import VaultInitForm from "./VaultInitForm";
import VaultUnlockForm from "./VaultUnlockForm";

function VaultAuth({ 
    vaultInitialized, 
    masterVerified, 
    masterPassword, 
    setMasterPassword, 
    handleInitializeVault, 
    verifyMasterPassword 
}) {
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
    
    return null; 
}

export default VaultAuth;
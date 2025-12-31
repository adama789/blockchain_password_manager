/**
 * Utility: Password Strength Validator
 * * This function enforces the security policy for the application's Master Password.
 * A password must meet all criteria to be considered "strong" enough to derive 
 * the AES-256 encryption key and the on-chain verification hash.
 * - Minimum 12 characters (Entropy boost)
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one numeric digit (0-9)
 */
export const isStrongPassword = (password) => {
    // Regular Expressions for security criteria
    const minLength = /.{12,}/; // Enforces length
    const upper = /[A-Z]/;      // Enforces complexity (Uppercase)
    const lower = /[a-z]/;      // Enforces complexity (Lowercase)
    const digit = /[0-9]/;      // Enforces complexity (Numbers)

    /**
     * Logical AND ensures that a failure in any single check 
     * results in the entire password being rejected.
     */
    return (
        minLength.test(password) &&
        upper.test(password) &&
        lower.test(password) &&
        digit.test(password)
    );
};
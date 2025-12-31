use anchor_lang::prelude::*;
use sha2::{Sha256, Digest};

// Ensure this matches the address in Anchor.toml
declare_id!("D3FSFsCsdTiXQ3q4U8RmUyaCcuvLaQADpvJpfFgkLhaP");

#[program]
pub mod blockchain_password_manager {
    use super::*;

    /// Initializes a new password vault for a user.
    /// 
    /// # Arguments
    /// * `master_password` - A string that is hashed and stored to verify the vault owner.
    /// * `_bump` - The canonical bump for the PDA derivation.
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        _bump: u8,
        master_password: String,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.user.key();
        vault.entries = Vec::new();

        // Hash the master password using SHA-256 before storage
        let mut hasher = Sha256::new();
        hasher.update(master_password.as_bytes());
        vault.master_hash = hasher.finalize().into();

        Ok(())
    }

    /// Adds a new password credential entry to the vault.
    /// 
    /// # Arguments
    /// * `title` - The name of the service (e.g., "Google").
    /// * `username` - The login identity.
    /// * `password` - The encrypted or plain text password string.
    pub fn add_entry(
        ctx: Context<AddEntry>,
        title: String,
        username: String,
        password: String,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        // Security check: only the owner of the PDA can add entries
        require_keys_eq!(
            vault.owner,
            ctx.accounts.user.key(),
            CustomError::Unauthorized
        );

        let entry = PasswordEntry {
            title,
            username,
            password,
        };
        vault.entries.push(entry);

        Ok(())
    }

    /// Updates an existing entry at a specific index.
    /// 
    /// # Arguments
    /// * `index` - The position of the entry in the vault vector.
    pub fn update_entry(
        ctx: Context<UpdateEntry>,
        index: u32,
        new_title: String,
        new_username: String,
        new_password: String,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        require_keys_eq!(
            vault.owner,
            ctx.accounts.user.key(),
            CustomError::Unauthorized
        );

        let i = index as usize;
        require!(i < vault.entries.len(), CustomError::InvalidIndex);

        vault.entries[i].title = new_title;
        vault.entries[i].username = new_username;
        vault.entries[i].password = new_password;

        Ok(())
    }

    /// Removes an entry from the vault and shifts remaining entries.
    pub fn delete_entry(ctx: Context<DeleteEntry>, index: u32) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        
        require_keys_eq!(
            vault.owner,
            ctx.accounts.user.key(),
            CustomError::Unauthorized
        );

        let i = index as usize;
        require!(i < vault.entries.len(), CustomError::InvalidIndex);

        vault.entries.remove(i);

        Ok(())
    }
}

/// Accounts for the `initialize_vault` instruction.
/// Creates a PDA (Program Derived Address) based on the user's public key.
#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = user,
        space = PasswordVault::MAX_SIZE,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, PasswordVault>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

/// Accounts for adding a password entry.
#[derive(Accounts)]
pub struct AddEntry<'info> {
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, PasswordVault>,
    pub user: Signer<'info>,
}

/// Accounts for updating a password entry.
#[derive(Accounts)]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, PasswordVault>,
    pub user: Signer<'info>,
}

/// Accounts for deleting a password entry.
#[derive(Accounts)]
pub struct DeleteEntry<'info> {
    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, PasswordVault>,
    pub user: Signer<'info>,
}

/// The main state account for a user's password vault.
#[account]
pub struct PasswordVault {
    /// The public key of the vault creator.
    pub owner: Pubkey,
    /// SHA-256 hash of the master password.
    pub master_hash: [u8; 32],
    /// Vector containing all stored password credentials.
    pub entries: Vec<PasswordEntry>,
}

/// Represents a single credential record.
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PasswordEntry {
    pub title: String,
    pub username: String,
    pub password: String,
}

/// Custom error codes for the Password Manager program.
#[error_code]
pub enum CustomError {
    #[msg("Unauthorized access.")]
    Unauthorized,

    #[msg("Invalid index provided for the vault entry.")]
    InvalidIndex,
}

impl PasswordVault {
    // Allocation Constraints
    const MAX_ENTRIES: usize = 15;
    const MAX_TITLE_LENGTH: usize = 32;
    const MAX_USERNAME_LENGTH: usize = 32;
    const MAX_PASSWORD_LENGTH: usize = 64;

    /// Calculates the size of a single PasswordEntry in bytes.
    /// String = 4 bytes (Borsh prefix) + actual length.
    const MAX_ENTRY_SIZE: usize =
        4 + Self::MAX_TITLE_LENGTH +
        4 + Self::MAX_USERNAME_LENGTH +
        4 + Self::MAX_PASSWORD_LENGTH;

    /// Total space required for the PasswordVault account.
    pub const MAX_SIZE: usize = 8   // Anchor discriminator
        + 32                        // owner Pubkey
        + 32                        // master_hash
        + 4                         // Vec prefix (u32)
        + Self::MAX_ENTRIES * Self::MAX_ENTRY_SIZE;
}
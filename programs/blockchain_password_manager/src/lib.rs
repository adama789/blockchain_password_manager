use anchor_lang::prelude::*;

declare_id!("7enf5P2posUM9L6naaakrzk4DAXrSs2d5McYWjvNNPho");

#[program]
pub mod blockchain_password_manager {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.user.key();
        vault.entries = Vec::new();
        Ok(())
    }

    pub fn add_entry(
        ctx: Context<AddEntry>,
        title: String,
        username: String,
        password: String,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;

        require_keys_eq!(vault.owner, ctx.accounts.user.key(), CustomError::Unauthorized);

        let entry = PasswordEntry {
            title,
            username,
            password,
        };

        vault.entries.push(entry);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(init, payer = user, space = PasswordVault::MAX_SIZE)]
    pub vault: Account<'info, PasswordVault>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddEntry<'info> {
    #[account(mut)]
    pub vault: Account<'info, PasswordVault>,
    pub user: Signer<'info>,
}

#[account]
pub struct PasswordVault {
    pub owner: Pubkey,
    pub entries: Vec<PasswordEntry>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PasswordEntry {
    pub title: String,
    pub username: String,
    pub password: String,
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized access.")]
    Unauthorized,
}

impl PasswordVault {
    const MAX_ENTRIES: usize = 5;
    const MAX_ENTRY_SIZE: usize = 4 + 32 + 4 + 32 + 4 + 64; 
    // 4 per string, title (32), username (32), password (64)

    pub const MAX_SIZE: usize = 8  // discriminator
        + 32 // owner Pubkey
        + 4 // vector size
        + Self::MAX_ENTRIES * Self::MAX_ENTRY_SIZE;
}

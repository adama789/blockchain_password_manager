use anchor_lang::prelude::*;

// Ensure this matches the address in your Anchor.toml
declare_id!("CTv8dZywAUsET57jugsCP8pUnxYHXQCcCG5ktj4eLm3L");

#[program]
pub mod blockchain_password_manager {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>, _bump: u8) -> Result<()> {
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

#[derive(Accounts)]
pub struct AddEntry<'info> {
    #[account(mut, seeds = [b"vault", user.key().as_ref()], bump)]
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
    // Define the maximum sizes for the account
    const MAX_ENTRIES: usize = 5;
    const MAX_TITLE_LENGTH: usize = 32;
    const MAX_USERNAME_LENGTH: usize = 32;
    const MAX_PASSWORD_LENGTH: usize = 64;
    // Length of a string is 4 bytes + the string itself.
    const MAX_ENTRY_SIZE: usize = 4 + Self::MAX_TITLE_LENGTH + 4 + Self::MAX_USERNAME_LENGTH + 4 + Self::MAX_PASSWORD_LENGTH;

    pub const MAX_SIZE: usize = 8 // Anchor account discriminator
        + 32 // owner: Pubkey
        + 4  // entries: Vec<PasswordEntry> - vector length prefix
        + Self::MAX_ENTRIES * Self::MAX_ENTRY_SIZE;
}

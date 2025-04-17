use anchor_lang::prelude::*;

declare_id!("7enf5P2posUM9L6naaakrzk4DAXrSs2d5McYWjvNNPho");

#[program]
pub mod blockchain_password_manager {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let initial_account = &mut ctx.accounts.initial_account;
        initial_account.value = 10;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize <'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub initial_account : Account<'info, Init>,
    #[account(mut)]
    pub user : Signer<'info>,
    pub system_program : Program<'info, System>,
}

#[account]
pub struct Init {
    pub value : u64
}

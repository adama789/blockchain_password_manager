use anchor_lang::prelude::*;

declare_id!("7enf5P2posUM9L6naaakrzk4DAXrSs2d5McYWjvNNPho");

#[program]
pub mod blockchain_password_manager {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

# 🔐 Blockchain Password Manager

A decentralized password manager built on the Solana blockchain using the Anchor framework. This project allows secure password storage using smart contracts.

---

## 📦 Requirements

- Rust & Cargo
- Solana CLI
- Anchor CLI
- Node.js
- Yarn
- Git

---

## 🛠 Installation (Mac / Linux)

1. Install Solana, Anchor, Node and Yarn:

   `curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash`

2. Clone the repository:

   `git clone https://github.com/adama789/blockchain_password_manager.git && cd blockchain_password_manager`

3. Install Node.js dependencies for backend:

   `npm install`

3.2 Install Node.js dependencies for frontend
   `cd frontend/blockchain_password_manager && npm install`
   
---

## ⚙️ Configuration

4. Generate a new wallet:

   `solana-keygen new`

5. Configure network:

   To work on devnet:

   `solana config set --url devnet`

   To work locally:

   - In a new terminal, start the local validator:

     `solana-test-validator`

   - Then set Solana to use localhost:

     `solana config set --url localhost`

   - Update your `Anchor.toml` file accordingly:

     ```
     [provider]
     cluster = "devnet"
     ```
     
     ```
     [provider]
     cluster = "localnet"
     ```

6. Check your current Solana config:

   `solana config get`

---

## 🚀 Build and Deploy

To build:

`anchor build`

To build and test:

`anchor test`

To deploy it:

`anchor deploy`

---

## 📁 Project Structure

- `programs/` – Rust smart contract code
- `tests/` – TypeScript-based tests
- `Anchor.toml` – project configuration
- `migrations/`, `target/`, `app/` – other project files and folders

---

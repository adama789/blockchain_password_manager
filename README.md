<img width="1024" height="281" alt="45def748-5da7-444a-8c1d-d71e8073493b" src="https://github.com/user-attachments/assets/edcadfa6-36cc-423f-ab63-1f9e2585fbc6" />

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

   `git clone https://github.com/adama789/SolanaVault.git && cd SolanaVault`

3. Install Node.js dependencies for backend:

   `npm install`
   
5. Install Node.js dependencies for frontend:

   `cd frontend/blockchain_password_manager && npm install`
   
---

## ⚙️ Configuration

5. Generate a new wallet:

   `solana-keygen new`

6. Configure network:

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

7. Check your current Solana config:

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

## ✨ Demo

### Main Page 🏠
Get a quick look and connect your wallet.

<img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/ef5566f1-1ca7-414c-a005-aac3a680b651" />

---

### Initiate Vault 🔐
Create your vault to securely store and manage your sensitive data.

<img width="1916" height="997" alt="image" src="https://github.com/user-attachments/assets/bc8b8e04-bf75-493d-8f4c-0e86cb02a74f" />

---

### Vault Overview 👀
See your vault’s contents and explore saved entries at a glance.

<img width="1919" height="992" alt="image" src="https://github.com/user-attachments/assets/8a00bad8-b942-4153-b289-8eeecc5dec4b" />

---

### Fetching Entries ⏳
Quickly retrieve all your stored items with secure access.

<img width="1905" height="995" alt="image" src="https://github.com/user-attachments/assets/56cc796a-0038-46dd-9999-6f3dae364dc8" />

---

### Password Generator 🔑
Create a strong, random password with visualized entropy for safety.

<img width="1919" height="995" alt="image" src="https://github.com/user-attachments/assets/7d769cc4-c2a8-4d10-9722-9c5f557930f4" />

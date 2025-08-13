export default function WalletConnect({ onConnect, walletAddress }) {
  return !walletAddress ? (
    <button onClick={onConnect}>Connect Wallet</button>
  ) : (
    <p>Connected: {walletAddress}</p>
  );
}
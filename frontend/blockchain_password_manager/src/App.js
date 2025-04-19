import React, { useState } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {

  const [walletAddress, setWalletAddress] = useState(null)

  window.onload = async function () {
    try {
      if (window.solana) {
        if (window.solana.isPhantom) {
          console.log('Phantom wallet found!')
          const res = await window.solana.connect({ onlyIfTrusted: true })
          console.log("Connected with Public Key:", res.publicKey.toString())
          setWalletAddress(res.publicKey.toString())
        }
      } else {
        alert("Wallet not found! Get a Phantom Wallet!")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const connectWallet = async () => {
    try {
      if (window.solana) {
        const res = await window.solana.connect()
        setWalletAddress(res.publicKey.toString())
      } else {
        alert("Wallet not found! Get a Phantom Wallet!")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {!walletAddress && (
          <div>
            <button className='btn' onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        )}
        {walletAddress && (
          <div>
            <p>
              Connected account : {' '}
              <span className="address"> {walletAddress} </span>
            </p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

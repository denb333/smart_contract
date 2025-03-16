// import React from "react";
// import { requestAccount } from "../utils/contractServices";

// function ConnectWalletButton({ setAccount }) {
//   const connectWallet = async () => {
//     try {
//       const account = await requestAccount();
//       setAccount(account);
//     } catch (error) {
//       console.error("Failed to connect wallet:", error);
//     }
//   };

//   return <button onClick={connectWallet}>Connect Web3 Wallet</button>;
// }

// export default ConnectWalletButton;
import React, { useEffect, useState } from "react";
import { requestAccount } from "../utils/contractServices";

function ConnectWalletButton({ setAccount }) {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    checkConnectedWallet();
  }, [setAccount]);

  const connectWallet = async () => {
    try {
      const account = await requestAccount();
      if (account) {
        setWalletAddress(account);
        setAccount(account);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <button onClick={connectWallet}>
      {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Web3 Wallet"}
    </button>
  );
}

export default ConnectWalletButton;

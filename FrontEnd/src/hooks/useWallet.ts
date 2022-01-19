import React, { useState } from "react";

export function useWallet() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    try {
      if (!ethereum) {
        console.log("Make sure you have MetaMask");
        return;
      } else {
        console.log("ethereum object found", window);
      }
      // check if we are authorized to access the account
      const accounts = await ethereum.request({ method: "eth_accounts" });
      // grab the first authorized account
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("found an authorized account", account);
        setCurrentUser(account);
      } else {
        console.log("No authorized account found");
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain" + chainId);
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to rinkeby test network");
      }
    } catch (error) {
      console.log("error");
    }
  };
  // Implement the connect to wallet action
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }
      // request access to account
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // print the public address once we authorized metamask
      console.log("Connected", accounts[0]);
      setCurrentUser(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  return { currentUser, checkIfWalletIsConnected, connectWallet };
}

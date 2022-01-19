import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharNFT } from "../utils/constants";
import EpicGame from "../contract/EpicGame.json";
import { useState } from "react";

export function useGame(currentUser: string | null) {
  const [charNFT, setCharNFT] = useState<null | any>(null);

  const fetchNFTMetadata = async () => {
    console.log("Checking for Char NFT on address", currentUser);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      EpicGame.abi,
      signer
    );
    const txn = await gameContract.checkIfUserHasNFT();
    if (txn.name) {
      console.log("user have NFT");
      console.log(transformCharNFT(txn));
      console.log({ setCharNFT });
      setCharNFT(transformCharNFT(txn));
    } else {
      console.log("No Char NFT Found");
    }
  };
  return { charNFT, setCharNFT, fetchNFTMetadata };
}

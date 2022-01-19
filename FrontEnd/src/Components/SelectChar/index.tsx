import "./SelectChar.css";
import React, { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, transformCharNFT } from "../../utils/constants";
import EpicGame from "../../contract/EpicGame.json";
import { ethers } from "ethers";
import LoadingIndicator from "../LoadingIndicator";

interface SelectCharProps {
  setCharNFT: (Char: any) => void;
}

const SelectChar = ({ setCharNFT }: SelectCharProps) => {
  const [Chars, setChars] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [mintChar, setMintChar] = useState(false);
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        EpicGame.abi,
        signer
      );
      setGameContract(gameContract);
    } else {
      console.log("Ethereum Object not found ");
    }
  }, []);
  useEffect(() => {
    const getChars = async () => {
      try {
        console.log("Getting contract Chars to mint");
        const CharsTxn = await gameContract.getAllDefaultChars();
        console.log("CharsTxn:", CharsTxn);
        const Chars = CharsTxn.map((CharData) => transformCharNFT(CharData));
        setChars(Chars);
      } catch (error) {
        console.error("Something went wrong fetching Chars:", error);
      }
    };
    // callback method that will fire when this event is received
    const onCharMint = async (sender, tokenId, CharIndex) => {
      console.log(`
      Char NFT minted - sender ${sender}, tokenId ${tokenId.toNumber()}, CharIndex ${CharIndex.toNumber()}
      `);
      // once our char NFT is minted we can fetch the Metadata from our contract and set it in state to move into the Arena
      if (gameContract) {
        const CharNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharNFT:", CharNFT);
        setCharNFT(transformCharNFT(CharNFT));
        alert(`
          Your NFT is all minted see it here: https://testnets.opensea.io/assets/${
            gameContract.address
          }/${tokenId.toNumber()}
        `);
      }
    };
    if (gameContract) {
      getChars();
      // setup NFT listener
      gameContract.on("CharNFTMinted", onCharMint);
    }
    return () => {
      // When your components unmounts lets make sure to clean up this listener
      if (gameContract) {
        gameContract.off("CharNFTMinted", onCharMint);
      }
    };
  }, [gameContract]);
  // Actions
  const mintCharNFTAction = (CharId) => async () => {
    try {
      if (gameContract) {
        setMintChar(true);
        console.log("Minting Char in progess..");
        const mintTxn = await gameContract.mintCharNFT(CharId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
        setMintChar(false);
      }
    } catch (error) {
      console.warn("MintCharAction Error", error);
      setMintChar(false);
    }
  };
  // Render Methods
  const renderChars = () =>
    Chars.map((Char, index) => (
      <div className="Char-item" key={Char.name}>
        <div className="name-container">
          <p>{Char.name}</p>
        </div>
        <img src={Char.imageURI} alt={Char.name} />
        <button
          type="button"
          className="Char-mint-button"
          onClick={mintCharNFTAction(index)}
        >
          {`Mint ${Char.name}`}
        </button>
      </div>
    ));
  return (
    <div className="select-Char-container">
      <h2>Mint Your Hero, Choose Wisely</h2>
      {Chars.length > 0 && (
        <div className="Char-grid">
          {renderChars()}
          {mintChar && (
            <div className="loading">
              <div className="indicator">
                <LoadingIndicator />
                <p>Minting in Progress ...</p>
              </div>
              <img
                src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
                alt="Minting Loading Indicator"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectChar;

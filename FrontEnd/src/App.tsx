import { useEffect, useState } from "react";
import SelectChar from "./Components/SelectChar";
import { useGame } from "./hooks/useGame";
import { useWallet } from "./hooks/useWallet";
import LoadingIndicator from "./Components/LoadingIndicator";
import "./App.css";

declare global {
  interface Window {
    ethereum: any;
  }
}

// Constants
const TWITTER_HANDLE = "LordHeb";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { currentUser, checkIfWalletIsConnected, connectWallet } = useWallet();
  const { charNFT, setCharNFT, fetchNFTMetadata } = useGame(currentUser);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setisLoading(true);
    checkIfWalletIsConnected().then(() => {
      setisLoading(false);
    });
  }, []);
  // fetching NFT Metadata from our smart contract
  useEffect(() => {
    if (currentUser) {
      console.log("current user", currentUser);
      fetchNFTMetadata().then(() => {
        setisLoading(false);
      });
    }
  }, [currentUser]);
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    // If user has has not connected to your app - Show Connect To Wallet Button
    if (!currentUser) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://media2.giphy.com/media/SslCqqiLlToPgcOlzj/giphy.gif?cid=ecf05e47tmaxrjbibbpbq1vsb90xrt5d2xry3n7lrjyho474&rid=giphy.gif&ct=g"
            alt="The Witcher Wild Hunt Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      );
    }
    // If user has connected to your app AND does not have a Char NFT - Show SelectChar Component
    else if (currentUser && !charNFT) {
      return <SelectChar setCharNFT={setCharNFT} />;
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ The Witcher ⚔️</p>
          <p className="sub-text">🐺 Wild Hunt 🐺 </p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

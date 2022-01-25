import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, transformCharNFT } from "../../utils/constants";
import { ethers } from "ethers";
import EpicGame from "../../contract/EpicGame.json";
import "./Arena.css";
import LoadingIndicator from "../LoadingIndicator";

const Arena = ({ CharNFT, setCharNFT }) => {
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [mpChar, setMpChar] = useState(null);

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log("Boss:", bossTxn);
      setBoss(transformCharNFT(bossTxn));
    };
    const fetchMultipleChars = async () => {
      const charsTxn = await gameContract.getAllPlayers();
      console.log("AllPlayers:", charsTxn);
      setMpChar(charsTxn.map((char) => transformCharNFT(char)));
    };
    const onAttackComplete = (newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();
      console.log(`AttackComplete: Boss HP: ${bossHp} Player HP: ${playerHp}`);
      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });
      setCharNFT((prevState) => {
        return { ...prevState, hp: playerHp };
      });
    };
    if (gameContract) {
      fetchBoss();
      fetchMultipleChars();
      gameContract.on("AttackComplete", onAttackComplete);
    }
    return () => {
      if (gameContract) {
        gameContract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [gameContract]);

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
      console.log("ethereum Object not found");
    }
  }, []);
  const [attackState, setAttackState] = useState<"IDLE" | "Attacking" | "HIT">(
    "IDLE"
  );
  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("Attacking");
        console.log("Attacking Boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("HIT");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error Attacking Boss", error);
      setAttackState("IDLE");
    }
  };
  return (
    <div className="arena-container">
      {boss && CharNFT && (
        <div id="toast" className={showToast ? "show" : ""}>
          <div id="desc">{`💥 ${boss.name} was hit for ${CharNFT.attackDamage}!`}</div>
        </div>
      )}
      {/* Replace the Boss UI */}
      {boss && (
        <div className="class-container">
          <div className={`boss-content ${attackState}`}>
            <h2> 🔥{boss.name}🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
            </button>
          </div>
          {attackState === "Attacking" && (
            <div className="loading-indicator">
              <LoadingIndicator />
              <p>Attacking ⚔</p>
            </div>
          )}
        </div>
      )}
      {/* Replace the Char UI  */}
      {CharNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{CharNFT.name}</h2>
                <img src={CharNFT.imageURI} alt={`Boss ${CharNFT.name}`} />
                <div className="health-bar">
                  <progress value={CharNFT.hp} max={CharNFT.maxHp} />
                  <p>{`${CharNFT.hp} / ${CharNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔ Attack Damage: ${CharNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
      <h2>Other Characters</h2>
      <div className="multiplayer-container">
        {mpChar &&
          mpChar.map((CharNFT) =>
            CharNFT.name !== "" ? (
              <img src={CharNFT.imageURI} alt={`Boss ${CharNFT.name}`} />
            ) : null
          )}
      </div>
    </div>
  );
};

export default Arena;

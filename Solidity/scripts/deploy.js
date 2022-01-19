const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("EpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Geralt of Rivia", "Yeneffer of Vengerberg", "Cirilla of Cintra"],
    [
      "https://i.imgur.com/87sRFLx.jpeg" /* geralt */,
      "https://i.imgur.com/ClQuDbT.jpg" /* Yenn */,
      "https://i.imgur.com/fWUfpaA.jpg" /* Ciri */,
    ],
    [300, 200, 100], //HP
    [300, 200, 100], // AttkDamage
    [50, 30, 20], // CritChance
    [100, 50, 30], // Defense
    [20, 200, 100], // mana
    "The Wild Hunt", // boss name
    "https://i.imgur.com/nahjfKx.jpg", //boss image
    3000, // boss hp
    30 // boss ad
  );
  await gameContract.deployed();
  console.log("Contract Deployed to:", gameContract.address);

  // let nft;
  // // an NFT w/ the character at index 2 of our array (3 chars)
  // nft = await gameContract.mintCharacterNFT(2);
  // await nft.wait();
  // // attack boss
  // nft = await gameContract.attackBoss();
  // await nft.wait();
  // // attack boss
  // nft = await gameContract.attackBoss();
  // await nft.wait();

  // // get the value of the NFT URI's
  // let returnedTokenUri = await gameContract.tokenURI(1);
  // console.log("Token URI:", returnedTokenUri);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

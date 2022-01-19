const CONTRACT_ADDRESS = "0x96c7C7Ba70C1763B13bd9391b79D448E8c821489";
const transformCharNFT = (CharData) => {
  return {
    name: CharData.name,
    imageURI: CharData.imageURI,
    hp: CharData.hp.toNumber(),
    maxHp: CharData.hp.toNumber(),
    attackDamage: CharData.attackDamage.toNumber(),
    critChance: CharData.critChance.toNumber(),
    defense: CharData.defense.toNumber(),
    mana: CharData.mana.toNumber(),
  };
};
export { CONTRACT_ADDRESS, transformCharNFT };

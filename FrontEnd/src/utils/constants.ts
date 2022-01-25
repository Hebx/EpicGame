const CONTRACT_ADDRESS = "0x89E53011C07Bf16E9bCb5a531cb57826627B65a0";
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

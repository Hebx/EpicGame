//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./libraries/Base64.sol";
import "hardhat/console.sol";

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// Helper functions openzeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// our contracts inherits from ERC721, which is the standard NFT contract!
contract EpicGame is ERC721 {
	struct CharAttributes {
		uint CharIndex;
		string name;
		string imageURI;
		uint hp;
		uint maxHp;
		uint attackDamage;
		uint critChance;
		uint defense;
		uint mana;
	}
	struct BigBoss {
		string name;
		string imageURI;
		uint hp;
		uint maxHp;
		uint attackDamage;
	}
	BigBoss public bigBoss;
	event CharNFTMinted(address sender, uint256 tokenId, uint256 CharIndex);
	event AttackComplete(uint newBossHp, uint newPlayerHp);
	// tokenIds is the NFT unique identifier
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	// Hold the default data for our new minted Chars
	CharAttributes[] defaultChars;

	// mapping from the NFT's tokenIds => that NFTs attributes
	mapping(uint256 => CharAttributes) public NFTHolderAttributes;

	// mapping from the address => NFTs tokenIds to store the owner of the NFT and reference it later
	mapping(address => uint256) public NFTHolders;

		// Data passed into the contract when it's first created initializing the Chars
		// Pass the values to run.js
	constructor(
		string[] memory CharNames,
		string[] memory CharImageURIs,
		uint[] memory CharHp,
		uint[] memory CharAttDmg,
		uint[] memory CharCC,
		uint[] memory CharDef,
		uint[] memory CharMana,
		string memory bossName,
		string memory bossImageURI,
		uint  bossHp,
		uint  bossAttackDamage

		// special indentifier symbols for our NFT (Name, Symbol) for our token
		)

		ERC721("The Witcher", "Wild Hunt")

		{
			// Initialize the Boss and save it to our bigBoss state variable
			bigBoss = BigBoss({
				name: bossName,
				imageURI: bossImageURI,
				hp: bossHp,
				maxHp: bossHp,
				attackDamage: bossAttackDamage
			});

			console.log("done initializing the boss %s w/ image %s and hp %s", bigBoss.name, bigBoss.imageURI, bigBoss.hp);
			console.log("w/ max Hp %s and attackDamage %s", bigBoss.hp , bigBoss.attackDamage);
		//loop through all our Chars, save their values in our contract for minting later on
		for(uint i = 0; i < CharNames.length; i += 1)
		{
			defaultChars.push(CharAttributes({
				CharIndex: i,
				name: CharNames[i],
				imageURI: CharImageURIs[i],
				hp: CharHp[i],
				maxHp: CharHp[i],
				attackDamage: CharAttDmg[i],
				critChance: CharCC[i],
				defense: CharDef[i],
				mana: CharMana[i]
			}));
			CharAttributes memory c = defaultChars[i];
			console.log("Done initializing Char %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
			console.log("Done initializing Char %s w/, attackDamage %s, criticChance %s", c.name, c.attackDamage, c.critChance);
			console.log("Done initializing Char %s w/ defense %s, mana %s", c.name, c.defense, c.mana);
		}
		// increment so the first NFT start at ID 1
		_tokenIds.increment();

	}
	// Users will be able to hit this function and mint their NFT based on the CharID sent in
	function mintCharNFT(uint _CharIndex) external {
		// get current tokenID (starts at 1 since we incremented in the constructor)
		uint256 newItemID = _tokenIds.current();
		// assign the tokenId to the caller's wallet address
		_safeMint(msg.sender, newItemID);
		// map tokenId => their CharAttributes
		NFTHolderAttributes[newItemID] = CharAttributes({
			CharIndex: _CharIndex,
			name: defaultChars[_CharIndex].name,
			imageURI: defaultChars[_CharIndex].imageURI,
			hp: defaultChars[_CharIndex].hp,
			maxHp: defaultChars[_CharIndex].maxHp,
			attackDamage: defaultChars[_CharIndex].attackDamage,
			critChance: defaultChars[_CharIndex].critChance,
			defense: defaultChars[_CharIndex].defense,
			mana: defaultChars[_CharIndex].mana
		});
		console.log("Minting Char NFT w/ tokenId %s and CharIndex %s", newItemID, _CharIndex);

		// see who owns the NFT
		NFTHolders[msg.sender] = newItemID;

		// increment the tokenId for the next person that uses it
		_tokenIds.increment();
		emit CharNFTMinted(msg.sender, newItemID, _CharIndex);

	}

	function tokenURI(uint256 _tokenId) public view override returns (string memory) {
		CharAttributes memory charAttributes = NFTHolderAttributes[_tokenId];

		string memory strHp = Strings.toString(charAttributes.hp);
		string memory strMaxHp = Strings.toString(charAttributes.maxHp);
		string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);
		string memory strCritChance = Strings.toString(charAttributes.critChance);
		string memory strDefense = Strings.toString(charAttributes.defense);
		string memory strMana = Strings.toString(charAttributes.mana);

		string memory json = Base64.encode(
			abi.encodePacked(
        '{"name": "',
        charAttributes.name,
        ' -- NFT #: ',
        Strings.toString(_tokenId),
        '", "description": "The Witcher Wild Hunt NFT!", "image": "',
        charAttributes.imageURI,
        '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
        strAttackDamage,'}, { "trait_type": "Critical Chance", "value": ',strCritChance,'}, { "trait_type": "Defence", "value": ',strDefense,'}, { "trait_type": "Magical Mana", "value": ',strMana,'} ]}'
 		 )
		);

		string memory output = string(
			abi.encodePacked("data:application/json;base64,", json)
		);
		return output;
	}

	function attackBoss() public  {
		// get the state of the player's NFT
		uint256 NFTTokenIdofPlayer = NFTHolders[msg.sender];
		CharAttributes storage player = NFTHolderAttributes[NFTTokenIdofPlayer];
		console.log("\nplayer with charachter %s about to attack have %s HP and %s AD", player.name, player.hp, player.attackDamage);
		console.log("Boss %s has %s Hp and %s AD", bigBoss.name, bigBoss.hp, bigBoss.attackDamage);
		// check if the player have more than 0 hp
		require (
			player.hp > 0,
			"Error : player must have HP to attack the boss"
		);
		// check if the boss have more than 0 hp
		require (
			bigBoss.hp > 0,
			"Error: boss must have HP to attack the player"
		);
		// make sure the player attack the boss
		if (bigBoss.hp < player.attackDamage){
			bigBoss.hp = 0;
		}
		else {
			bigBoss.hp = bigBoss.hp - player.attackDamage;
		}


		// make sure the boss attack the player
		if (player.hp < bigBoss.attackDamage){
			player.hp = 0;
		}
		else {
			player.hp = player.hp - bigBoss.attackDamage;
		}
		emit AttackComplete(bigBoss.hp, player.hp);

	}
	function checkIfUserHasNFT() public view returns (CharAttributes memory) {
		// get the TokenID of the user's NFT
		uint256 userNFTTokenId = NFTHolders[msg.sender];
		// if the user has a tokenID on the map returns the NFT
		if (userNFTTokenId > 0) {
			return NFTHolderAttributes[userNFTTokenId];
		}
		// else return an empty array
		else {
			CharAttributes memory emptyStruct;
			return emptyStruct;
		}
	}

	function getAllDefaultChars() public view returns (CharAttributes[] memory ) {
		return defaultChars;
	}

	function getBigBoss() public view returns (BigBoss memory) {
		return bigBoss;
	}
}

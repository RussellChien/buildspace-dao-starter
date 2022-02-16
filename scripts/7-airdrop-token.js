import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// address to our ERC-1155 membership NFT contract
const bundleDropModule = sdk.getBundleDropModule(
  "0x79527669D0d4f97470A48B82E03c672c6ae3194d",
);

// address to our ERC-20 token contract
const tokenModule = sdk.getTokenModule(
  "0x0045cC49bd42A9f744DC5cac7db6cb9233b30FD0",
);

(async () => {
  try {
    // grab all the addresses of people who own our membership NFT, which has a tokenId of 0
    const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");
  
    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
      );
      process.exit(0);
    }
    
    // loop through the array of addresses
    const airdropTargets = walletAddresses.map((address) => {
      // pick a random # between 1000 and 10000 of tokens to airdrop
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address);
      
      // set up the target
      const airdropTarget = {
        address,
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };
  
      return airdropTarget;
    });
    
    // call transferBatch on all our airdrop targets.\
    console.log("🌈 Starting airdrop...")
    await tokenModule.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();
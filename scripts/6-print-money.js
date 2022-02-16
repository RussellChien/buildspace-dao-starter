import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// This is the address of our ERC-20 contract 
const tokenModule = sdk.getTokenModule(
  "0x0045cC49bd42A9f744DC5cac7db6cb9233b30FD0",
);

(async () => {
  try {
    // max supply
    const amount = 1_000_000;
    // We use the util function from "ethers" to convert the amount
    // to have 18 decimals (which is the standard for ERC20 tokens)
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    // mint the tokens
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();
    
    console.log(
      "✅ There now is",
      ethers.utils.formatUnits(totalSupply, 18),
      "$WID in circulation",
    );
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();
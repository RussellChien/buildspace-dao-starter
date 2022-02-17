import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// voting contract
const voteModule = sdk.getVoteModule(
  "0xC1cBd913d770f5cB3F904E0ff8cacFaC877d8A9e",
);

// ERC-20 contract
const tokenModule = sdk.getTokenModule(
  "0x0045cC49bd42A9f744DC5cac7db6cb9233b30FD0",
);

(async () => {
  try {
    const amount = 420_000;
    // create proposal to mint an amount of new tokens to the treasury
    await voteModule.propose(
      "Should the DAO mint an additional " + amount + " tokens into the treasury?",
      [
        {
          // nativeToken is ETH
          // nativeTokenValue is the amount of ETH we want to send in this proposal
          // for minting new tokens, set to 0 
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // minting to vode module, which is the treausury
            "mint",
            [
              voteModule.address,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),
          // token module that executes the mint.
          toAddress: tokenModule.address,
        },
      ]
    );

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    const amount = 6_900;
    // create proposal to transfer a person 6,900 tokens for being awesome
    await voteModule.propose(
      "Should the DAO transfer " +
      amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being awesome?",
      [
        {
          // reward people with governance tokens 
          // can also reward people with eth, set in amount set in nativeTokenValue
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // transfer from the treasury to wallet
            "transfer",
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),

          toAddress: tokenModule.address,
        },
      ]
    );

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();

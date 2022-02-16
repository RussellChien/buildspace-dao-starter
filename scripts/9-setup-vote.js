import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// governance contract
const voteModule = sdk.getVoteModule(
  "0xC1cBd913d770f5cB3F904E0ff8cacFaC877d8A9e",
);

// ERC-20 contract
const tokenModule = sdk.getTokenModule(
  "0x0045cC49bd42A9f744DC5cac7db6cb9233b30FD0",
);

(async () => {
  try {
    // give our treasury the power to mint additional tokens if needed
    await tokenModule.grantRole("minter", voteModule.address);

    console.log(
      "Successfully gave vote module permissions to act on token module"
    );
  } catch (error) {
    console.error(
      "failed to grant vote module permissions on token module",
      error
    );
    process.exit(1);
  }

  try {
    // grab our wallet's token balance, currently we hold basically the entire supply right now lol
    const ownedTokenBalance = await tokenModule.balanceOf(
      // wallet address is stored in env file 
      process.env.WALLET_ADDRESS
    );

    // grab 90% of the supply that we hold
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent90 = ownedAmount.div(100).mul(90);

    // transfer 90% of the supply to our voting contract
    await tokenModule.transfer(
      voteModule.address,
      percent90
    );

    console.log("✅ Successfully transferred tokens to vote module");
  } catch (err) {
    console.error("failed to transfer tokens to vote module", err);
  }
})();
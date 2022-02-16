import sdk from "./1-initialize-sdk.js";

const appModule = sdk.getAppModule(
  "0xD893d35B2ADA0eb63B301f970dee213cF26cb4F1",
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      // governance contract name
      name: "WidDAO's POWERful Proposals",

      // location of our governance token, our ERC-20 contract
      votingTokenAddress: "0x0045cC49bd42A9f744DC5cac7db6cb9233b30FD0",

      // After a proposal is created, when can members start voting?
      // currently set to immediately after proposal is created
      proposalStartWaitTimeInSeconds: 0,

      // How long do members have to vote on a proposal when it's created?
      // currently set to 24 hours (86400 seconds)
      proposalVotingTimeInSeconds: 24 * 60 * 60,

      // In order for a proposal to pass, a minimum x % of token must be used in the vote
      // currently set to 0%
      votingQuorumFraction: 0,

      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // currently set to 0
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      "✅ Successfully deployed vote module, address:",
      voteModule.address,
    );
  } catch (err) {
    console.error("Failed to deploy vote module", err);
  }
})();

import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0xD893d35B2ADA0eb63B301f970dee213cF26cb4F1");

(async () => {
  try {
    // deploy a standard ERC-20 contract
    const tokenModule = await app.deployTokenModule({
      name: "WidDAO Governance Token",
      symbol: "WID",
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenModule.address,
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();
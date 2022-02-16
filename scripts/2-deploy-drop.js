import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0xD893d35B2ADA0eb63B301f970dee213cF26cb4F1");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            name: "WidDAO Membership",
            description:  "A DAO for all fans of physics and Widmark.",
            image: "https://ipfs.io/ipfs/QmWrHFYZarTP2b1qCzG7xB45C7P2f8NvEczUfKDgiv3uEs",
            // image: readFileSync("scripts/assets/wid.png"), // local image, but can just use ipfs url
            // set to 0x0 address if free drop, otherwise set to wallet address that will recieve proceeds from the sale of membership nfts
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });

        console.log(
            "✅ Successfully deployed bundleDrop module, address:",
            bundleDropModule.address,
        );
          console.log(
            "✅ bundleDrop metadata:",
            await bundleDropModule.getMetadata(),
        );
    } catch (error) {
        console.log("failed to deploy bundleDrop module", error);
    }
})()
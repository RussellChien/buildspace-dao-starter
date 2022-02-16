import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0xEa73B3a96544A04d4e01B37b963B1fa149b86527",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        // TODO: add nft name for WidDAO and upload a picture to ipfs
        name: "Leaf Village Headband",
        description: "This NFT will give you access to NarutoDAO!",
        image: readFileSync("scripts/assets/headband.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()
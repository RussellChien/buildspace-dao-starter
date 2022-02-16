import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x79527669D0d4f97470A48B82E03c672c6ae3194d",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Lon Capa Login",
        description: "This NFT will give you access to WidDAO!",
        image: "https://ipfs.io/ipfs/QmYpSC2xcvA7KePahbp248dmkE1ingTZi5wmzMpqoV4sqi",
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()
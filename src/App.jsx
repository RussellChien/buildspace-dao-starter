import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";

const App = () => {
  // connectWallet hook given by thirdweb
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address: ", address);

  // user hasn't connected wallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to WidDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // user has wallet connected
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>);
};

export default App;

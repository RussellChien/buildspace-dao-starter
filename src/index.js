import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

// include what chains you support; Rinkeby = 4
// chain IDs: https://besu.hyperledger.org/en/stable/Concepts/NetworkID-And-ChainID/
const supportedChainIds = [4];

// include what type of wallet you support; metamask is "injected"
const connectors = {
  injected: {},
};

// Render the App component to the DOM
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <App />
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

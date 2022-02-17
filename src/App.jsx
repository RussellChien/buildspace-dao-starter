import { UnsupportedChainIdError } from "@web3-react/core";

import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk"
import { ethers } from "ethers";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x79527669D0d4f97470A48B82E03c672c6ae3194d",
);

const tokenModule = sdk.getTokenModule(
  "0x0045cC49bd42A9f744DC5cac7db6cb9233b30FD0"
);

const voteModule = sdk.getVoteModule(
  "0xC1cBd913d770f5cB3F904E0ff8cacFaC877d8A9e",
);

const App = () => {
  // connectWallet hook given by thirdweb
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address: ", address);

  // the signer is required to sign transactions on the blockchain
  // without it we can only read data, not write
  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);

  // holds the amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  // holds all of our members addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  // voting states
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // for shortening wallet addresses
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // get all existing proposals from the contract
  useEffect(async () => {
    if (!hasClaimedNFT) {
      return;
    }
    // grab all proposals 
    try {
      const proposals = await voteModule.getAll();
      setProposals(proposals);
      console.log("🌈 Proposals:", proposals);
    } catch (error) {
      console.log("failed to get proposals", error);
    }
  }, [hasClaimedNFT]);

  // checks if user has voted
useEffect(async () => {
  if (!hasClaimedNFT) {
    return;
  }
  // check if proposals have been retrieved 
  if (!proposals.length) {
    return;
  }

  // check if the user has already voted on the first proposal
  try {
    const hasVoted = await voteModule.hasVoted(proposals[0].proposalId, address);
    setHasVoted(hasVoted);
    if(hasVoted) {
      console.log("🥵 User has already voted");
    } else {
      console.log("🙂 User has not voted yet");
    }
    } catch (error) {
      console.error("Failed to check if wallet has voted", error);
    }
  }, [hasClaimedNFT, proposals, address]);

  // get address of everyone who holds membership nft
  useEffect(async () => {
    if (!hasClaimedNFT) {
      return;
    }
    // grab the users who hold our NFT with tokenId 0
    try {
      const memberAddresses = await bundleDropModule.getAllClaimerAddresses("0");
      setMemberAddresses(memberAddresses);
      console.log("🚀 Members addresses", memberAddresses);
    } catch (error) {
      console.error("failed to get member list", error);
    }
  }, [hasClaimedNFT]);

  // grabs the amount of tokens each user holds 
  useEffect(async () => {
    if (!hasClaimedNFT) {
      return;
    }
    // grab all the token balances
    try {
      const amounts = await tokenModule.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("👜 Amounts", amounts);
    } catch (error) {
      console.error("failed to get token amounts", error);
    }
  }, [hasClaimedNFT]);

  // combine memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // if address isn't in memberTokenAmounts, it means they don't hold any of our token.
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // pass the signer to the sdk, which enables us to interact with our deployed contract
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(async () => {
    // exit if no connected wallet 
    if (!address) {
      return;
    }

    // check balance 
    const balance = await bundleDropModule.balanceOf(address, "0");

    try {
      // if balance is greater than 0, they have our membership NFT
      if(balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
      } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
      }
    } catch (error) {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
    }
  }, [address]);

  // unsupported network error 
  if (error instanceof UnsupportedChainIdError ) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet.
        </p>
      </div>
    );
  }

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
  };

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>WidDAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address:</th>
                  <th>Tokens:</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async(e) => {
                e.preventDefault();
                e.stopPropagation();

                // disable button to prevent double clicks 
                setIsVoting(true);

                // get votes from the form
                const votes = proposals.map((proposal) => {
                  let voteResult = {
                    proposalId: proposal.proposalId,
                    // abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type; 
                      return;
                    }
                  });
                  return voteResult;
                });

              // make sure user delegates token to vote
              try {
                // check if wallet still needs to delegate tokens 
                const delegation = await tokenModule.getDelegationOf(address);

                if (delegation === ethers.constants.AddressZero) {
                  // delegate tokens if haven't already
                  await tokenModule.delegateTo(address);
                }
                // vote on the proposals 
                try {
                  await Promise.all(
                    votes.map(async (vote) => {
                      // get latest state of proposal
                      const proposal = await voteModule.get(vote.proposalId);
                      // check if proposal is open for voting (state === 1)
                      if (proposal.state === 1) {
                        return voteModule.vote(vote.proposalId, vote.vote);
                      }
                      return;
                    })
                  );
                  try {
                    // execute proposals 
                    await Promise.all(
                      votes.map(async (vote) => {
                        // get latest state of proposal
                        const proposal = await voteModule.get(vote.proposalId);
                        // check if proposal is ready to be executed (state === 4)
                        if (proposal.state === 4) {
                          return voteModule.execute(vote.proposalId);
                        }
                      })
                  );
                  setHasVoted(true);
                  console.log("successfully voted");
                } catch (err) {
                  console.error("failed to execute votes", err);
                }
              } catch (err) {
                console.error("failed to vote", err);
              }
            } catch (err) {
              console.error("failed to delegate tokens", err);
            } finally {
              setIsVoting(false);
            }
          }}
          >
          {proposals.map((proposal, index) => (
            <div key={proposal.proposalId} className="card">
              <h5>{proposal.description}</h5>
              <div>
                {proposal.votes.map((vote) => (
                  <div key={vote.type}>
                    <input
                      type="radio"
                      id={proposal.proposalId + "-" + vote.type}
                      name={proposal.proposalId}
                      value={vote.type}
                      // default the "abstain" vote to chedked
                      defaultChecked={vote.type === 2}
                    />
                    <label htmlFor={proposal.proposalId + "-" + vote.type}>
                      {vote.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button disabled={isVoting || hasVoted} type="submit">
            {isVoting
              ? "Voting..."
              : hasVoted
                ? "You Already Voted"
                : "Submit Votes"}
          </button>
          <small>
            This will trigger multiple transactions that you will need to
            confirm.
          </small>
        </form>
      </div>
    </div>
  </div>
);
};

  const mintNft = async () => {
    setIsClaiming(true);
    try {
      // call bundleDropModule.claim("0", 1) to mint nft to user's wallet
      await bundleDropModule.claim("0", 1);
      setHasClaimedNFT(true);
      // show user their fancy new NFT on opensea
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`);
    } catch (error) {
      console.error("failed to claim", error);
    } finally {
      // stop loading state.
      setIsClaiming(false);
    }
  }

  // render mint nft screen
  return (
    <div className="mint-nft">
      <h1>Mint your free WidDAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your nft"}
      </button>
    </div>
  );
};

export default App;

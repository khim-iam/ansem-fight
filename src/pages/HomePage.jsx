import React, { useEffect, useContext } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Leaderboard from "./Leaderboard";
import GameImage from "./GameImage";
import "./Homepage.css";

import { Context } from "../App";
function HomePage() {
  const { wifAmount, leaderboard, setLeaderboard } = useContext(Context);
  const wallet = useWallet();
  const shortenAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  const fetchInitialLeaderboard = async () => {
    try {
      const leaderboardResponse = await fetch('http://localhost:5000/api/leaderboard');
      if (!leaderboardResponse.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      const leaderboardData = await leaderboardResponse.json();
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };
  useEffect(() => {
    fetchInitialLeaderboard();
  }, []);

  return (
    <>
      {/* <GameOverPopup isOpen={isOpen} onClose={closePopUp} image={tweetImage} link={SNSlink} /> */}

      <GameImage />
      <h1 className="custom-heading text-[61px] text-[#2196F3]">
        Ansem vs. Kook
      </h1>
      <div className="card custom-heading text-[30px]">
        <p>WIF Deposited: {wifAmount}</p>
      </div>
      <div className="wallet-status custom-heading text-4xl z-30">
        {wallet.connected ? (
          <p>Connected: {shortenAddress(wallet.publicKey.toBase58())}</p>
        ) : (
          <p>Wallet not connected</p>
        )}
      </div>
      <Leaderboard leaderboard={leaderboard} />
    </>
  );
}

export default HomePage;

import { WIN_PUNCHES } from "../pages/gameConfig";
import sign from "jwt-encode";
export const handleSendData = async (wallet, randPunches) => {
  const data = {
    wallet_address: wallet.publicKey.toString(),
    punches: randPunches,
    tokens: wif,
    referredBy: referredBy,
  };

  const token = sign(data, "scrt_key");
  const userWon = randPunches > WIN_PUNCHES;
  if (userWon) {
    const finishPayload = {
      wallet_address: wallet.publicKey.toString(),
      win: 1, // Set to 1 if the user won
    };
    try {
      const finishResponse = await fetch("/api/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finishPayload),
      });
      if (!finishResponse.ok) {
        throw new Error("Failed to send finish data");
      }
      console.log("Finish Data Sent Successfully");
    } catch (error) {
      console.error("Error sending finish data:", error);
    }
  }

  await sendData(token);
};

export const sendData = async (userData) => {
  try {
    const response = await fetch("/api/wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: userData }),
    });

    if (!response.ok) {
      throw new Error("Failed to send data");
    }

    const responseData = await response.json();
    console.log("Server Response:", responseData);

    //return responseData;
  } catch (error) {
    console.error("Error sending data:", error);
  }
};

export const getLeaderboardData = async () => {
  try {
    const leaderboardResponse = await fetch("/api/leaderboard");
    if (!leaderboardResponse.ok) {
      throw new Error("Failed to fetch leaderboard data");
    }
    const leaderboardData = await leaderboardResponse.json();
    console.log("Leaderboard Data:", leaderboardData);
    // Perform calculations for top 10 players based on the received data
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
  }
};

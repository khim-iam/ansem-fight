import sign from "jwt-encode";

const ngrokUrl = 'https://6070-103-21-125-86.ngrok-free.app';
//const ngrokUrl = 'http://localhost:5000';

export const handleSendData = async (randPunches, wif, referredBy, wallet) => {
  console.log('randPunches:', randPunches);
  console.log('wif:', wif);
  console.log('referredBy:', referredBy);

  const data = {
    wallet_address: wallet.publicKey.toString(),
    punches: randPunches,
    tokens: wif,
    referredBy: referredBy 
  };


 const token = sign(data, 'scrt_key');
 const userWon = randPunches > 13;
 if (userWon) { 
  const finishPayload = {
    wallet_address: wallet.publicKey.toString(),
    win: 1 // Set to 1 if the user won
  };
  try {
    //const finishResponse = await fetch('http://localhost:5000/api/finish', {
    const finishResponse = await fetch(ngrokUrl+'/api/finish', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(finishPayload),
    });
    if (!finishResponse.ok) {
      throw new Error('Failed to send finish data');
    }
    console.log('Finish Data Sent Successfully');
  } catch (error) {
    console.error('Error sending finish data:', error);
  }
}

 await sendData(token);
  
};


export const sendData = async (userData) => {
  try {
   // const response = await fetch('http://localhost:5000/api/wallet', {
    const response = await fetch(ngrokUrl+'/api/wallet', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'

      },
      body: JSON.stringify({ token: userData }),
    });

    if (!response.ok) {
      throw new Error('Failed to send data');
    }

    const responseData = await response.json();
    console.log('Server Response:', responseData);
    
    //return responseData; 

  } catch (error) {
    console.error('Error sending data:', error);
  }
};

export const getLeaderboardData = async (updateLeaderboard) => {
  try {
    //const leaderboardResponse = await fetch('http://localhost:5000/api/leaderboard');
   // const leaderboardResponse = await fetch(ngrokUrl+'/api/leaderboard');
    const leaderboardResponse = await fetch(ngrokUrl + '/api/leaderboard', {
      headers: {
        'ngrok-skip-browser-warning': 'true' // or any other value
      }
    });
    if (!leaderboardResponse.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }
    //console.log('leaderboardResponse-  ', leaderboardResponse);
    // const textResponse = await leaderboardResponse.text();
    // console.log('Raw Response:', textResponse);


    const leaderboardData = await leaderboardResponse.json();
    //const leaderboardData = await JSON.parse(textResponse);

    console.log('Leaderboard Data:', leaderboardData);
    // Perform calculations for top 10 players based on the received data
    
    updateLeaderboard(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
  }
};

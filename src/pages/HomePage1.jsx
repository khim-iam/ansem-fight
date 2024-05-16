// import { useMemo } from "react";
// import {
//   useWallet,
// } from "@solana/wallet-adapter-react";
// import {
//   WalletMultiButton,
// } from "@solana/wallet-adapter-react-ui";
// //import { useWallet } from '@solana/wallet-adapter-react';

// // Function to shorten wallet addresses
// const shortenAddress = (address) => {
//   return `${address.slice(0, 4)}...${address.slice(-4)}`;
// };

// import React, { useState, useEffect, useRef } from "react";
// import { Howl } from "howler";
// import ansem from "../assets/start.png";
// import ansemPunch from "../assets/idlee.png";
// import t1ansemPunch from "../assets/T1-Ansem-Punch2.png";
// import t2ansemPunch from "../assets/Tier_22.png";
// import t3ansemPunch from "../assets/t33.png";
// import upansemPunch from "../assets/uppercut.png";
// import winImage from "../assets/win.png";
// import loseImage from "../assets/lose.png";
// import punchSound from "../assets/punch1.m4a";
// import winSound from "../assets/win.m4a";
// import loseSound from "../assets/lose.m4a";
// import bellSound from "../assets/bell.m4a";
// import t3Sound from "../assets/tier3powerup1.m4a";
// import bgSound from "../assets/background.mp3";
// import "./Homepage.css";
// import opponent_t1 from "../assets/cook_punch_t1.png";
// import opponent_t2 from "../assets/cook_punch_t2.png";
// import cook_dodge_1 from "../assets/dodge_1_rev.png";
// import cook_dodge_2 from "../assets/dodge_2_rev.png";
// import ansem_dodge_1 from "../assets/dodge_1.png";
// import ansem_dodge_2 from "../assets/dodge_2.png";
// import loseImage_cook from "../assets/lose_cook.png";
// import winImage_cook from "../assets/win_cook.png";
// import cook_t3_pwrup from "../assets/t33_rev.png";
// import t3_cook_win from "../assets/t3_cook_win.png";

// const SoundTypes = {
//   PUNCH: "punch",
//   WIN: "win",
//   LOSE: "lose",
//   BELL: "bell",
//   TIER3: "t3",
// };
// const dodgeProbs = {
//   t1: 0.4,
//   t2: 0.3,
//   t3: 0.2,
// };
// const imageSets = {
//   ansem_t1: [ansemPunch, t1ansemPunch],
//   ansem_t2: [ansemPunch, t1ansemPunch, t2ansemPunch],
//   ansem_t3: [ansemPunch, t3ansemPunch, upansemPunch],
//   cook_t1: [ansemPunch, opponent_t1],
//   cook_t2: [ansemPunch, opponent_t1, opponent_t2],
//   cook_t3: [ansemPunch, cook_t3_pwrup, t3_cook_win],
//   cook_dodge_1: [ansemPunch, cook_dodge_1, cook_dodge_1, cook_dodge_1, cook_dodge_1, cook_dodge_1, t1ansemPunch],
//   cook_dodge_2: [ansemPunch, cook_dodge_2, cook_dodge_2, cook_dodge_2, cook_dodge_2, cook_dodge_2, t2ansemPunch],
//   ansem_dodge_1: [ansemPunch, ansem_dodge_1, ansem_dodge_1, ansem_dodge_1, ansem_dodge_1, ansem_dodge_1, opponent_t1],
//   ansem_dodge_2: [ansemPunch, ansem_dodge_2, ansem_dodge_2, ansem_dodge_2, ansem_dodge_2, ansem_dodge_2, opponent_t2],
//   default: [ansem, ansemPunch, t1ansemPunch],
//   result_ansem: [loseImage, winImage],
//   result_cook: [loseImage_cook, t3_cook_win],
// };

// const sounds = {
//   [SoundTypes.PUNCH]: punchSound,
//   [SoundTypes.WIN]: winSound,
//   [SoundTypes.LOSE]: loseSound,
//   [SoundTypes.BELL]: bellSound,
//   [SoundTypes.TIER3]: t3Sound,
//   background: bgSound,
// };

// //cp this
// const PunchesConfig = [
//   {
//     minPunches: 1,
//     maxPunches: 15,
//     imageArr_p1: imageSets.ansem_t1,
//     imageArr_p2: imageSets.cook_t1,
//   },
//   {
//     minPunches: 16,
//     maxPunches: 50,
//     imageArr_p1: imageSets.ansem_t2,
//     imageArr_p2: imageSets.cook_t2,
//   },
//   {
//     minPunches: 35,
//     maxPunches: 50,
//     imageArr_p1: imageSets.ansem_t3,
//     imageArr_p2: imageSets.cook_t3,
//   },
// ];
// const SPEED = 2;

// function HomePage() {

//     const wallet = useWallet();

//   const [wifAmount, setWifAmount] = useState(0);
//   const [punches, setPunches] = useState(0);
//   const [currentImageArray, setCurrentImageArray] = useState(imageSets.default);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const intervalRef = useRef(null);
//   const soundRef = useRef({
//     punch: new Howl({ src: [sounds[SoundTypes.PUNCH]], volume: 0.5 }),
//     win: new Howl({ src: [sounds[SoundTypes.WIN]], volume: 0.5 }),
//     lose: new Howl({ src: [sounds[SoundTypes.LOSE]], volume: 0.5 }),
//     bell: new Howl({ src: [sounds[SoundTypes.BELL]], volume: 0.5 }),
//     tier3: new Howl({ src: [sounds[SoundTypes.TIER3]], volume: 0.5 }),
//     background: new Howl({ src: [sounds.background], loop: true, volume: 0.1 }),
//   });
//   const containerRef = useRef(null);
//   const [leaderboard, setLeaderboard] = useState([
//     { name: "Player One", score: 50 },
//     { name: "Player Two", score: 45 },
//     { name: "Player Three", score: 30 },
//   ]);

//   const [buttomPressed, setButtonPressed] = useState(false);
//   const depositButtonRef = useRef(null);
//   const [player, setPlayer] = useState(null);

//   const [flipImages, setFlipImages] = useState(false);
//   useEffect(() => {
//     depositButtonRef.current.focus();
//   }, []);
//   useEffect(() => {
//     const handlePunchSound = () => {
//       setTimeout(() => {
//         containerRef.current.classList.add("cameraShake");
//         setTimeout(() => {
//           containerRef.current.classList.remove("cameraShake");
//         }, 50 / SPEED); // remove the class after 75ms
//       }, 30 / SPEED); // add the class 200ms before the punch sound plays
//     };

//     soundRef.current.punch.on("play", (id, seek) => {
//       setTimeout(handlePunchSound, seek / SPEED - 1 / SPEED); // add cameraShake 100ms before playback
//     });

//     return () => {
//       soundRef.current.punch.off("play", handlePunchSound);
//     };
//   }, [soundRef, containerRef]);
//   useEffect(() => {
//     // Try to play background music on load
//     try {
//       soundRef.current.background.play();
//     } catch (error) {
//       console.error("Background music failed to play:", error);
//     }

//     return () => {
//       soundRef.current.background.stop(); // Stop background sound on unmount
//     };
//   }, []);

//   const playSound = (soundType, forcePlay = false) => {
//     if (soundType === "background" && soundRef.current[soundType].playing()) {
//       return;
//     }

//     if (forcePlay || soundType !== SoundTypes.PUNCH) {
//       soundRef.current[soundType].stop();
//     }

//     soundRef.current[soundType].play();
//   };
//   const updateLeaderboard = (newScore) => {
//     setLeaderboard((current) =>
//       [...current, newScore].sort((a, b) => b.score - a.score),
//     );
//   };
//   const handleImageUpdate = (maxRuns, imageSet, delay, npunch) => {
//     let runCount = 0;
//     // let numPunchesBeforeT3 = imageSet === imageSets.t3 ? Math.random() * 10 : 0;
//     clearInterval(intervalRef.current);
//     const id = setInterval(
//       async () => {
//         if (runCount >= maxRuns) {
//           clearInterval(intervalRef.current);
//           intervalRef.current = null;
//           setFlipImages(false);
//           setPlayer(null);
//           setCurrentImageArray(
//             player === "ansem" ? imageSets.result_ansem : imageSets.result_cook,
//           );
//           setCurrentImageIndex(npunch > 35 ? 1 : 0);
//           playSound(npunch > 35 ? SoundTypes.WIN : SoundTypes.LOSE);
//           if (!(imageSet === imageSets.cook_t3 || imageSet === imageSets.ansem_t3)){
//             playSound(SoundTypes.PUNCH);
//           }
//           handleDefault();
//           // resume background music
//           setButtonPressed(false);
//           setPunches(0);
//           return;
//         }

//         let currentImages = [...imageSet];

//         if (imageSet === imageSets.ansem_t1 || imageSet === imageSets.cook_t1) {
//           const dodges = Math.random() < dodgeProbs.t1 ? true : false;
//           if (dodges) {
//             currentImages =
//               player === "ansem"
//                 ? Math.random() < 0.5
//                   ? imageSets.ansem_dodge_1
//                   : imageSets.ansem_dodge_2
//                 : Math.random() < 0.5
//                   ? imageSets.cook_dodge_1
//                   : imageSets.cook_dodge_2;
//           }
//         } else if (
//           imageSet === imageSets.ansem_t2 ||
//           imageSet === imageSets.cook_t2
//         ) {
//           const dodges = Math.random() < dodgeProbs.t2 ? true : false;
//           if (dodges) {
//             currentImages =
//               player === "ansem"
//                 ? Math.random() < 0.5
//                   ? imageSets.ansem_dodge_1
//                   : imageSets.ansem_dodge_2
//                 : Math.random() < 0.5
//                   ? imageSets.cook_dodge_1
//                   : imageSets.cook_dodge_2;
//           } else {
//             const numPunches = Math.random() < 0.5 ? 1 : 2;
//             const punches = shuffleArray(imageSet.slice(1)).slice(
//               0,
//               numPunches,
//             );
//             currentImages = [imageSet[0], ...punches];
//           }
//         } else if (
//           imageSet === imageSets.ansem_t3 ||
//           imageSet === imageSets.cook_t3
//         ) {
//           if (runCount + 1 !== maxRuns){
//             const dodges = Math.random() < dodgeProbs.t3 ? true : false;
//             currentImages = Math.random() > 0.5 ?
//                               player === "ansem"
//                                 ? imageSets.ansem_t1
//                                 : imageSets.cook_t1
//                               : player === "ansem"
//                                 ? imageSets.ansem_t2
//                                 : imageSets.cook_t2;
//             if (dodges) {
//               currentImages =
//                 player === "ansem"
//                   ? Math.random() < 0.5
//                     ? imageSets.ansem_dodge_1
//                     : imageSets.ansem_dodge_2
//                   : Math.random() < 0.5
//                     ? imageSets.cook_dodge_1
//                     : imageSets.cook_dodge_2;
//             }
//           }
//         }

//         setCurrentImageArray(currentImages);
//         for (let i = 0; i < currentImages.length; i++) {
//           setTimeout(
//             () => {
//               //excluding dodge sequence from flip
//               if (
//                 currentImages[i] === cook_t3_pwrup ||
//                 currentImages[i] === t3_cook_win
//               ) {
//                 setFlipImages(false); // Set flip images to false
//               } else if (
//                 currentImages[i] === ansem_dodge_1 ||
//                 currentImages[i] === ansem_dodge_2 ||
//                 currentImages[i] === cook_dodge_1 ||
//                 currentImages[i] === cook_dodge_2
//               ) {
//                 setFlipImages(false);
//               } else if (player === "kook") {
//                 setFlipImages(true); // Reset flip for cook
//               }
//               if (
//                 currentImages[i] === t3ansemPunch ||
//                 currentImages[i] === cook_t3_pwrup
//               ) {
//                 soundRef.current.tier3.play();
//               } else if (
//                 !(currentImages[i] === ansem_dodge_1 ||
//                 currentImages[i] === ansem_dodge_2 ||
//                 currentImages[i] === cook_dodge_1 ||
//                 currentImages[i] === cook_dodge_2 || currentImages[i] === ansemPunch)
//               ) {
//                 // Play punch sound for all but the last image
//                 setTimeout(() => playSound(SoundTypes.PUNCH), 2 / SPEED);
//                 setPunches((p) => p + 1);
//               }
//               setCurrentImageIndex(i);
//             },
//             (i % 4 / SPEED) *
//               ((currentImages[i] === upansemPunch ||
//                 currentImages[i] === t3_cook_win)
//                 ? 800 / SPEED
//                 : 750 / SPEED),
//           );
//         }

//         runCount++
//       },
//       delay / SPEED + 2000 / SPEED,
//     );
//     intervalRef.current = id;
//   };
//   // Fisher-Yates (Knuth) shuffle function for array randomization
//   function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));

//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   }

//   const handleDefault = () => {
//     clearInterval(intervalRef.current);
//     const id = setInterval(() => {
//       setCurrentImageIndex(0);
//       setCurrentImageArray(imageSets.default);
//     }, 2000 / SPEED);
//     intervalRef.current = id;
//   };

//   const generatePunches = (minPunches, maxPunches) => {
//     return (
//       (Math.floor(Math.random() * (maxPunches - minPunches + 1)) + minPunches)
//     );
//   };
//   //cp this

//   const handleDeposit = () => {

//     if (!(wallet.connected)) { // Check if wallet is connected
//       alert("Please connect wallet.");
//       return;
//     }

//     if (!player) { // Check if player is selected
//       alert("Please select a player.");
//       return;
//     }

//     const inputWif = prompt("Enter WIF amount (positive number):");
//     const wif = Number(inputWif);
//     //console.log(wif);

//     if (isNaN(wif) || wif <= 0) {
//       alert("Please enter a positive number for WIF amount."); // Alert for invalid input
//       return;
//     }

//     if (!isNaN(wif) && wif > 0 && player) {
//       setButtonPressed(true);
//       playSound(SoundTypes.BELL);
//       setWifAmount(wif);
//       let minPunches, maxPunches, imageArr_p1, imageArr_p2;

//       if (wif >= 1) {
//         // removed the condition wif <= 40
//         ({ minPunches, maxPunches, imageArr_p1, imageArr_p2 } =
//           wif == 1
//             ? PunchesConfig[0]
//             : wif < 41
//               ? PunchesConfig[1]
//               : PunchesConfig[2]);
//         const randPunches = generatePunches(minPunches, maxPunches);

//         if (player === "ansem") {
//           setFlipImages(false);
//           setCurrentImageArray(imageArr_p1);
//           handleImageUpdate(randPunches, imageArr_p1, 0, randPunches);
//         } else if (player === "kook") {
//           setFlipImages(true);
//           setCurrentImageArray(imageArr_p2);
//           handleImageUpdate(randPunches, imageArr_p2, 0, randPunches);
//         }
//       } else if (isNaN(wif) || !wif > 0) {
//         alert("Please enter a positive number for WIF amount.");
//         return;
//       } else {
//         alert("Please select a player");
//         return;
//       }
//     }
//   };

//   //cp this
//   const handlePlayerChange = (event) => {
//     setPlayer(event.target.value);
//   };

//   return (
//     <>

//       <div ref={containerRef} className="image-container relative">
//         <img
//           src={currentImageArray[currentImageIndex]}
//           alt="Game character"
//           className={`${flipImages ? "scale-x-[-1]" : ""}`}
//         />
//       </div>
//       <h1 className="custom-heading text-[61px] text-[#2196F3]">
//         Ansem vs. Kook
//       </h1>
//       <div className="card custom-heading text-[30px]">
//         {/* cp this */}
//         <div className="mb-4">
//           <div className="text-4xl">Choose characters</div>
//           <div className="space-x-4 flex mb-8 justify-center text-3xl">
//             <label>
//               <input
//                 type="radio"
//                 value="ansem"
//                 checked={player === "ansem"}
//                 onClick={handlePlayerChange}
//               />{" "}
//               Ansem
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 value="kook"
//                 checked={player === "kook"}
//                 onChange={handlePlayerChange}
//               ></input>{" "}
//               Kook
//             </label>
//           </div>
//         </div>

//         <div className="container">
//           <div
//             className={`pixel2 custom-heading text-[36px] ${buttomPressed ? "cursor-none" : ""}`}
//             ref={depositButtonRef}
//             disabled={buttomPressed}
//             onClick={handleDeposit}
//           >
//             Deposit WIF
//           </div>

//           <div className="wallet-section">
//         <WalletMultiButton />
//         <div className="wallet-status">
//           {wallet.connected ? (
//             <p>Connected: {shortenAddress(wallet.publicKey.toBase58())}</p>
//           ) : (
//             <p>Wallet not connected</p>
//           )}
//         </div>
//       </div>

//         </div>
//         <p>WIF Deposited: {wifAmount}</p>
//         <p>Punches Landed: {punches}</p>
//       </div>
//       <div className="leaderboard custom-heading">
//         <h2 className="text-5xl">Leaderboard</h2>
//         <ul className="text-3xl">
//           {leaderboard.map((entry, index) => (
//             <li key={index}>
//               {entry.name}: {entry.score}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// }

// export default HomePage;

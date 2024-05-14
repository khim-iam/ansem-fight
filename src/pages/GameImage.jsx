import { useContext } from "react";
import ansem from "../assets/start.png";
import DepositButton from "./DepositButton";
import CharacterSelection from "./CharacterSelection";
import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  SoundTypes,
  dogeProbs,
  imageSets,
  sounds,
  PunchesConfig,
  SPEED,
  WIN_PUNCHES
} from "./gameConfig"; // Assuming these are extracted to a config file
import { Howl } from "howler";

import ansemPunch from "../assets/idlee.png";
import t3ansemPunch from "../assets/t33.png";
import upansemPunch from "../assets/uppercut.png";
import "./Homepage.css";
import cook_doge_1 from "../assets/doge_1_rev.png";
import cook_doge_2 from "../assets/doge_2_rev.png";
import ansem_doge_1 from "../assets/doge_1.png";
import ansem_doge_2 from "../assets/doge_2.png";
import cook_t3_pwrup from "../assets/t33_rev.png";
import t3_cook_win from "../assets/t3_cook_win.png";
import t1ansemPunch from "../assets/T1-Ansem-Punch2.png";
import t2ansemPunch from "../assets/Tier_22.png";
import opponent_t1 from "../assets/cook_punch_t1.png";
import opponent_t2 from "../assets/cook_punch_t2.png";
import GameOverPopup from "./GameOverPopUp";
import winImage from "../assets/win.png";
import loseImage from "../assets/lose.png";
import loseImage_cook from "../assets/lose_cook.png";
import { Context } from "../App";



import "@solana/wallet-adapter-react-ui/styles.css";

import * as SolanaWeb3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";

export default function GameImage() {
  const containerRef = useRef(null);

  const intervalRef = useRef(null);

  const wallet = useWallet();
  const [punches, setPunches] = useState(0);


  // const [currentImageArray, setCurrentImageArray] = useState(imageSets.default);
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [currentImage, setCurrentImage] = useState(imageSets.default[0]);
  const [flipImages, setFlipImages] = useState(false);
  const {wifAmount, setWifAmount, player, setPlayer} = useContext(Context);
  const [tweetImage, setTweetImage] = useState(t3_cook_win);
  const [isOpen, setIsOpen] = useState(false);
  const [SNSlink, setSNSLink] = useState("");
  const [doges, setDoges] = useState(0);
  const playSound = (soundType, forcePlay = false) => {
    if (soundType === "background" && soundRef.current[soundType].playing()) {
      return;
    }

    if (forcePlay || soundType !== SoundTypes.PUNCH) {
      soundRef.current[soundType].stop();
    }

    soundRef.current[soundType].play();
  };
  const soundRef = useRef({
    punch: new Howl({ src: [sounds[SoundTypes.PUNCH]], volume: 0.5 }),
    win: new Howl({ src: [sounds[SoundTypes.WIN]], volume: 0.5 }),
    lose: new Howl({ src: [sounds[SoundTypes.LOSE]], volume: 0.5 }),
    bell: new Howl({ src: [sounds[SoundTypes.BELL]], volume: 0.5 }),
    tier3: new Howl({ src: [sounds[SoundTypes.TIER3]], volume: 0.5 }),
    background: new Howl({ src: [sounds.background], loop: true, volume: 0.1 }),
  });

  useEffect(() => {
    const handlePunchSound = () => {
      setTimeout(() => {
        containerRef.current.classList.add("cameraShake");
        setTimeout(() => {
          containerRef.current.classList.remove("cameraShake");
        }, 50 / SPEED); // remove the class after 75ms
      }, 30 / SPEED); // add the class 200ms before the punch sound plays
    };

    soundRef.current.punch.on("play", (id, seek) => {
      setTimeout(handlePunchSound, seek / SPEED - 1 / SPEED); // add cameraShake 100ms before playback
    });

    return () => {
      soundRef.current.punch.off("play", handlePunchSound);
    };
  }, [soundRef, containerRef]);
  useEffect(() => {
    // Try to play background music on load
    try {
      soundRef.current.background.play();
    } catch (error) {
      console.error("Background music failed to play:", error);
    }

    return () => {
      soundRef.current.background.stop(); // Stop background sound on unmount
    };
  }, []);

//////////////////////////////  TOKEN TRANSFER //////////////////////////////////////////

const tokenMintAddress = 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr';
// const toAddress = '7GVhtvwWeVZxKgXwTexDGtzxXGFcxLzkeXzRS5cRfwmD';


const getOrCreateAssociatedTokenAccount = async (connection,
  mint,
  owner) => {
    const associatedToken = await splToken.getAssociatedTokenAddress(mint, owner);

    let account;
    try{
      account = await splToken.getAccount(connection, associatedToken);
    }catch (error){
      if (error instanceof splToken.TokenAccountNotFoundError || error instanceof splToken.TokenInvalidAccountOwnerError){
        try{
          const transaction = new SolanaWeb3.Transaction().add(
            splToken.createAssociatedTokenAccountInstruction(
              wallet.publicKey,
              associatedToken,
              owner,
              mint
            )
          );
          
          await wallet.sendTransaction(transaction, connection);
        }catch(error){

        }
        account = await splToken.getAccount(connection, associatedToken);
      }else{
        throw error;
      }
    }
    return account;
}
const transfer= async (toAddress,amount)=> {
  //if (!wallet.connected || !wallet.publicKey) {
    if (!wallet.connected) {

    alert("Please connect your wallet first.");
    return;
  }
const connection = new SolanaWeb3.Connection("https://api.devnet.solana.com/");
const mintPublicKey = new SolanaWeb3.PublicKey(tokenMintAddress);  
const {TOKEN_PROGRAM_ID} = splToken;
const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                mintPublicKey,
                wallet.publicKey
              );
const destPublicKey = new SolanaWeb3.PublicKey(toAddress);
const associatedDestinationTokenAddr = await getOrCreateAssociatedTokenAccount(
                connection,
                mintPublicKey,
                destPublicKey
              );
//const instructions: solanaWeb3.TransactionInstruction[] = [];
const instructions = [];

instructions.push(
                splToken.createTransferInstruction(
                  fromTokenAccount.address,
                  associatedDestinationTokenAddr.address,
                  wallet.publicKey,
                  amount,
                  [],
                  TOKEN_PROGRAM_ID
                )
              );

const transaction = new SolanaWeb3.Transaction().add(...instructions);
const blockhash = await connection.getLatestBlockhash();
transaction.feePayer = wallet.publicKey;
transaction.recentBlockhash = blockhash.blockhash;
//change1
const signed = await wallet.signTransaction(transaction);
const transactionSignature = await connection.sendRawTransaction(
                signed.serialize(),
              { skipPreflight: true }
              );
// const transactionSignature = await connection.sendRawTransaction(
//                 transaction.serialize(),
//                 { skipPreflight: true }
//               );
              const strategy = {
                blockhash: blockhash.blockhash,
                lastValidBlockHeight: blockhash.lastValidBlockHeight,
                signature: transactionSignature
              }
              await connection.confirmTransaction(strategy);
              console.log("Confirmed");
}
///////////////////////////////////////////////////////////////////////


  const handleDeposit = async () => {
    if (!wallet.connected) {
      // Check if wallet is connected
      alert("Please connect wallet.");
      return;
    }

    if (!player) {
      // Check if player is selected
      alert("Please select a player.");
      return;
    }

    const inputWif = prompt("Enter WIF amount (positive number):");
    const wif = Number(inputWif);
 
    if (isNaN(wif) || wif <= 0) {
      alert("Please enter a positive number for WIF amount."); // Alert for invalid input
      return;
    }

    if (!isNaN(wif) && wif > 0 && player) {
      await transfer('7GVhtvwWeVZxKgXwTexDGtzxXGFcxLzkeXzRS5cRfwmD', wif * Math.pow(10, 6));

      playSound(SoundTypes.BELL);
      setWifAmount(wif);
      console.log(wifAmount);
      let minPunches, maxPunches, imageArr_p1, imageArr_p2;

      if (wif > 0) {
        // removed the condition wif <= 40
        ({ minPunches, maxPunches, imageArr_p1, imageArr_p2 } =
          wif <= 1
            ? PunchesConfig[0] // t1
            : wif < 41
              ? PunchesConfig[1] // t2
              : PunchesConfig[2]); // t3
        const randPunches = generatePunches(minPunches, maxPunches);

        if (player === "ansem") {
          setFlipImages(false);
          // setCurrentImageArray(imageArr_p1);
          setCurrentImage(imageArr_p1[0]);
          handleImageUpdate(randPunches, imageArr_p1, 0, randPunches, wif);
        } else if (player === "kook") {
          setFlipImages(true);
          // setCurrentImageArray(imageArr_p2);
          setCurrentImage(imageArr_p2[0]);
          handleImageUpdate(randPunches, imageArr_p2, 0, randPunches, wif);
        }
      }
    }
  };
  const cleanup = (imageSet, npunch, wif) => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setFlipImages(false);
    // setCurrentImageArray(
    //   player === "ansem" ? imageSets.result_ansem : imageSets.result_cook,
    // );
    // setCurrentImageIndex(npunch > 35 ? 1 : 0);
    console.log(npunch);
    setCurrentImage(player === "ansem" ? imageSets.result_ansem[npunch > WIN_PUNCHES ? 1 : 0] : imageSets.result_cook[npunch > WIN_PUNCHES ? 1 : 0]);
    playSound(npunch > 35 ? SoundTypes.WIN : SoundTypes.LOSE);
    if (!(imageSet === imageSets.cook_t3 || imageSet === imageSets.ansem_t3)) {
      playSound(SoundTypes.PUNCH);
    }

    setSNSLink(generateLink(npunch, wif));
    setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    
    setTweetImage(npunch > WIN_PUNCHES ? player === "ansem" ? winImage : t3_cook_win : player==="kook" ? loseImage : loseImage_cook);
    setPlayer(null);
    handleDefault();
    // resume background music
    setPunches(0);
    setDoges(0);
  };
  useEffect(() => {
    console.log(wifAmount);
  }, [wifAmount]);

  const render = (currentImages) => {
    for (let i = 0; i < currentImages.length; i++) {
      setTimeout(
        () => {
          //excluding doge sequence from flip
          if (
            currentImages[i] === cook_t3_pwrup ||
            currentImages[i] === t3_cook_win
          ) {
            setFlipImages(false); // Set flip images to false
          } else if (
            currentImages[i] === ansem_doge_1 ||
            currentImages[i] === ansem_doge_2 ||
            currentImages[i] === cook_doge_1 ||
            currentImages[i] === cook_doge_2
          ) {
            setFlipImages(false);
          } else if (player === "kook") {
            setFlipImages(true); // Reset flip for cook
          }

          if (
            currentImages[i] === t3ansemPunch ||
            currentImages[i] === cook_t3_pwrup
          ) {
            soundRef.current.tier3.play();
          } else if (
            !(
              currentImages[i] === ansem_doge_1 ||
              currentImages[i] === ansem_doge_2 ||
              currentImages[i] === cook_doge_1 ||
              currentImages[i] === cook_doge_2 ||
              currentImages[i] === ansemPunch
            )
          ) {
            // Play punch sound for all but the last image
            setTimeout(() => playSound(SoundTypes.PUNCH), 2 / SPEED);
            if((
              player === "kook" && !(currentImages[i] === t1ansemPunch ||currentImages[i] === t2ansemPunch)
            ) || (
              player==="ansem" && !(currentImages[i] === opponent_t1 || currentImages[i] === opponent_t2)
            )){
              setPunches((p) => p + 1);
            }else{
              setDoges((d) => d + 1);
            }
          }
          if (currentImage !== currentImages[i]){
            setCurrentImage(currentImages[i])
          }
        },
        ((i % 4)) *
          (currentImages[i] === upansemPunch ||
          currentImages[i] === t3_cook_win
            ? 800 / SPEED
            : 750 / SPEED),
      );
    }
  }
  const randomizeAndSetPunchSequence = (imageSet, runCount, maxRuns) => {
    let currentImages = [...imageSet];

    if (imageSet === imageSets.ansem_t1 || imageSet === imageSets.cook_t1) {
      const doges = Math.random() < dogeProbs.t1 ? true : false;
      if (doges) {
        currentImages =
          player === "ansem"
            ? Math.random() < 0.5
              ? imageSets.ansem_doge_1
              : imageSets.ansem_doge_2
            : Math.random() < 0.5
              ? imageSets.cook_doge_1
              : imageSets.cook_doge_2;
      }
    } else if (
      imageSet === imageSets.ansem_t2 ||
      imageSet === imageSets.cook_t2
    ) {
      const doges = Math.random() < dogeProbs.t2 ? true : false;
      if (doges) {
        currentImages =
          player === "ansem"
            ? Math.random() < 0.5
              ? imageSets.ansem_doge_1
              : imageSets.ansem_doge_2
            : Math.random() < 0.5
              ? imageSets.cook_doge_1
              : imageSets.cook_doge_2;
      } else {
        const numPunches = Math.random() < 0.5 ? 1 : 2;
        const punches = shuffleArray(imageSet.slice(1)).slice(0, numPunches);
        currentImages = [imageSet[0], ...punches];
      }
    } else if (
      imageSet === imageSets.ansem_t3 ||
      imageSet === imageSets.cook_t3
    ) {
      if (runCount + 1 !== maxRuns) {
        const doges = Math.random() < dogeProbs.t3 ? true : false;
        currentImages =
          Math.random() > 0.5
            ? player === "ansem"
              ? imageSets.ansem_t1
              : imageSets.cook_t1
            : player === "ansem"
              ? imageSets.ansem_t2
              : imageSets.cook_t2;
        if (doges) {
          currentImages =
            player === "ansem"
              ? Math.random() < 0.5
                ? imageSets.ansem_doge_1
                : imageSets.ansem_doge_2
              : Math.random() < 0.5
                ? imageSets.cook_doge_1
                : imageSets.cook_doge_2;
        }
      }
    }
    return currentImages;
  };

  const handleImageUpdate = (maxRuns, imageSet, delay, npunch, wif) => {
    let runCount = 0;
    clearInterval(intervalRef.current);
    const id = setInterval(
      async () => {
        if (runCount >= maxRuns) {
          //cleanup
          cleanup(imageSet, npunch, wif);
          return;
        }

        let currentImages = randomizeAndSetPunchSequence(
          imageSet,
          runCount,
          maxRuns,
        );

        // setCurrentImageArray(currentImages);
        setCurrentImage(currentImage[0]);
        render(currentImages);

        runCount++;
      },
      delay / SPEED + 2000 / SPEED,
    );
    intervalRef.current = id;
  };
  // Fisher-Yates (Knuth) shuffle function for array randomization
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleDefault = () => {
    clearInterval(intervalRef.current);
    const id = setInterval(() => {
      // setCurrentImageIndex(0);
      // setCurrentImageArray(imageSets.default);
      setCurrentImage(imageSets.default[0]);
    }, 2000 / SPEED);
    intervalRef.current = id;
  };

  const generatePunches = (minPunches, maxPunches) => {
    return (
      Math.floor(Math.random() * (maxPunches - minPunches + 1)) + minPunches
    );
  };


  const closePopUp = () => {
    setIsOpen(false);
    setSNSLink("");
    setWifAmount(0);
  };

  const generateLink = (npunch, wif) => {
    const text = `I landed ${npunch} punches and donated ${wif} !!!!`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&image=${tweetImage}`
  }

  const [characterSelection, setCharacterSelection] = useState(false);
  const handleOnDeposit = () => {
    setCharacterSelection(true);
  }

  const onCharacterSelected = async() => {
    setCharacterSelection(false);
    await handleDeposit();
  }
  return (
    <>
    <GameOverPopup isOpen={isOpen} onClose={closePopUp} image={tweetImage} link={SNSlink} />
    <div ref={containerRef} className="image-container relative overflow-hidden">
      {currentImage !== ansem && <div className="absolute left-7 text-3xl custom-heading"><p>Punches Landed: {punches}</p><p>Doges: {doges}</p></div>}
      {!characterSelection && currentImage === ansem && <div className="absolute bottom-8 scale-[135%]"><DepositButton text="Play" onDeposit={handleOnDeposit} isDisabled={false}/></div>}
      {characterSelection ? 
        <div className="">
          <CharacterSelection/>
          <DepositButton className="absolute bottom-8 right-[31.25%]" text="Start Game" onDeposit={onCharacterSelected} isDisabled={false}/>
        </div> 
        :       
        <img
          src={currentImage}
          alt="Game character"
          className={`${flipImages ? "scale-x-[-1]" : ""}`}
        />
      }
    </div>
    </>
  );
}
// {!characterSelection && currentImageArray[currentImageIndex] === ansem && <div className="absolute bottom-8 scale-[135%]"><DepositButton onDeposit={handleOnDeposit} isDisabled={false}/></div>}
import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import CharacterSelection from "./CharacterSelection";
import WalletSection from "./WalletSection";
import Leaderboard from "./Leaderboard";
import GameImage from "./GameImage";
import DepositButton from "./DepositButton";
import {
  SoundTypes,
  dogeProbs,
  imageSets,
  sounds,
  PunchesConfig,
  SPEED,
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

function HomePage() {
  const containerRef = useRef(null);

  const intervalRef = useRef(null);

  const wallet = useWallet();
  const [punches, setPunches] = useState(0);

  const [player, setPlayer] = useState(null);
  const [leaderboard, setLeaderboard] = useState([
    { name: "Player One", score: 50 },
    { name: "Player Two", score: 45 },
    { name: "Player Three", score: 30 },
  ]);
  const [currentImageArray, setCurrentImageArray] = useState(imageSets.default);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [flipImages, setFlipImages] = useState(false);
  const [wifAmount, setWifAmount] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(false);
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

  const handleDeposit = () => {
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
    //console.log(wif);

    if (isNaN(wif) || wif <= 0) {
      alert("Please enter a positive number for WIF amount."); // Alert for invalid input
      return;
    }

    if (!isNaN(wif) && wif > 0 && player) {
      setButtonPressed(true);
      playSound(SoundTypes.BELL);
      setWifAmount(wif);
      let minPunches, maxPunches, imageArr_p1, imageArr_p2;

      if (wif >= 1) {
        // removed the condition wif <= 40
        ({ minPunches, maxPunches, imageArr_p1, imageArr_p2 } =
          wif == 1
            ? PunchesConfig[0]
            : wif < 41
              ? PunchesConfig[1]
              : PunchesConfig[2]);
        const randPunches = generatePunches(minPunches, maxPunches);

        if (player === "ansem") {
          setFlipImages(false);
          setCurrentImageArray(imageArr_p1);
          handleImageUpdate(randPunches, imageArr_p1, 0, randPunches);
        } else if (player === "kook") {
          setFlipImages(true);
          setCurrentImageArray(imageArr_p2);
          handleImageUpdate(randPunches, imageArr_p2, 0, randPunches);
        }
      } else if (isNaN(wif) || !wif > 0) {
        alert("Please enter a positive number for WIF amount.");
        return;
      } else {
        alert("Please select a player");
        return;
      }
    }
  };
  const cleanup = (imageSet, npunch) => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setFlipImages(false);
    setPlayer(null);
    setCurrentImageArray(
      player === "ansem" ? imageSets.result_ansem : imageSets.result_cook,
    );
    setCurrentImageIndex(npunch > 35 ? 1 : 0);
    playSound(npunch > 35 ? SoundTypes.WIN : SoundTypes.LOSE);
    if (!(imageSet === imageSets.cook_t3 || imageSet === imageSets.ansem_t3)) {
      playSound(SoundTypes.PUNCH);
    }
    handleDefault();
    // resume background music
    setButtonPressed(false);
    setPunches(0);
  };

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
            setPunches((p) => p + 1);
          }
          setCurrentImageIndex(i);
        },
        ((i % 4) / SPEED) *
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

  const handleImageUpdate = (maxRuns, imageSet, delay, npunch) => {
    let runCount = 0;
    clearInterval(intervalRef.current);
    const id = setInterval(
      async () => {
        if (runCount >= maxRuns) {
          //cleanup
          cleanup(imageSet, npunch);
          return;
        }

        let currentImages = randomizeAndSetPunchSequence(
          imageSet,
          runCount,
          maxRuns,
        );

        setCurrentImageArray(currentImages);

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
      setCurrentImageIndex(0);
      setCurrentImageArray(imageSets.default);
    }, 2000 / SPEED);
    intervalRef.current = id;
  };

  const generatePunches = (minPunches, maxPunches) => {
    return (
      Math.floor(Math.random() * (maxPunches - minPunches + 1)) + minPunches
    );
  };

  return (
    <>
      <GameImage
        currentImageArray={currentImageArray}
        currentImageIndex={currentImageIndex}
        flipImages={flipImages}
        containerRef={containerRef}
      />
      <h1 className="custom-heading text-[61px] text-[#2196F3]">
        Ansem vs. Kook
      </h1>
      <div className="card custom-heading text-[30px] space-y-2">
        <CharacterSelection
          player={player}
          onPlayerChange={(e) => setPlayer(e.target.value)}
        />
        <DepositButton onDeposit={handleDeposit} isDisabled={buttonPressed} />
        <WalletSection wallet={wallet} />
        <p>WIF Deposited: {wifAmount}</p>
        <p>Punches Landed: {punches}</p>
      </div>
      <Leaderboard leaderboard={leaderboard} />
    </>
  );
}

export default HomePage;

import React, { useState, useEffect, useRef } from 'react';
// Import assets and howler
import { Howl } from 'howler';
import ansem from '../assets/start.png'; 
import ansemPunch from '../assets/idlee.png';
import t1ansemPunch from '../assets/T1-Ansem-Punch2.png';
import t2ansemPunch from '../assets/Tier_22.png';
import t3ansemPunch from '../assets/t33.png';
import upansemPunch from '../assets/uppercut.png';
import winImage from '../assets/win.png';
import loseImage from '../assets/lose.png';
import punchSound from '../assets/punch.m4a';
import winSound from '../assets/win.m4a';
import loseSound from '../assets/lose.m4a';
import bellSound from '../assets/bell.m4a';
import t3Sound from '../assets/tier3powerup.m4a';
import bgSound from '../assets/background.mp3';
import "./Homepage.css"

const SoundTypes = {
  PUNCH: 'punch',
  WIN: 'win',
  LOSE: 'lose',
  BELL: 'bell',
  TIER3: 't3'
};

const imageSets = {
  t1: [ansemPunch, t1ansemPunch],
  t2: [ansemPunch, t1ansemPunch, t2ansemPunch],
  t3: [ansemPunch, t3ansemPunch, upansemPunch],
  default: [ansem, ansemPunch, t1ansemPunch],
  result: [loseImage, winImage]
};

const sounds = {
  [SoundTypes.PUNCH]: punchSound,
  [SoundTypes.WIN]: winSound,
  [SoundTypes.LOSE]: loseSound,
  [SoundTypes.BELL]: bellSound,
  [SoundTypes.TIER3]: t3Sound,
  background: bgSound
};

const PunchesConfig = [{
  minPunches: 1,
  maxPunches: 15,
  imageArr: imageSets.t1
},
{
  minPunches: 16,
  maxPunches: 50,
  imageArr: imageSets.t2
},
{
  minPunches: 51,
  maxPunches: 100,
  imageArr: imageSets.t3
}];

function HomePage() {
  const [wifAmount, setWifAmount] = useState(0);
  const [punches, setPunches] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [currentImageArray, setCurrentImageArray] = useState(imageSets.default);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const soundRef = useRef(null);

  useEffect(() => {
      if (!soundRef.current) {
          soundRef.current = new Howl({ src: [sounds.background], autoplay: true, loop: true, volume: 0.1 });
      }
      if (!soundRef.current.playing()) {
          soundRef.current.play();
      }
      return () => clearInterval(intervalId);
  }, [intervalId]);

  const playSound = (soundType) => {
    return new Promise((resolve, reject) => {
      const sound = new Audio(sounds[soundType]);
      sound.play();
      sound.onended = resolve;
      sound.onerror = reject;
    });
  };
  const handleImageUpdate = (maxRuns, imageSet, delay, npunch) => {
    let runCount = 0;
    clearInterval(intervalId);
    const id = setInterval(async () => {
      if (runCount >= maxRuns) {
        clearInterval(id);
        setIntervalId(null);
        setCurrentImageArray(imageSets.result);
        setCurrentImageIndex(npunch > 35 ? 1 : 0);
        await playSound(npunch > 35 ? SoundTypes.WIN : SoundTypes.LOSE);
        handleDefault();
        return;
      }
      for (let i = 0; i < 3; i++) {
        if (i < 2) { // play punch sound for punch 1 and punch 2
          await playSound(SoundTypes.PUNCH);
        }
        setTimeout(() => {
          setCurrentImageIndex(i % imageSet.length);
        }, i * 500); // flip through the 3 punch images (punch 1, punch 2, stance)
      }
      setPunches(p => p - 1);
      runCount++;
    }, 2000); // adjust the interval time to control the speed of the image flip sequence
    setIntervalId(id);
  };
  const handleDefault = () => {
      clearInterval(intervalId);
      const id = setInterval(() => {
          setCurrentImageIndex(0);
          setCurrentImageArray(imageSets.default);
      }, 2000);
      setIntervalId(id);
  };

  const generatePunches = (minPunches, maxPunches) => {
    const x = Math.floor(Math.random() * (maxPunches - minPunches + 1)) + minPunches;
    setPunches(x);  // This should only set the initial state
    return x;
  };

  const handleDeposit = () => {
      const inputWif = prompt("Enter WIF amount (positive number):");
      const wif = Number(inputWif);
      if (wif > 0) {
          playSound(SoundTypes.BELL);
          setWifAmount(wif);
          let minPunches, maxPunches, imageArr;

          if (wif <= 40) {
            if (wif === 1) {
              ({minPunches, maxPunches, imageArr} = PunchesConfig[0]);
            } else {
              ({minPunches, maxPunches, imageArr} = PunchesConfig[1]);
            }


          const randPunches = generatePunches(minPunches, maxPunches);
          setCurrentImageArray(imageArr);
          handleImageUpdate(randPunches, imageArr, 0, randPunches);
          } else {
            ({minPunches, maxPunches, imageArr} = PunchesConfig[2]);
            playSound(SoundTypes.TIER3);

          const randPunches = generatePunches(minPunches, maxPunches);
          setCurrentImageArray(imageArr);
          handleImageUpdate(randPunches, imageArr, 2000, randPunches);
          
        }
  // Adjusted to use randPunches directly
      } else {
          alert("Please enter a positive number for WIF amount.");
      }
  };

  return (
      <>
          <div className="image-container relative">
              <img src={currentImageArray[currentImageIndex]} alt="Game character" />
          </div>
          <h1 className="custom-heading text-6xl text-[#2196F3]">Ansem vs. Barney</h1>
          <div className="card custom-heading text-[25px]">
              <button onClick={handleDeposit}>Deposit WIF</button> 
              <p>WIF Deposited: {wifAmount}</p>
              <p>Punches Landed: {punches}</p> 
          </div>
      </>
  );
}

export default HomePage;
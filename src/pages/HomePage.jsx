import React, { useState, useEffect, useRef } from 'react';
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
const SPEED = 2;
function HomePage() {
  const [wifAmount, setWifAmount] = useState(0);
  const [punches, setPunches] = useState(0);
  const [currentImageArray, setCurrentImageArray] = useState(imageSets.default);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);
  const soundRef = useRef({
    punch: new Howl({ src: [sounds[SoundTypes.PUNCH]], volume: 0.5 }),
    win: new Howl({ src: [sounds[SoundTypes.WIN]], volume: 0.5 }),
    lose: new Howl({ src: [sounds[SoundTypes.LOSE]], volume: 0.5 }),
    bell: new Howl({ src: [sounds[SoundTypes.BELL]], volume: 0.5 }),
    tier3: new Howl({ src: [sounds[SoundTypes.TIER3]], volume: 0.5 }),
    background: new Howl({ src: [sounds.background], loop: true, volume: 0.1 })
  });
  const containerRef = useRef(null);
  const [leaderboard, setLeaderboard] = useState([
    { name: "Player One", score: 50 },
    { name: "Player Two", score: 45 },
    { name: "Player Three", score: 30 }
]);

const [buttomPressed, setButtonPressed] = useState(false);
const depositButtonRef = useRef(null);

  useEffect(() => {
    depositButtonRef.current.focus()
  },[]);
  useEffect(() => {
    const handlePunchSound = () => {
      setTimeout(() => {
        containerRef.current.classList.add('cameraShake');
        setTimeout(() => {
          containerRef.current.classList.remove('cameraShake');
        }, 50/SPEED); // remove the class after 75ms
      }, 30/SPEED  ); // add the class 200ms before the punch sound plays
    };
    
    soundRef.current.punch.on('play', (id, seek) => {
      setTimeout(handlePunchSound, seek/SPEED - 1/SPEED); // add cameraShake 100ms before playback
    }); 
  
    return () => {
      soundRef.current.punch.off('play', handlePunchSound);
    };
  }, [soundRef, containerRef]);
  useEffect(() => {
    playSound('background');  // Play background music when component mounts

    return () => {
        clearInterval(intervalRef.current);
        soundRef.current.background.stop();  // Ensure background sound is stopped on unmount
    };
  }, []);

  const playSound = (soundType, forcePlay = false) => {
    if (soundType === 'background' && soundRef.current[soundType].playing()) {
        return;
    }

    if (forcePlay || soundType !== SoundTypes.PUNCH) {
        soundRef.current[soundType].stop();
    }

    soundRef.current[soundType].play();
  };
  const updateLeaderboard = (newScore) => {
    setLeaderboard(current => [...current, newScore].sort((a, b) => b.score - a.score));
};
const handleImageUpdate = (maxRuns, imageSet, delay, npunch) => {
  let runCount = 0;
  clearInterval(intervalRef.current);
  const id = setInterval(async () => {
    if (runCount >= maxRuns) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setCurrentImageArray(imageSets.result);
      setCurrentImageIndex(npunch > 35 ? 1 : 0);
      await playSound(npunch > 35 ? SoundTypes.WIN : SoundTypes.LOSE);
      handleDefault();
      soundRef.current.tier3.stop(); // stop tier3 sound
      soundRef.current.background.play(); // resume background music
      setButtonPressed(false);
      setPunches(0);
      return;
    }

    let currentImages = [...imageSet];
    if (imageSet === imageSets.t2) {
      const numPunches = Math.random() < 0.5 ? 1 : 2;
      const punches = shuffleArray(imageSet.slice(1)).slice(0, numPunches);
      currentImages = [imageSet[0], ...punches];
    }

    for (let i = 0; i < currentImages.length; i++) {
      setTimeout(() => {
        if (imageSet === imageSets.t3 && i === 0) {
          // soundRef.current.background.stop(); // stop background music
          setTimeout(() => {
            soundRef.current.tier3.play(); // start T3 music after a delay
          }, 0); // adjust the delay time as needed
        }else if (i < currentImages.length - 1) { // Play punch sound for all but the last image
          setTimeout(() => playSound(SoundTypes.PUNCH), 2/SPEED)
        }
        setCurrentImageIndex(i % currentImages.length);
      }, i/SPEED * (imageSet === imageSets.t3 && i === 0 ? 800/SPEED : 750/SPEED));
    }

    if (imageSet === imageSets.t3){
      runCount = maxRuns;
    }else{
      runCount++;
    }
    
    setPunches(p => p - 1);
  }, delay/SPEED + 2000/SPEED);
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
      }, 2000/SPEED);
      intervalRef.current = id;
  };

  const generatePunches = (minPunches, maxPunches) => {
    const x = Math.floor(Math.random() * (maxPunches - minPunches + 1)) + minPunches;
    setPunches(x);
    return x;
  };

  const handleDeposit = () => {
    const inputWif = prompt("Enter WIF amount (positive number):");
    const wif = Number(inputWif);
    if (!isNaN(wif) && wif > 0) {
      setButtonPressed(true);
      playSound(SoundTypes.BELL);
      setWifAmount(wif);
      let minPunches, maxPunches, imageArr;
  
      if (wif >= 1) { // removed the condition wif <= 40
        ({minPunches, maxPunches, imageArr} = wif == 1 ? PunchesConfig[0] : wif < 41 ? PunchesConfig[1] : PunchesConfig[2]);
        const randPunches = generatePunches(minPunches, maxPunches);
        setCurrentImageArray(imageArr);
        handleImageUpdate(randPunches, imageArr, 0, randPunches);
      } else {
        alert("Please enter a positive number for WIF amount.");
      }
    }
  };

  return (
      <>
          <div ref={containerRef} className="image-container relative">
  <img src={currentImageArray[currentImageIndex]} alt="Game character" />
</div>  
          <h1 className="custom-heading text-[61px] text-[#2196F3]">Ansem vs. Barney</h1>
          <div className="card custom-heading text-[30px]">
              {/* <button onClick={handleDeposit} >Deposit WIF</button>  */}
              <div class="container">
                
                <div className={`pixel2 custom-heading text-[36px] ${buttomPressed ? "cursor-none" : ""}`} ref={depositButtonRef} disabled={buttomPressed} onClick={handleDeposit}>Deposit WIFs</div>
              </div>
              <p>WIF Deposited: {wifAmount}</p>
              <p>Punches Landed: {punches}</p> 
          </div>

          <div className="leaderboard custom-heading">
                <h2 className='text-5xl'>Leaderboard</h2>
                <ul className='text-3xl'>
                    {leaderboard.map((entry, index) => (
                        <li key={index}>{entry.name}: {entry.score}</li>
                    ))}
                </ul>
            </div>
      </>
  );
}

export default HomePage;
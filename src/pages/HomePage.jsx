import ansem from '../assets/start.png'; 
import barney from '../assets/barney.png'; 
import ansemPunch from '../assets/idlee.png';
import t1ansemPunch from '../assets/T1-Ansem-Punch2.png';
import t2ansemPunch from '../assets/Tier_22.png';
import t3ansemPunch from '../assets/t33.png';
import upansemPunch from '../assets/uppercut.png';
import { useState, useEffect } from 'react';
import "./Homepage.css"

function HomePage() {
    const [wifAmount, setWifAmount] = useState(0);
    const [punches, setPunches] = useState(0);
    const [intervalId, setIntervalId] = useState(null); // 
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

  
    const images = [ansem, ansemPunch, t1ansemPunch];
    const t1Images = [ansemPunch, t1ansemPunch];
    const t2Images = [ansemPunch, t1ansemPunch, t2ansemPunch];
    const t3Images = [ansemPunch, t3ansemPunch, upansemPunch];

    
    const [currentImageArray, setCurrentImageArray] = useState(images); // Start with Ansem images

  
  
    useEffect(() => {
      return () => {
        clearInterval(intervalId);
      };
    }, [intervalId]);
  
    const handleImageUpdate = (maxRuns, Arr, tym) => {
      let runCount = 0;
      // Clear any existing intervals to prevent multiple intervals running at the same time
      if (intervalId) {
        clearInterval(intervalId);
      }
  
      // Set up a new interval
      const id = setInterval(() => {
        if (runCount >= maxRuns) {
          clearInterval(id);
          setIntervalId(null); // Reset the interval ID state
          setCurrentImageIndex(0);
          setCurrentImageArray(images);

          return;
        }
        let len = Arr.length;
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % len );
        runCount++; // Increment the run count each time the interval fires
      }, 500+tym);// Change image every 1000 milliseconds (1 second)
  
      setIntervalId(id);
    };
  
    const handleDeposit = () => {
      const inputWif = prompt("Enter WIF amount (positive number):");
      const wif = Number(inputWif);

     
      
      if (wif > 0) {
        setWifAmount(wif);
  
        let minPunches, maxPunches;
        if (wif === 1) {
          minPunches = 1;
          maxPunches = 15;
          
        } else if (wif <= 40) {
          minPunches = 16;
          maxPunches = 50;
        } else {
          minPunches = 51;  
          maxPunches = 100; // Adjust upper limit as needed
        }
  
        const generatedPunches = Math.floor(Math.random() * (maxPunches - minPunches + 1)) + minPunches;
        setPunches(generatedPunches);
        if (wif === 1) {
          setCurrentImageArray(t1Images);
          handleImageUpdate(2*generatedPunches, t1Images, 0);
          
        } else if (wif <= 40) {
          setCurrentImageArray(t2Images);
          handleImageUpdate(2*generatedPunches, t2Images, 0);
        } else {
          setCurrentImageArray(t3Images);
          handleImageUpdate(2, t3Images, 2500);
        }
       // setCurrentImageArray(t1Images);
       // handleImageUpdate(2*generatedPunches, currentImageArray);
      } else {
        alert("Please enter a positive number for WIF amount.");
      }
    };
  
  return (
    <>
      
    
      <div className="image-container relative">
        <div className= "w-10 h-5 bg-white">
          
        </div>
        <img src={currentImageArray[currentImageIndex]} alt="Ansem" className="image" /> 
      </div>
      <h1 className="custom-heading text-6xl text-[#2196F3]">Ansem vs. Barney</h1>
        <div className="card custom-heading text-[25px]">
        <button onClick={handleDeposit}>Deposit WIF</button> 
        <p>WIF Deposited: {wifAmount}</p>
        <p>Punches Landed: {punches}</p> 
      </div>


    </>
  )
}

export default HomePage
import ansem from '../assets/ansem.png'; 
import barney from '../assets/barney.png'; 
import ansemPunch from '../assets/ansem-punch.png';
import { useState, useEffect } from 'react';

function HomePage() {
    const [wifAmount, setWifAmount] = useState(0);
    const [punches, setPunches] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
    const images = [ansem, ansemPunch];
  
  
    useEffect(() => {
      return () => {
        clearInterval(intervalId);
      };
    }, [intervalId]);
  
    const handleImageUpdate = (maxRuns) => {
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
          return;
        }
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        runCount++; // Increment the run count each time the interval fires
      }, 500);// Change image every 1000 milliseconds (1 second)
  
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
        handleImageUpdate(2*generatedPunches);
      } else {
        alert("Please enter a positive number for WIF amount.");
      }
    };
  
  return (
      <>
    
      <div className="image-container">
        <img src={images[currentImageIndex]} alt="Ansem" className="image" /> 
        <img src={barney} alt="Barney" className="image" />
      </div>
      <h1>Ansem vs. Barney</h1>
      <div className="card">
        <button onClick={handleDeposit}>Deposit WIF</button> 
        <p>WIF Deposited: {wifAmount}</p>
        <p>Punches Landed: {punches}</p> 
      </div>

    </>
  )
}

export default HomePage
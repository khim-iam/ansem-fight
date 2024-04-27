import { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import ansem from './assets/ansem.png'; 
import barney from './assets/barney.png'; 
import ansemPunch from './assets/ansem-punch.png';

function App() {
  const [wifAmount, setWifAmount] = useState(0);
  const [punches, setPunches] = useState(0);

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
    } else {
      alert("Please enter a positive number for WIF amount.");
    }
  };

  const ansemImageRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Use index for clarity
  const images = [ansem, ansemPunch]; // Array of image paths

  useEffect(() => {
    let intervalId;
    let punchCount = 0; 

    const changeImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      ansemImageRef.current.src = images[currentImageIndex];

      punchCount++;
      if (punchCount >= punches) {
        clearInterval(intervalId);
        ansemImageRef.current.src = ansem; // Set back to default image
      }
    };
  
    if (punches > 0) {
      changeImage(); // Display the first image immediately
      intervalId = setInterval(changeImage, 1500); 
    }

    return () => clearInterval(intervalId); 
  }, [punches, images]); // Include 'images' in dependency array

  return (
    <>
    
      <div className="image-container">
        <img ref={ansemImageRef} src={ansem} alt="Ansem" className="image" /> 
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

export default App

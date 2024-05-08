import { useState } from "react";
import ansem from "../assets/start.png";
import DepositButton from "./DepositButton";
import CharacterSelection from "./CharacterSelection";
export default function GameImage({
  currentImageArray,
  currentImageIndex,
  flipImages,
  containerRef,
  punches,
  onDeposit,
  player,
  setPlayer
}) {
  const [characterSelection, setCharacterSelection] = useState(false);
  const handleOnDeposit = () => {
    setCharacterSelection(true);
  }

  const onCharacterSelected = () => {
    setCharacterSelection(false);
    onDeposit();
  }
  return (
    <div ref={containerRef} className="image-container relative overflow-hidden">
      {currentImageArray[currentImageIndex] !== ansem && <p className="left-7 text-3xl absolute custom-heading">Punches Landed: {punches}</p>}
      {!characterSelection && currentImageArray[currentImageIndex] === ansem && <div className="absolute bottom-8 scale-[135%]"><DepositButton text="Play" onDeposit={handleOnDeposit} isDisabled={false}/></div>}
      {characterSelection ? 
        <div className="">
          <CharacterSelection player={player} setPlayer={setPlayer}/>
          <div className="absolute bottom-8 left-0 right-0 scale-[110%]">
            <DepositButton text="Start Game" onDeposit={onCharacterSelected} isDisabled={false}/>
          </div>
        </div> 
        :       
        <img
          src={currentImageArray[currentImageIndex]}
          alt="Game character"
          className={`${flipImages ? "scale-x-[-1]" : ""}`}
        />
      }
    </div>
  );
}
// {!characterSelection && currentImageArray[currentImageIndex] === ansem && <div className="absolute bottom-8 scale-[135%]"><DepositButton onDeposit={handleOnDeposit} isDisabled={false}/></div>}
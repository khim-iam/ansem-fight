import { useWallet } from "@solana/wallet-adapter-react";
import WalletSection from "./WalletSection";
import DepositButton from "./DepositButton";
import ansem from "../assets/StartGame11.png";
import kook from "../assets/startkook.png";
export default function CharacterSelection({ player, setPlayer}) {
  const wallet = useWallet();
  const onPlayerChange = (e) => {
    setPlayer(e.target.value);
  }
  return (
    <div className="custom-heading w-full h-0">
      <div className="text-7xl">Choose characters</div>
      <div className="space-x-24 flex mb-8 justify-center text-5xl items-center">
      <label className={`${player==="ansem" ? "text-red-500" : "text-white"}`}>
          <input
            type="radio"
            value="ansem"
            checked={player === "ansem"}
            onChange={onPlayerChange}
            className="appearance-none"
          />{" "}
          Ansem
          <img className={`absolute right-[26%] scale-x-[60%] scale-[85%] top-[15%] hover:brightness-100 ${player==="ansem" ? " brightness-100 -z-10" : "brightness-50 -z-20"}`} src={ansem}/>
        </label>
        <label className={`${player==="kook" ? "text-red-500" : "text-white"}`}>
          <input
            type="radio"
            value="kook"
            checked={player === "kook"}
            onChange={onPlayerChange}
            className="appearance-none"
          />{" "}
          Kook
          <img className={`absolute left-[27%] scale-[82%] top-[12%] hover:brightness-100 ${player==="kook" ? "brightness-100 -z-10" : "brightness-50 -z-20"}`} src={kook}/>
        </label>
      </div>

      <WalletSection wallet={wallet} />
    </div>
  );
}

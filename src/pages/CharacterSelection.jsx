export default function CharacterSelection({ player, onPlayerChange }) {
  return (
    <div className="mb-4">
      <div className="text-4xl">Choose characters</div>
      <div className="space-x-4 flex mb-8 justify-center text-3xl">
        <label>
          <input
            type="radio"
            value="ansem"
            checked={player === "ansem"}
            onChange={onPlayerChange}
          />{" "}
          Ansem
        </label>
        <label>
          <input
            type="radio"
            value="kook"
            checked={player === "kook"}
            onChange={onPlayerChange}
          />{" "}
          Kook
        </label>
      </div>
    </div>
  );
}

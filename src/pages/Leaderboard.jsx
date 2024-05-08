export default function Leaderboard({ leaderboard }) {
  return (
    <div className="leaderboard custom-heading ">
      <h2 className="text-5xl text-amber-500">Leaderboard</h2>
      <ul className="text-3xl">
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name}: {entry.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

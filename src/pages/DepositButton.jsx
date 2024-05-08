export default function DepositButton({ onDeposit, isDisabled, text }) {
  return (
    <div
      className={`pixel2 px-6 py-0 custom-heading text-[36px] ${isDisabled ? "cursor-none" : ""}`}
      onClick={onDeposit}
    >
      {text}
    </div>
  );
}

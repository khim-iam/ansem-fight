export default function DepositButton({ onDeposit, isDisabled }) {
  return (
    <div
      className={`pixel2 custom-heading text-[36px] ${isDisabled ? "cursor-none" : ""}`}
      onClick={onDeposit}
    >
      Deposit WIF
    </div>
  );
}

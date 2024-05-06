export default function GameImage({
  currentImageArray,
  currentImageIndex,
  flipImages,
  containerRef,
}) {
  return (
    <div ref={containerRef} className="image-container relative">
      <img
        src={currentImageArray[currentImageIndex]}
        alt="Game character"
        className={`${flipImages ? "scale-x-[-1]" : ""}`}
      />
    </div>
  );
}

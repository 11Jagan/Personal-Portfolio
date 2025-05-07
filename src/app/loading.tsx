
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm transition-opacity duration-300 ease-in-out animate-fadeIn">
      <div className="loading-shapes-container">
        <div className="loading-shape loading-circle" aria-label="loading shape circle"></div>
        <div className="loading-shape loading-square" aria-label="loading shape square"></div>
        <div className="loading-shape loading-triangle" aria-label="loading shape triangle"></div>
      </div>
    </div>
  );
}

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  isGameOver: boolean;
  isPaused: boolean;
}

export function TouchControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  isGameOver,
  isPaused
}: TouchControlsProps) {
  const handleTouchStart = (callback: () => void) => (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isGameOver && !isPaused) {
      callback();
    }
  };

  return (
    <div className="bg-black/60 rounded-2xl p-2 backdrop-blur-md border border-white/10 w-full max-w-sm mx-auto shadow-2xl">
      {/* Top Row - Rotate and Hard Drop */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <button
          onTouchStart={handleTouchStart(onRotate)}
          className="h-12 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl text-lg font-bold active:scale-95 transition-all duration-100 disabled:opacity-50 shadow-lg border border-yellow-400/20"
          disabled={isGameOver || isPaused}
        >
          ↻ 회전
        </button>
        <button
          onTouchStart={handleTouchStart(onHardDrop)}
          className="h-12 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-base font-bold active:scale-95 transition-all duration-100 disabled:opacity-50 shadow-lg border border-red-400/20"
          disabled={isGameOver || isPaused}
        >
          ⚡ 드롭
        </button>
      </div>
      
      {/* Bottom Row - Movement Controls */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onTouchStart={handleTouchStart(onMoveLeft)}
          className="h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-xl font-bold active:scale-95 transition-all duration-100 disabled:opacity-50 shadow-lg flex items-center justify-center border border-blue-400/20"
          disabled={isGameOver || isPaused}
        >
          ←
        </button>
        <button
          onTouchStart={handleTouchStart(onMoveDown)}
          className="h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-xl font-bold active:scale-95 transition-all duration-100 disabled:opacity-50 shadow-lg flex items-center justify-center border border-blue-400/20"
          disabled={isGameOver || isPaused}
        >
          ↓
        </button>
        <button
          onTouchStart={handleTouchStart(onMoveRight)}
          className="h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-xl font-bold active:scale-95 transition-all duration-100 disabled:opacity-50 shadow-lg flex items-center justify-center border border-blue-400/20"
          disabled={isGameOver || isPaused}
        >
          →
        </button>
      </div>
    </div>
  );
}
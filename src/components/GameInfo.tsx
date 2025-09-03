
interface GameInfoProps {
  score: number;
  level: number;
  lines: number;
  dropSpeed: number;
}

export function GameInfo({ score, level, lines, dropSpeed }: GameInfoProps) {
  return (
    <div className="bg-black/30 rounded-xl p-3 sm:p-4 md:p-5 backdrop-blur-sm border border-white/10">
      <div className="mb-3 sm:mb-4 md:mb-5">
        <h3 className="mb-1 sm:mb-1.5 md:mb-2 text-sm sm:text-base md:text-lg text-gray-300 font-normal">점수</h3>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">{score.toLocaleString()}</p>
      </div>
      <div className="mb-3 sm:mb-4 md:mb-5">
        <h3 className="mb-1 sm:mb-1.5 md:mb-2 text-sm sm:text-base md:text-lg text-gray-300 font-normal">레벨</h3>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">{level}</p>
      </div>
      <div className="mb-3 sm:mb-4 md:mb-5">
        <h3 className="mb-1 sm:mb-1.5 md:mb-2 text-sm sm:text-base md:text-lg text-gray-300 font-normal">줄</h3>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">{lines}</p>
      </div>
      <div>
        <h3 className="mb-1 sm:mb-1.5 md:mb-2 text-sm sm:text-base md:text-lg text-gray-300 font-normal">속도</h3>
        <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300 drop-shadow-md">{dropSpeed}ms</p>
      </div>
    </div>
  );
}
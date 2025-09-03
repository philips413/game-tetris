
interface GameInfoProps {
  score: number;
  level: number;
  lines: number;
  dropSpeed: number;
}

export function GameInfo({ score, level, lines, dropSpeed }: GameInfoProps) {
  return (
    <div className="bg-black/30 rounded-xl p-5 backdrop-blur-sm border border-white/10">
      <div className="mb-5">
        <h3 className="mb-2 text-lg text-gray-300 font-normal">점수</h3>
        <p className="text-3xl font-bold text-white drop-shadow-md">{score.toLocaleString()}</p>
      </div>
      <div className="mb-5">
        <h3 className="mb-2 text-lg text-gray-300 font-normal">레벨</h3>
        <p className="text-3xl font-bold text-white drop-shadow-md">{level}</p>
      </div>
      <div className="mb-5">
        <h3 className="mb-2 text-lg text-gray-300 font-normal">줄</h3>
        <p className="text-3xl font-bold text-white drop-shadow-md">{lines}</p>
      </div>
      <div>
        <h3 className="mb-2 text-lg text-gray-300 font-normal">속도</h3>
        <p className="text-2xl font-bold text-yellow-300 drop-shadow-md">{dropSpeed}ms</p>
      </div>
    </div>
  );
}
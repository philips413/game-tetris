import type {Tetromino} from '../types';

interface NextPieceProps {
  nextPiece: Tetromino | null;
}

export function NextPiece({ nextPiece }: NextPieceProps) {
  if (!nextPiece) return null;
  
  return (
    <div className="bg-black/30 rounded-xl p-5 text-center backdrop-blur-sm border border-white/10">
      <h3 className="mb-4 text-xl text-white">다음 블록</h3>
      <div className="flex flex-col items-center gap-0.5 min-h-20 justify-center">
        {nextPiece.shape.map((row, y) => (
          <div key={y} className="flex gap-0.5">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`w-5 h-5 rounded-sm border border-white/10 ${
                  cell ? 'border-white/30 shadow-inner shadow-white/20' : ''
                }`}
                style={{ backgroundColor: cell ? nextPiece.color : 'transparent' }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
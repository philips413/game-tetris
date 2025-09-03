import type {Board as BoardType, GamePiece} from '../types';

interface BoardProps {
  board: BoardType;
  currentPiece: GamePiece | null;
}

export function Board({ board, currentPiece }: BoardProps) {
  const displayBoard = board.map(row => [...row]);
  
  if (currentPiece) {
    const { tetromino, position } = currentPiece;
    
    for (let y = 0; y < tetromino.shape.length; y++) {
      for (let x = 0; x < tetromino.shape[y].length; x++) {
        if (tetromino.shape[y][x]) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          
          if (boardY >= 0 && boardY < displayBoard.length && boardX >= 0 && boardX < displayBoard[0].length) {
            displayBoard[boardY][boardX] = tetromino.color;
          }
        }
      }
    }
  }
  
  return (
    <div className="grid grid-rows-20 gap-px bg-black border-4 border-gray-600 rounded-lg p-1 shadow-2xl">
      {displayBoard.map((row, y) => (
        <div key={y} className="grid grid-cols-10 gap-px">
          {row.map((cell, x) => (
            <div
              key={x}
              className={`w-7 h-7 border border-white/10 rounded-sm transition-colors duration-100 ${
                cell 
                  ? 'border-white/30 shadow-inner shadow-white/20' 
                  : 'bg-gray-800'
              }`}
              style={{ backgroundColor: cell || undefined }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
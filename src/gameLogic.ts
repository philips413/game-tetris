import type {Board, GamePiece, Position, Tetromino} from './types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export function createEmptyBoard(): Board {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

export function isValidPosition(board: Board, piece: GamePiece): boolean {
  const { tetromino, position } = piece;
  
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;
        
        if (
          newX < 0 || 
          newX >= BOARD_WIDTH || 
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX])
        ) {
          return false;
        }
      }
    }
  }
  
  return true;
}

export function placePiece(board: Board, piece: GamePiece): Board {
  const newBoard = board.map(row => [...row]);
  const { tetromino, position } = piece;
  
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        
        if (boardY >= 0) {
          newBoard[boardY][boardX] = tetromino.color;
        }
      }
    }
  }
  
  return newBoard;
}

export function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { newBoard, linesCleared };
}

export function rotateTetromino(tetromino: Tetromino): Tetromino {
  const size = tetromino.shape.length;
  const rotatedShape = Array(size).fill(null).map(() => Array(size).fill(0));
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotatedShape[x][size - 1 - y] = tetromino.shape[y][x];
    }
  }
  
  return {
    ...tetromino,
    shape: rotatedShape
  };
}

export function canMovePiece(board: Board, piece: GamePiece, direction: 'left' | 'right' | 'down'): boolean {
  const newPosition: Position = { ...piece.position };
  
  switch (direction) {
    case 'left':
      newPosition.x -= 1;
      break;
    case 'right':
      newPosition.x += 1;
      break;
    case 'down':
      newPosition.y += 1;
      break;
  }
  
  const newPiece: GamePiece = { ...piece, position: newPosition };
  return isValidPosition(board, newPiece);
}

export function movePiece(piece: GamePiece, direction: 'left' | 'right' | 'down'): GamePiece {
  const newPosition: Position = { ...piece.position };
  
  switch (direction) {
    case 'left':
      newPosition.x -= 1;
      break;
    case 'right':
      newPosition.x += 1;
      break;
    case 'down':
      newPosition.y += 1;
      break;
  }
  
  return { ...piece, position: newPosition };
}

export function calculateScore(linesCleared: number, level: number): number {
  const basePoints = [0, 40, 100, 300, 1200];
  return basePoints[linesCleared] * (level + 1);
}

export function calculateLevel(totalLines: number): number {
  // 더 빈번한 레벨업을 위해 공식 개선
  // 레벨 0-10: 5줄마다 레벨업
  // 레벨 11-20: 8줄마다 레벨업  
  // 레벨 21+: 10줄마다 레벨업
  
  if (totalLines < 50) {
    return Math.floor(totalLines / 5);
  } else if (totalLines < 130) {
    // 레벨 10에서 50줄, 이후 8줄마다
    return 10 + Math.floor((totalLines - 50) / 8);
  } else {
    // 레벨 20에서 130줄, 이후 10줄마다
    return 20 + Math.floor((totalLines - 130) / 10);
  }
}

export function getDropSpeed(level: number): number {
  // 초기 속도 800ms에서 시작
  // 레벨 1-10: 선형적으로 감소 (80ms씩)
  // 레벨 11-20: 더 빠르게 감소 (40ms씩)
  // 레벨 21+: 매우 빠르게 감소하되 최소 40ms 유지
  
  if (level === 0) {
    return 800; // 시작 속도
  } else if (level <= 10) {
    return Math.max(120, 800 - (level * 80));
  } else if (level <= 20) {
    return Math.max(80, 120 - ((level - 10) * 40));
  } else {
    // 레벨 21+ 에서는 지수적으로 빨라지되 최소 40ms 보장
    const baseSpeed = 80;
    const speedReduction = Math.floor((level - 20) * 20);
    return Math.max(40, baseSpeed - speedReduction);
  }
}
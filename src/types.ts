export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  shape: number[][];
  type: TetrominoType;
  color: string;
}

export interface GamePiece {
  tetromino: Tetromino;
  position: Position;
}

export type Board = (string | null)[][];

export interface GameState {
  board: Board;
  currentPiece: GamePiece | null;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
}
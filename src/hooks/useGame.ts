import {useCallback, useEffect, useRef, useState} from 'react';
import type {GamePiece, GameState} from '../types';
import {getRandomTetromino} from '../tetrominoes';
import {
    BOARD_WIDTH,
    calculateLevel,
    calculateScore,
    canMovePiece,
    clearLines,
    createEmptyBoard,
    getDropSpeed,
    isValidPosition,
    movePiece,
    placePiece,
    rotateTetromino
} from '../gameLogic';
import { useAudioContext } from '../contexts/AudioContext';

const initialGameState: GameState = {
  board: createEmptyBoard(),
  currentPiece: null,
  nextPiece: null,
  score: 0,
  level: 0,
  lines: 0,
  isGameOver: false,
  isPaused: false,
};

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const gameLoopRef = useRef<number | null>(null);
  const lastDropTimeRef = useRef<number>(0);
  const { playDropSound, playLineClearSound, playGameOverSound } = useAudioContext();

  const createNewPiece = useCallback((tetromino = getRandomTetromino()): GamePiece => {
    const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2);
    return {
      tetromino,
      position: { x: startX, y: 0 }
    };
  }, []);

  const initializeGame = useCallback(() => {
    const firstPiece = createNewPiece();
    const nextPiece = getRandomTetromino();
    
    setGameState({
      ...initialGameState,
      board: createEmptyBoard(),
      currentPiece: firstPiece,
      nextPiece: nextPiece,
    });
  }, [createNewPiece]);


  const movePieceDown = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      if (canMovePiece(prevState.board, prevState.currentPiece, 'down')) {
        return {
          ...prevState,
          currentPiece: movePiece(prevState.currentPiece, 'down')
        };
      }
      return prevState;
    });
  }, []);

  const movePieceLeft = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      if (canMovePiece(prevState.board, prevState.currentPiece, 'left')) {
        return {
          ...prevState,
          currentPiece: movePiece(prevState.currentPiece, 'left')
        };
      }
      return prevState;
    });
  }, []);

  const movePieceRight = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      if (canMovePiece(prevState.board, prevState.currentPiece, 'right')) {
        return {
          ...prevState,
          currentPiece: movePiece(prevState.currentPiece, 'right')
        };
      }
      return prevState;
    });
  }, []);

  const rotatePiece = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      const rotatedTetromino = rotateTetromino(prevState.currentPiece.tetromino);
      const rotatedPiece: GamePiece = {
        ...prevState.currentPiece,
        tetromino: rotatedTetromino
      };

      if (isValidPosition(prevState.board, rotatedPiece)) {
        return {
          ...prevState,
          currentPiece: rotatedPiece
        };
      }
      return prevState;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }

      let dropPiece = prevState.currentPiece;
      while (canMovePiece(prevState.board, dropPiece, 'down')) {
        dropPiece = movePiece(dropPiece, 'down');
      }

      // 하드 드롭 소리
      playDropSound();
      
      const newBoard = placePiece(prevState.board, dropPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      // 라인이 클리어되었을 때 소리
      if (linesCleared > 0) {
        playLineClearSound();
      }
      
      const newLines = prevState.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore = prevState.score + calculateScore(linesCleared, prevState.level);
      
      const newCurrentPiece = prevState.nextPiece ? createNewPiece(prevState.nextPiece) : null;
      const newNextPiece = getRandomTetromino();
      
      const isGameOver = newCurrentPiece ? !isValidPosition(clearedBoard, newCurrentPiece) : true;
      
      // 게임 오버 시 소리
      if (isGameOver) {
        playGameOverSound();
      }
      
      return {
        ...prevState,
        board: clearedBoard,
        currentPiece: isGameOver ? null : newCurrentPiece,
        nextPiece: isGameOver ? null : newNextPiece,
        score: newScore,
        level: newLevel,
        lines: newLines,
        isGameOver,
      };
    });
  }, [createNewPiece]);

  const pauseGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isPaused: !prevState.isPaused
    }));
  }, []);

  const restartGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const gameLoop = useCallback((timestamp: number) => {
    setGameState(currentState => {
      if (currentState.isGameOver || currentState.isPaused) {
        return currentState;
      }

      if (!lastDropTimeRef.current) {
        lastDropTimeRef.current = timestamp;
      }

      const dropSpeed = getDropSpeed(currentState.level);
      
      if (timestamp - lastDropTimeRef.current > dropSpeed) {
        if (currentState.currentPiece && canMovePiece(currentState.board, currentState.currentPiece, 'down')) {
          lastDropTimeRef.current = timestamp;
          return {
            ...currentState,
            currentPiece: movePiece(currentState.currentPiece, 'down')
          };
        } else if (currentState.currentPiece) {
          // Lock piece
          playDropSound(); // 블록이 고정될 때 소리
          
          const newBoard = placePiece(currentState.board, currentState.currentPiece);
          const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
          
          // 라인이 클리어되었을 때 소리
          if (linesCleared > 0) {
            playLineClearSound();
          }
          
          const newLines = currentState.lines + linesCleared;
          const newLevel = calculateLevel(newLines);
          const newScore = currentState.score + calculateScore(linesCleared, currentState.level);
          
          const newCurrentPiece = currentState.nextPiece ? createNewPiece(currentState.nextPiece) : null;
          const newNextPiece = getRandomTetromino();
          
          const isGameOver = newCurrentPiece ? !isValidPosition(clearedBoard, newCurrentPiece) : true;
          
          // 게임 오버 시 소리
          if (isGameOver) {
            playGameOverSound();
          }
          
          lastDropTimeRef.current = timestamp;
          
          return {
            ...currentState,
            board: clearedBoard,
            currentPiece: isGameOver ? null : newCurrentPiece,
            nextPiece: isGameOver ? null : newNextPiece,
            score: newScore,
            level: newLevel,
            lines: newLines,
            isGameOver,
          };
        }
      }

      return currentState;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [createNewPiece]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (!gameState.isPaused && !gameState.isGameOver && gameState.currentPiece) {
      lastDropTimeRef.current = 0;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState.isPaused, gameState.isGameOver, gameState.currentPiece]);

  return {
    gameState,
    movePieceLeft,
    movePieceRight,
    movePieceDown,
    rotatePiece,
    hardDrop,
    pauseGame,
    restartGame,
  };
}
import { useGame } from './hooks/useGame';
import { useKeyboard } from './hooks/useKeyboard';
import { Board } from './components/Board';
import { NextPiece } from './components/NextPiece';
import { GameInfo } from './components/GameInfo';
import { GameControls } from './components/GameControls';
import { getDropSpeed } from './gameLogic';

function App() {
  const {
    gameState,
    movePieceLeft,
    movePieceRight,
    movePieceDown,
    rotatePiece,
    hardDrop,
    pauseGame,
    restartGame,
  } = useGame();

  useKeyboard({
    onMoveLeft: movePieceLeft,
    onMoveRight: movePieceRight,
    onMoveDown: movePieceDown,
    onRotate: rotatePiece,
    onHardDrop: hardDrop,
    onPause: pauseGame,
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white font-sans p-5">
      <h1 className="mb-8 text-5xl font-bold text-white drop-shadow-lg">테트리스</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl w-full items-start">
        <div className="flex flex-col gap-6 lg:order-1">
          <NextPiece nextPiece={gameState.nextPiece} />
          <GameInfo 
            score={gameState.score}
            level={gameState.level}
            lines={gameState.lines}
            dropSpeed={getDropSpeed(gameState.level)}
          />
        </div>
        
        <div className="relative flex justify-center lg:order-2">
          <Board 
            board={gameState.board} 
            currentPiece={gameState.currentPiece} 
          />
          {gameState.isGameOver && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-10 rounded-2xl text-center backdrop-blur-sm border-2 border-white/20 z-10">
              <h2 className="mb-5 text-4xl text-red-400 drop-shadow-md">게임 오버!</h2>
              <p className="text-2xl text-white">최종 점수: {gameState.score.toLocaleString()}</p>
            </div>
          )}
          {gameState.isPaused && !gameState.isGameOver && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-10 rounded-2xl text-center backdrop-blur-sm border-2 border-white/20 z-10">
              <h2 className="text-4xl text-blue-400 drop-shadow-md">일시 정지</h2>
            </div>
          )}
        </div>
        
        <div className="lg:order-3">
          <GameControls
            isPaused={gameState.isPaused}
            isGameOver={gameState.isGameOver}
            onPause={pauseGame}
            onRestart={restartGame}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

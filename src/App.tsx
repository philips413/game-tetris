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
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden text-white font-sans p-5">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-400 opacity-20 rounded-full animate-bounce animation-delay-1000"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400 opacity-25 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-40 left-32 w-24 h-24 bg-yellow-400 opacity-15 rotate-45 animate-spin animation-delay-3000" style={{animationDuration: '8s'}}></div>
        <div className="absolute top-48 left-1/3 w-12 h-12 bg-green-400 opacity-30 rounded-full animate-ping animation-delay-4000"></div>
        <div className="absolute bottom-20 right-40 w-18 h-18 bg-red-400 opacity-20 rotate-12 animate-bounce animation-delay-5000"></div>
        
        {/* Floating tetrominoes */}
        <div className="absolute top-20 right-10 opacity-10 animate-float animation-delay-1000">
          <svg width="40" height="40" viewBox="0 0 40 40" className="fill-blue-300">
            <rect x="0" y="0" width="10" height="10"/>
            <rect x="10" y="0" width="10" height="10"/>
            <rect x="20" y="0" width="10" height="10"/>
            <rect x="30" y="0" width="10" height="10"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-16 opacity-10 animate-float animation-delay-3000" style={{animationDuration: '6s'}}>
          <svg width="30" height="30" viewBox="0 0 30 30" className="fill-purple-300">
            <rect x="0" y="0" width="10" height="10"/>
            <rect x="10" y="0" width="10" height="10"/>
            <rect x="0" y="10" width="10" height="10"/>
            <rect x="10" y="10" width="10" height="10"/>
          </svg>
        </div>
        
        {/* Moving gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <h1 className="mb-8 text-5xl font-bold text-white drop-shadow-lg animate-pulse">테트리스</h1>
      </div>
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl w-full items-start">
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
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-10 rounded-2xl text-center backdrop-blur-sm border-2 border-white/20 z-20">
              <h2 className="mb-5 text-4xl text-red-400 drop-shadow-md animate-bounce">게임 오버!</h2>
              <p className="text-2xl text-white">최종 점수: {gameState.score.toLocaleString()}</p>
            </div>
          )}
          {gameState.isPaused && !gameState.isGameOver && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-10 rounded-2xl text-center backdrop-blur-sm border-2 border-white/20 z-20">
              <h2 className="text-4xl text-blue-400 drop-shadow-md animate-pulse">일시 정지</h2>
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

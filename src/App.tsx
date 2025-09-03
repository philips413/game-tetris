import { useGame } from './hooks/useGame';
import { useKeyboard } from './hooks/useKeyboard';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { Board } from './components/Board';
import { NextPiece } from './components/NextPiece';
import { GameInfo } from './components/GameInfo';
import { GameControls } from './components/GameControls';
import { TouchControls } from './components/TouchControls';
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

  const { isMobile, isTablet, isDesktop } = useDeviceDetection();

  useKeyboard({
    onMoveLeft: movePieceLeft,
    onMoveRight: movePieceRight,
    onMoveDown: movePieceDown,
    onRotate: rotatePiece,
    onHardDrop: hardDrop,
    onPause: pauseGame,
  });

  return (
    <div className={`relative flex flex-col items-center min-h-screen overflow-hidden text-white font-sans ${
      isMobile ? 'p-1 pb-32' : isTablet ? 'p-3' : 'p-4 md:p-5'
    }`}>
      {/* Dynamic Animated Background - reduced for mobile performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {!isMobile && (
          <>
            {/* Animated geometric shapes - hidden on mobile for performance */}
            <div className="absolute top-5 left-5 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-cyan-400 opacity-20 rounded-full animate-bounce animation-delay-1000"></div>
            <div className="absolute top-20 right-5 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-pink-400 opacity-25 rounded-full animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-32 left-8 w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-yellow-400 opacity-15 rotate-45 animate-spin animation-delay-3000" style={{animationDuration: '8s'}}></div>
            <div className="absolute top-40 left-1/4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-400 opacity-30 rounded-full animate-ping animation-delay-4000"></div>
            <div className="absolute bottom-10 right-10 w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-18 bg-red-400 opacity-20 rotate-12 animate-bounce animation-delay-5000"></div>
            
            {/* Floating tetrominoes - hidden on mobile */}
            <div className="absolute top-16 right-5 opacity-10 animate-float animation-delay-1000">
              <svg width="25" height="25" viewBox="0 0 40 40" className="fill-blue-300 sm:w-8 sm:h-8 md:w-10 md:h-10">
                <rect x="0" y="0" width="10" height="10"/>
                <rect x="10" y="0" width="10" height="10"/>
                <rect x="20" y="0" width="10" height="10"/>
                <rect x="30" y="0" width="10" height="10"/>
              </svg>
            </div>
            <div className="absolute bottom-24 left-8 opacity-10 animate-float animation-delay-3000" style={{animationDuration: '6s'}}>
              <svg width="20" height="20" viewBox="0 0 30 30" className="fill-purple-300 sm:w-6 sm:h-6 md:w-8 md:h-8">
                <rect x="0" y="0" width="10" height="10"/>
                <rect x="10" y="0" width="10" height="10"/>
                <rect x="0" y="10" width="10" height="10"/>
                <rect x="10" y="10" width="10" height="10"/>
              </svg>
            </div>
          </>
        )}
        
        {/* Moving gradient overlay - always visible but subtle on mobile */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent ${
          isMobile ? 'opacity-30' : ''
        } animate-shimmer`}></div>
      </div>
      
      {/* Main content */}
      {!isMobile && (
        <div className="relative z-10">
          <h1 className={`mb-2 font-bold text-white drop-shadow-lg text-center ${
            isTablet ? 'text-3xl animate-pulse' : 'text-4xl md:text-5xl animate-pulse mb-6'
          }`}>테트리스</h1>
        </div>
      )}
      
      {/* Mobile Layout - Full Focus on Game */}
      {isMobile && (
        <div className="relative z-10 flex w-full h-full max-w-lg mx-auto pt-1">
          {/* Ultra-minimal Left Sidebar - 1/5 width */}
          <div className="flex flex-col gap-0.5 w-1/5 px-0.5">
            {/* Next piece - micro */}
            <div className="bg-black/20 rounded p-0.5 backdrop-blur-sm border border-white/5">
              <div className="flex flex-col items-center gap-0.5 min-h-8 justify-center">
                {gameState.nextPiece?.shape.map((row, y) => (
                  <div key={y} className="flex gap-0.5">
                    {row.map((cell, x) => (
                      <div
                        key={x}
                        className={`w-1.5 h-1.5 rounded-sm ${cell ? 'border border-white/20' : ''}`}
                        style={{ backgroundColor: cell ? gameState.nextPiece?.color : 'transparent' }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Essential info only - score and level */}
            <div className="bg-black/20 rounded p-0.5 backdrop-blur-sm border border-white/5">
              <div className="text-center">
                <div className="text-yellow-300 font-bold" style={{fontSize: '11px'}}>{gameState.score.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-300 font-bold" style={{fontSize: '10px'}}>Lv.{gameState.level}</div>
              </div>
            </div>
            
            {/* Minimal pause button */}
            <button 
              onClick={pauseGame} 
              disabled={gameState.isGameOver}
              className="w-full py-0.5 bg-purple-600/70 text-white border-none rounded text-xs font-bold transition-all duration-200 active:scale-95 disabled:opacity-50"
              style={{fontSize: '8px'}}
            >
              일시정지
            </button>
          </div>
          
          {/* Game Area - 4/5 width, maximized */}
          <div className="flex flex-col w-4/5">
            <div className="relative flex justify-center items-center h-full">
              <div className="transform scale-95 origin-center">
                <Board 
                  board={gameState.board} 
                  currentPiece={gameState.currentPiece} 
                />
              </div>
              {gameState.isPaused && !gameState.isGameOver && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/95 text-white p-4 rounded-2xl text-center backdrop-blur-sm border-2 border-white/20 z-20">
                  <h2 className="text-xl text-blue-400 drop-shadow-md animate-pulse">일시 정지</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tablet Layout */}
      {isTablet && (
        <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-4xl items-start">
          {/* Tablet: Left side */}
          <div className="flex flex-col gap-4">
            <NextPiece nextPiece={gameState.nextPiece} />
            <GameInfo 
              score={gameState.score}
              level={gameState.level}
              lines={gameState.lines}
              dropSpeed={getDropSpeed(gameState.level)}
            />
          </div>
          
          {/* Tablet: Right side */}
          <div className="flex flex-col gap-4 items-center">
            <div className="relative">
              <Board 
                board={gameState.board} 
                currentPiece={gameState.currentPiece} 
              />
              {gameState.isPaused && !gameState.isGameOver && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-6 rounded-2xl text-center backdrop-blur-sm border-2 border-white/20 z-20">
                  <h2 className="text-3xl text-blue-400 drop-shadow-md animate-pulse">일시 정지</h2>
                </div>
              )}
            </div>
            <GameControls
              isPaused={gameState.isPaused}
              isGameOver={gameState.isGameOver}
              onPause={pauseGame}
              onRestart={restartGame}
            />
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {isDesktop && (
        <div className="relative z-10 grid grid-cols-3 gap-8 w-full max-w-6xl items-start">
          {/* Desktop: Side panels (left) */}
          <div className="flex flex-col gap-6">
            <NextPiece nextPiece={gameState.nextPiece} />
            <GameInfo 
              score={gameState.score}
              level={gameState.level}
              lines={gameState.lines}
              dropSpeed={getDropSpeed(gameState.level)}
            />
          </div>
          
          {/* Desktop: Game board (center) */}
          <div className="relative flex justify-center">
            <Board 
              board={gameState.board} 
              currentPiece={gameState.currentPiece} 
            />
            {gameState.isPaused && !gameState.isGameOver && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 text-white p-10 rounded-2xl text-center backdrop-blur-sm border-2 border-white/20 z-20">
                <h2 className="text-4xl text-blue-400 drop-shadow-md animate-pulse">일시 정지</h2>
              </div>
            )}
          </div>
          
          {/* Desktop: Controls (right) */}
          <div>
            <GameControls
              isPaused={gameState.isPaused}
              isGameOver={gameState.isGameOver}
              onPause={pauseGame}
              onRestart={restartGame}
            />
          </div>
        </div>
      )}

      {/* Game Over Popup - Full Screen */}
      {gameState.isGameOver && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 sm:p-8 md:p-10 rounded-2xl text-center border-2 border-red-400/50 shadow-2xl max-w-md w-full mx-4 animate-pulse">
            <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl text-red-400 drop-shadow-lg animate-bounce font-bold">게임 오버!</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-black/30 rounded-lg p-4 border border-white/20">
                <h3 className="text-lg text-gray-300 mb-2">최종 점수</h3>
                <p className="text-3xl sm:text-4xl font-bold text-yellow-300 drop-shadow-md">{gameState.score.toLocaleString()}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/20">
                  <h3 className="text-sm text-gray-300 mb-1">레벨</h3>
                  <p className="text-xl font-bold text-blue-300">{gameState.level}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/20">
                  <h3 className="text-sm text-gray-300 mb-1">클리어한 줄</h3>
                  <p className="text-xl font-bold text-green-300">{gameState.lines}</p>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 border border-white/20">
                <h3 className="text-sm text-gray-300 mb-1">최종 속도</h3>
                <p className="text-lg font-bold text-purple-300">{getDropSpeed(gameState.level)}ms</p>
              </div>
            </div>
            
            <button 
              onClick={restartGame}
              className="w-full p-4 bg-gradient-to-r from-red-600 to-pink-600 text-white border-none rounded-lg text-lg font-bold cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-xl active:transform-none"
            >
              다시 게임하기
            </button>
          </div>
        </div>
      )}
      
      {/* Touch Controls - Fixed at bottom for Mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-2">
          <TouchControls
            onMoveLeft={movePieceLeft}
            onMoveRight={movePieceRight}
            onMoveDown={movePieceDown}
            onRotate={rotatePiece}
            onHardDrop={hardDrop}
            isGameOver={gameState.isGameOver}
            isPaused={gameState.isPaused}
          />
        </div>
      )}
      
      {/* Touch Controls for Tablet - Regular positioning */}
      {isTablet && (
        <TouchControls
          onMoveLeft={movePieceLeft}
          onMoveRight={movePieceRight}
          onMoveDown={movePieceDown}
          onRotate={rotatePiece}
          onHardDrop={hardDrop}
          isGameOver={gameState.isGameOver}
          isPaused={gameState.isPaused}
        />
      )}
    </div>
  );
}

export default App;

import {useAudioContext} from '../contexts/AudioContext';

interface GameControlsProps {
  isPaused: boolean;
  isGameOver: boolean;
  onPause: () => void;
  onRestart: () => void;
}

export function GameControls({ isPaused, isGameOver, onPause, onRestart }: GameControlsProps) {
  const { isMusicPlaying, toggleBackgroundMusic} = useAudioContext();
  return (
    <div className="bg-black/30 rounded-xl p-5 backdrop-blur-sm border border-white/10">
      <button 
        onClick={onPause} 
        disabled={isGameOver}
        className="w-full p-3 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none rounded-lg text-base font-bold cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isPaused ? '계속하기' : '일시정지'}
      </button>
      <button 
        onClick={onRestart}
        className="w-full p-3 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none rounded-lg text-base font-bold cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none"
      >
        새 게임
      </button>
      
      <div className="flex gap-2 mb-5">
        <button 
          onClick={toggleBackgroundMusic}
          className="flex-1 p-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-none rounded-lg text-sm font-bold cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform-none"
        >
          {isMusicPlaying ? '🎵 정지' : '🎵 재생'}
        </button>
      </div>
      
      <div className="border-t border-white/10 pt-4">
        <h4 className="mb-2 text-lg text-white text-center">조작법</h4>
        <p className="my-1 text-sm text-gray-300 text-center">← → : 이동</p>
        <p className="my-1 text-sm text-gray-300 text-center">↓ : 빠른 낙하</p>
        <p className="my-1 text-sm text-gray-300 text-center">↑ : 회전</p>
        <p className="my-1 text-sm text-gray-300 text-center">스페이스 : 즉시 낙하</p>
        <p className="my-1 text-sm text-gray-300 text-center">P : 일시정지</p>
      </div>
    </div>
  );
}
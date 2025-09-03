import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { audioGenerator } from '../utils/audioGenerator';

interface AudioContextType {
  isMusicPlaying: boolean;
  isMuted: boolean;
  volume: number;
  startBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  toggleBackgroundMusic: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playDropSound: () => void;
  playLineClearSound: () => void;
  playGameOverSound: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const musicIntervalRef = useRef<number | null>(null);
  const isMusicPlayingRef = useRef(false);
  const isMutedRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    isMusicPlayingRef.current = isMusicPlaying;
  }, [isMusicPlaying]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const startBackgroundMusic = useCallback(async () => {
    if (isMusicPlayingRef.current) return;
    
    await audioGenerator.resumeAudioContext();
    setIsMusicPlaying(true);
    isMusicPlayingRef.current = true;
    
    // 첫 번째 재생
    if (!isMutedRef.current) {
      await audioGenerator.playTetrisTheme();
    }
    
    // 음악의 정확한 길이 후에 다시 재생하도록 설정 (부드러운 루프를 위해 50ms 여유시간만 추가)
    const themeDuration = audioGenerator.getTetrisThemeDuration();
    musicIntervalRef.current = window.setInterval(async () => {
      // ref를 사용하여 최신 상태 확인 (클로저 문제 방지)
      if (isMusicPlayingRef.current && !isMutedRef.current) {
        try {
          await audioGenerator.playTetrisTheme();
        } catch (error) {
          console.error('Background music playback error:', error);
        }
      }
    }, themeDuration + 50);
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    setIsMusicPlaying(false);
    isMusicPlayingRef.current = false;
    audioGenerator.stopTetrisTheme();
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
    }
  }, []);

  const toggleBackgroundMusic = useCallback(() => {
    if (isMusicPlaying) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
  }, [isMusicPlaying, startBackgroundMusic, stopBackgroundMusic]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      isMutedRef.current = newMuted;
      return newMuted;
    });
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const playDropSound = useCallback(() => {
    if (!isMuted) {
      audioGenerator.playDropSound();
    }
  }, [isMuted]);

  const playLineClearSound = useCallback(() => {
    if (!isMuted) {
      audioGenerator.playLineClearSound();
    }
  }, [isMuted]);

  const playGameOverSound = useCallback(() => {
    if (!isMuted) {
      audioGenerator.playGameOverSound();
    }
  }, [isMuted]);

  const contextValue: AudioContextType = {
    isMusicPlaying,
    isMuted,
    volume,
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,
    toggleMute,
    setVolume,
    playDropSound,
    playLineClearSound,
    playGameOverSound,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      <div 
        data-audio-muted={isMuted.toString()}
        style={{ display: 'contents' }}
      >
        {children}
      </div>
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}
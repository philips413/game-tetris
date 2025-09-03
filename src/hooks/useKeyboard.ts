import { useEffect } from 'react';

interface KeyboardHandlers {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
}

export function useKeyboard({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onPause,
}: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onMoveLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onMoveRight();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onMoveDown();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onRotate();
          break;
        case ' ':
          event.preventDefault();
          onHardDrop();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          onPause();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop, onPause]);
}
'use client';

import { useEffect } from 'react';
import { useTracks } from '@/context/TracksContext';

export default function KeyboardHandler() {
  const { dispatch } = useTracks();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          dispatch({ type: 'MOVE_FOCUS', payload: { direction: 'up' } });
          break;
        
        case 'ArrowDown':
          event.preventDefault();
          dispatch({ type: 'MOVE_FOCUS', payload: { direction: 'down' } });
          break;
        
        case 'Enter':
          event.preventDefault();
          const multi = event.metaKey || event.ctrlKey;
          const range = event.shiftKey;
          dispatch({ 
            type: 'SELECT_FOCUSED_TRACK',
            payload: { multi, range }
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return null; // This component doesn't render anything
}
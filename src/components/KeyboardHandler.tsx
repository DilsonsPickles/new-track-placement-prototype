'use client';

import { useEffect } from 'react';
import { useTracks } from '@/context/TracksContext';

export default function KeyboardHandler() {
  const { state, dispatch } = useTracks();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          dispatch({ 
            type: 'MOVE_FOCUS', 
            payload: { 
              direction: 'up',
              expandSelection: event.shiftKey 
            } 
          });
          break;
        
        case 'ArrowDown':
          event.preventDefault();
          dispatch({ 
            type: 'MOVE_FOCUS', 
            payload: { 
              direction: 'down',
              expandSelection: event.shiftKey 
            } 
          });
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
        
        case 'Delete':
        case 'Backspace':
          if (state.selectedTracks.length > 0) {
            event.preventDefault();
            dispatch({
              type: 'DELETE_TRACKS',
              payload: { trackIds: state.selectedTracks }
            });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, state.selectedTracks]);

  return null; // This component doesn't render anything
}
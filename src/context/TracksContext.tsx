'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { TracksState, TracksAction, Track, PlacementContext } from '@/types/tracks';
import { calculateNewTrackPosition } from '@/utils/placement';
import { ensureFocusState } from '@/utils/focus';

const initialState: TracksState = {
  tracks: [
    {
      id: 'track-1',
      name: 'Audio Track 1',
      type: 'audio',
      selected: false,
      clips: [{ id: 'clip-1', name: 'Recording 1', start: 0, duration: 30 }]
    },
    {
      id: 'track-2',
      name: 'Audio Track 2',
      type: 'audio',
      selected: false,
      clips: [{ id: 'clip-2', name: 'Recording 2', start: 10, duration: 25 }]
    }
  ],
  selectedTracks: [],
  focusedTrack: 'track-1', // Always start with focus on first track
  placementStrategy: 'focus-based'
};

function tracksReducer(state: TracksState, action: TracksAction): TracksState {
  const result = (() => {
    switch (action.type) {
    case 'ADD_TRACK': {
      const newTrack: Track = {
        ...action.payload.track,
        id: `track-${Date.now()}`,
        selected: true,
        clips: []
      };

      let position = action.payload.position;
      if (position === undefined) {
        const context: PlacementContext = {
          selectedTracks: state.selectedTracks,
          focusedTrack: state.focusedTrack,
          commandType: newTrack.type === 'label' ? 'label' : 'new'
        };
        position = calculateNewTrackPosition(state.tracks, state.placementStrategy, context);
      }

      const newTracks = [...state.tracks];
      newTracks.splice(position, 0, newTrack);

      return {
        ...state,
        tracks: newTracks.map(track => ({
          ...track,
          selected: track.id === newTrack.id
        })),
        selectedTracks: [newTrack.id],
        focusedTrack: newTrack.id
      };
    }

    case 'SELECT_TRACK': {
      const { trackId, multi = false, range = false, syncFocus = true } = action.payload;
      
      if (range) {
        // Range selection - select from anchor to target
        const targetIndex = state.tracks.findIndex(t => t.id === trackId);
        const anchorIndex = state.selectedTracks.length > 0 ? 
          state.tracks.findIndex(t => t.id === state.selectedTracks[0]) : 
          targetIndex;
        
        const startIndex = Math.min(anchorIndex, targetIndex);
        const endIndex = Math.max(anchorIndex, targetIndex);
        
        const rangeTrackIds = state.tracks
          .slice(startIndex, endIndex + 1)
          .map(t => t.id);
        
        return {
          ...state,
          selectedTracks: rangeTrackIds,
          focusedTrack: syncFocus ? trackId : state.focusedTrack,
          tracks: state.tracks.map(track => ({
            ...track,
            selected: rangeTrackIds.includes(track.id)
          }))
        };
      } else if (!multi) {
        // Single selection - clear others and select this one
        return {
          ...state,
          selectedTracks: [trackId],
          focusedTrack: syncFocus ? trackId : state.focusedTrack,
          tracks: state.tracks.map(track => ({
            ...track,
            selected: track.id === trackId
          }))
        };
      } else {
        // Multi-selection - toggle this track
        const isSelected = state.selectedTracks.includes(trackId);
        const newSelectedTracks = isSelected
          ? state.selectedTracks.filter(id => id !== trackId)
          : [...state.selectedTracks, trackId];
        
        // For multi-selection, focus follows the latest selected track
        // But if we're deselecting and would lose focus, keep current focus
        const newFocusedTrack = syncFocus ? 
          (isSelected ? 
            (newSelectedTracks.length > 0 ? newSelectedTracks[newSelectedTracks.length - 1] : state.focusedTrack) : 
            trackId
          ) : 
          state.focusedTrack;
        
        return {
          ...state,
          selectedTracks: newSelectedTracks,
          focusedTrack: newFocusedTrack,
          tracks: state.tracks.map(track => ({
            ...track,
            selected: newSelectedTracks.includes(track.id)
          }))
        };
      }
    }

    case 'SET_FOCUS': {
      return {
        ...state,
        focusedTrack: action.payload.trackId
      };
    }

    case 'MOVE_FOCUS': {
      const { direction } = action.payload;
      const currentIndex = state.focusedTrack ? 
        state.tracks.findIndex(t => t.id === state.focusedTrack) : -1;
      
      let newIndex: number;
      if (direction === 'up') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : state.tracks.length - 1;
      } else {
        newIndex = currentIndex < state.tracks.length - 1 ? currentIndex + 1 : 0;
      }
      
      const newFocusedTrack = state.tracks.length > 0 ? state.tracks[newIndex].id : null;
      
      return {
        ...state,
        focusedTrack: newFocusedTrack
      };
    }

    case 'SELECT_FOCUSED_TRACK': {
      if (!state.focusedTrack) return state;
      
      const { multi = false, range = false } = action.payload || {};
      
      if (range) {
        // Range selection from anchor to focused track
        const targetIndex = state.tracks.findIndex(t => t.id === state.focusedTrack);
        const anchorIndex = state.selectedTracks.length > 0 ? 
          state.tracks.findIndex(t => t.id === state.selectedTracks[0]) : 
          targetIndex;
        
        const startIndex = Math.min(anchorIndex, targetIndex);
        const endIndex = Math.max(anchorIndex, targetIndex);
        
        const rangeTrackIds = state.tracks
          .slice(startIndex, endIndex + 1)
          .map(t => t.id);
        
        return {
          ...state,
          selectedTracks: rangeTrackIds,
          tracks: state.tracks.map(track => ({
            ...track,
            selected: rangeTrackIds.includes(track.id)
          }))
        };
      } else if (!multi) {
        // Single selection - clear others and select focused track
        return {
          ...state,
          selectedTracks: [state.focusedTrack],
          tracks: state.tracks.map(track => ({
            ...track,
            selected: track.id === state.focusedTrack
          }))
        };
      } else {
        // Multi-selection - toggle focused track in selection
        const isSelected = state.selectedTracks.includes(state.focusedTrack);
        const newSelectedTracks = isSelected
          ? state.selectedTracks.filter(id => id !== state.focusedTrack)
          : [...state.selectedTracks, state.focusedTrack];
        
        return {
          ...state,
          selectedTracks: newSelectedTracks,
          tracks: state.tracks.map(track => ({
            ...track,
            selected: newSelectedTracks.includes(track.id)
          }))
        };
      }
    }

    case 'DUPLICATE_TRACKS': {
      const { trackIds } = action.payload;
      const tracksToDuplicate = state.tracks.filter(track => trackIds.includes(track.id));
      
      const context: PlacementContext = {
        selectedTracks: state.selectedTracks,
        focusedTrack: state.focusedTrack,
        commandType: 'duplicate'
      };
      
      // For duplicates, always use selection-based placement regardless of user's chosen strategy
      const insertPosition = calculateNewTrackPosition(state.tracks, 'selection-based', context);
      const newTracks = [...state.tracks];
      
      // Check if the focused track is being duplicated - find its index
      const focusedTrackIndex = state.focusedTrack ? 
        tracksToDuplicate.findIndex(track => track.id === state.focusedTrack) : -1;
      
      const duplicatedTracks = tracksToDuplicate.map((track, index) => ({
        ...track,
        id: `track-${Date.now()}-${index}`,
        name: `${track.name} Copy`,
        selected: false,
        clips: track.clips.map(clip => ({
          ...clip,
          id: `clip-${Date.now()}-${index}`
        }))
      }));

      newTracks.splice(insertPosition, 0, ...duplicatedTracks);

      const duplicatedIds = duplicatedTracks.map(t => t.id);
      
      // If the focused track was duplicated, move focus to the corresponding duplicated track
      const newFocusedTrack = focusedTrackIndex >= 0 ? 
        duplicatedTracks[focusedTrackIndex].id : 
        state.focusedTrack;
      
      return {
        ...state,
        tracks: newTracks.map(track => ({
          ...track,
          selected: duplicatedIds.includes(track.id)
        })),
        selectedTracks: duplicatedIds,
        focusedTrack: newFocusedTrack
      };
    }

    case 'MIX_AND_RENDER': {
      const { newTrackName } = action.payload;
      
      const context: PlacementContext = {
        selectedTracks: state.selectedTracks,
        focusedTrack: state.focusedTrack,
        commandType: 'mix-render'
      };
      
      const insertPosition = calculateNewTrackPosition(state.tracks, state.placementStrategy, context);
      
      const mixedTrack: Track = {
        id: `track-${Date.now()}`,
        name: newTrackName,
        type: 'audio',
        selected: true,
        clips: [{ id: `clip-${Date.now()}`, name: 'Mixed Audio', start: 0, duration: 60 }]
      };

      const newTracks = [...state.tracks];
      newTracks.splice(insertPosition, 0, mixedTrack);

      return {
        ...state,
        tracks: newTracks.map(track => ({
          ...track,
          selected: track.id === mixedTrack.id
        })),
        selectedTracks: [mixedTrack.id],
        focusedTrack: mixedTrack.id
      };
    }

    case 'SET_PLACEMENT_STRATEGY': {
      return {
        ...state,
        placementStrategy: action.payload.strategy
      };
    }

    case 'CLEAR_SELECTION': {
      return {
        ...state,
        selectedTracks: [],
        tracks: state.tracks.map(track => ({
          ...track,
          selected: false
        }))
        // Note: Focus state remains unchanged - it should always be visible when tracks exist
      };
    }

    case 'RESET_TRACKS': {
      return initialState;
    }

    default:
      return state;
    }
  })();

  // Ensure focus is always maintained when tracks exist
  return {
    ...result,
    focusedTrack: ensureFocusState(result.tracks, result.focusedTrack)
  };
}

const TracksContext = createContext<{
  state: TracksState;
  dispatch: React.Dispatch<TracksAction>;
} | null>(null);

export function TracksProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tracksReducer, initialState);

  return (
    <TracksContext.Provider value={{ state, dispatch }}>
      {children}
    </TracksContext.Provider>
  );
}

export function useTracks() {
  const context = useContext(TracksContext);
  if (!context) {
    throw new Error('useTracks must be used within a TracksProvider');
  }
  return context;
}
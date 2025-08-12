import { Track, PlacementStrategy, PlacementContext } from '@/types/tracks';

export function calculateNewTrackPosition(
  tracks: Track[],
  strategy: PlacementStrategy,
  context: PlacementContext
): number {
  // If no tracks exist, place at position 0
  if (tracks.length === 0) return 0;

  switch (strategy) {
    case 'focus-based':
      return getFocusBasedPosition(tracks, context);
    
    case 'selection-based':
      return getSelectionBasedPosition(tracks, context);
    
    case 'context-aware':
      return getContextAwarePosition(tracks, context);
    
    default:
      return tracks.length; // Default to end
  }
}

function getFocusBasedPosition(tracks: Track[], context: PlacementContext): number {
  // Always place after the focused track, or at end if no focus
  if (context.focusedTrack) {
    const focusedIndex = tracks.findIndex(t => t.id === context.focusedTrack);
    return focusedIndex >= 0 ? focusedIndex + 1 : tracks.length;
  }
  return tracks.length; // At end if no focus
}

function getSelectionBasedPosition(tracks: Track[], context: PlacementContext): number {
  // Place after the highest selected track, or at end if no selection
  if (context.selectedTracks.length > 0) {
    const selectedIndices = context.selectedTracks
      .map(id => tracks.findIndex(t => t.id === id))
      .filter(index => index >= 0)
      .sort((a, b) => a - b); // Sort ascending to get highest index
    
    if (selectedIndices.length > 0) {
      return selectedIndices[selectedIndices.length - 1] + 1; // After the highest selected track
    }
  }
  return tracks.length; // At end if no selection
}

function getContextAwarePosition(tracks: Track[], context: PlacementContext): number {
  // Different rules based on command type
  switch (context.commandType) {
    case 'new':
      // For new tracks, use focus if available, otherwise selection
      if (context.focusedTrack) {
        return getFocusBasedPosition(tracks, context);
      } else if (context.selectedTracks.length > 0) {
        return getSelectionBasedPosition(tracks, context);
      }
      return tracks.length;
    
    case 'duplicate':
      // For duplicates, always place after the selection group
      return getSelectionBasedPosition(tracks, context);
    
    case 'mix-render':
      // For mix and render, place after the highest selected track
      if (context.selectedTracks.length > 0) {
        const selectedIndices = context.selectedTracks
          .map(id => tracks.findIndex(t => t.id === id))
          .filter(index => index >= 0)
          .sort((a, b) => a - b); // Sort ascending to get highest index
        
        if (selectedIndices.length > 0) {
          return selectedIndices[selectedIndices.length - 1] + 1;
        }
      }
      return tracks.length;
    
    case 'label':
      // Label tracks: if selection exists, use it; otherwise go to bottom
      if (context.selectedTracks.length > 0) {
        return getSelectionBasedPosition(tracks, context);
      }
      return tracks.length; // Bottom if no selection
    
    default:
      return tracks.length;
  }
}
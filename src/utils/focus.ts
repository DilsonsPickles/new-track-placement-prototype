import { Track } from '@/types/tracks';

/**
 * Ensures focus is always maintained when tracks exist
 * If the focused track was removed, focus moves to the next best track
 * If no focus exists but tracks do, focus goes to the first track
 */
export function ensureFocusState(
  tracks: Track[],
  currentFocusedTrack: string | null
): string | null {
  // No tracks = no focus
  if (tracks.length === 0) {
    return null;
  }

  // If current focus is valid, keep it
  if (currentFocusedTrack && tracks.some(t => t.id === currentFocusedTrack)) {
    return currentFocusedTrack;
  }

  // If no focus or invalid focus, focus on first track
  return tracks[0].id;
}
export type TrackType = 'audio' | 'label' | 'stereo';

export type PlacementStrategy = 'focus-based' | 'selection-based' | 'context-aware';

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  selected: boolean;
  clips: Clip[];
}

export interface Clip {
  id: string;
  name: string;
  start: number;
  duration: number;
}

export interface TracksState {
  tracks: Track[];
  selectedTracks: string[];
  focusedTrack: string | null;
  selectionAnchor: string | null; // Starting point for shift-selection
  placementStrategy: PlacementStrategy;
}

export type TracksAction =
  | { type: 'ADD_TRACK'; payload: { track: Omit<Track, 'id' | 'selected' | 'clips'>; position?: number } }
  | { type: 'SELECT_TRACK'; payload: { trackId: string; multi?: boolean; range?: boolean; syncFocus?: boolean } }
  | { type: 'SET_FOCUS'; payload: { trackId: string | null } }
  | { type: 'MOVE_FOCUS'; payload: { direction: 'up' | 'down'; expandSelection?: boolean } }
  | { type: 'SELECT_FOCUSED_TRACK'; payload?: { multi?: boolean; range?: boolean } }
  | { type: 'DUPLICATE_TRACKS'; payload: { trackIds: string[] } }
  | { type: 'MIX_AND_RENDER'; payload: { trackIds: string[]; newTrackName: string } }
  | { type: 'SET_PLACEMENT_STRATEGY'; payload: { strategy: PlacementStrategy } }
  | { type: 'DELETE_TRACKS'; payload: { trackIds: string[] } }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'RESET_TRACKS' };

export interface PlacementContext {
  selectedTracks: string[];
  focusedTrack: string | null;
  commandType: 'new' | 'duplicate' | 'mix-render' | 'label';
}
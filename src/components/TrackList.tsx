'use client';

import { useTracks } from '@/context/TracksContext';
import Track from './Track';

export default function TrackList() {
  const { state } = useTracks();

  if (state.tracks.length === 0) {
    return (
      <div className="track-list empty">
        <p>No tracks yet. Use the toolbar above to add tracks.</p>
      </div>
    );
  }

  return (
    <div className="track-list">
      <div className="track-list-header">
        <div className="header-section">Track Controls</div>
        <div className="header-section">Timeline / Audio Canvas</div>
      </div>
      
      {state.tracks.map((track, index) => (
        <Track 
          key={track.id} 
          track={track} 
          index={index}
        />
      ))}

      <div className="track-list-info">
        <p>
          <strong>Instructions:</strong> Click to select/focus • Ctrl/Cmd+Click for multi-select • Shift+Click for range select • Arrow keys move focus • Enter selects • Ctrl/Cmd+Enter multi-selects • Shift+Enter range selects
        </p>
        <p>
          Watch how new tracks are placed based on your current strategy: <strong>{state.placementStrategy}</strong>
        </p>
      </div>
    </div>
  );
}
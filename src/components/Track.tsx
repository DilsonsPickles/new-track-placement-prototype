'use client';

import { Track as TrackType } from '@/types/tracks';
import { useTracks } from '@/context/TracksContext';

interface TrackProps {
  track: TrackType;
  index: number;
}

export default function Track({ track, index }: TrackProps) {
  const { state, dispatch } = useTracks();
  
  const isSelected = state.selectedTracks.includes(track.id);
  const isFocused = state.focusedTrack === track.id;

  const handleClick = (e: React.MouseEvent) => {
    const multi = e.metaKey || e.ctrlKey;
    const range = e.shiftKey;
    dispatch({
      type: 'SELECT_TRACK',
      payload: { trackId: track.id, multi, range, syncFocus: true }
    });
  };

  return (
    <div className={`track-container ${isFocused ? 'track-focused' : ''}`}>
      {/* Track Header */}
      <div 
        className={`track-header ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
      >
        <div className="track-controls">
          <div className="track-number">{index + 1}</div>
          <div className="track-type">{track.type}</div>
        </div>
        <div className="track-name">{track.name}</div>
        <div className="track-status">
          {isSelected && <span className="status-badge selected-badge">S</span>}
          {isFocused && <span className="status-badge focused-badge">F</span>}
        </div>
      </div>

      {/* Track Canvas - Audio clips visualization */}
      <div className="track-canvas" onClick={handleClick}>
        {track.clips.map(clip => (
          <div
            key={clip.id}
            className="audio-clip"
            style={{
              left: `${clip.start * 10}px`, // 10px per second
              width: `${clip.duration * 10}px`
            }}
          >
            <span className="clip-name">{clip.name}</span>
          </div>
        ))}
        {track.type === 'label' && (
          <div className="label-indicators">
            <div className="label-marker" style={{ left: '50px' }}>Label 1</div>
            <div className="label-marker" style={{ left: '200px' }}>Label 2</div>
          </div>
        )}
      </div>
    </div>
  );
}
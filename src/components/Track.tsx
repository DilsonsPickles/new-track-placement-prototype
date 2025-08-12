'use client';

import { Track as TrackType } from '@/types/tracks';
import { useTracks } from '@/context/TracksContext';

interface TrackProps {
  track: TrackType;
  index: number;
}

export default function Track({ track }: TrackProps) {
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
        <div className="track-header-top">
          <div className="track-icon">
            {track.type === 'audio' ? '🎤' : track.type === 'label' ? '🏷️' : '🎵'}
          </div>
          <div className="track-name">{track.name}</div>
          <div className="track-status">
            {isSelected && <span className="status-badge selected-badge">S</span>}
            {isFocused && <span className="status-badge focused-badge">F</span>}
          </div>
        </div>
        
        <div className="track-controls-row">
          <div className="volume-control">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value="75" 
              className="volume-slider"
              onClick={(e) => e.stopPropagation()}
              onChange={() => {}} // Prevent React warning
            />
          </div>
          <button className="track-btn mute-btn" onClick={(e) => e.stopPropagation()}>M</button>
          <button className="track-btn solo-btn" onClick={(e) => e.stopPropagation()}>S</button>
        </div>
        
        <div className="track-effects">
          Effects
        </div>
      </div>

      {/* Track Canvas - Audio clips visualization */}
      <div className="track-canvas" onClick={handleClick}>
        {track.type === 'audio' || track.type === 'stereo' ? (
          track.clips.map(clip => (
            <div
              key={clip.id}
              className="audio-clip"
              style={{
                left: `${clip.start * 10}px`, // 10px per second
                width: `${clip.duration * 10}px`
              }}
            >
              <div className="track-label">{track.name}</div>
              <div className="audio-channel">
                <div className="waveform"></div>
              </div>
              <div className="audio-channel">
                <div className="waveform"></div>
              </div>
            </div>
          ))
        ) : (
          <div className="label-indicators">
            <div className="label-marker" style={{ left: '50px' }}>Label 1</div>
            <div className="label-marker" style={{ left: '200px' }}>Label 2</div>
          </div>
        )}
      </div>
    </div>
  );
}
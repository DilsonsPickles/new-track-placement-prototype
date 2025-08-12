'use client';

import { useTracks } from '@/context/TracksContext';

export default function Toolbar() {
  const { state, dispatch } = useTracks();

  const handleAddTrack = () => {
    dispatch({
      type: 'ADD_TRACK',
      payload: {
        track: {
          name: `Audio Track ${state.tracks.length + 1}`,
          type: 'audio'
        }
      }
    });
  };

  const handleDuplicateSelected = () => {
    if (state.selectedTracks.length > 0) {
      dispatch({
        type: 'DUPLICATE_TRACKS',
        payload: { trackIds: state.selectedTracks }
      });
    }
  };

  const handleMixAndRender = () => {
    if (state.selectedTracks.length > 0) {
      const trackNames = state.tracks
        .filter(t => state.selectedTracks.includes(t.id))
        .map(t => t.name)
        .join(' + ');
      
      dispatch({
        type: 'MIX_AND_RENDER',
        payload: {
          trackIds: state.selectedTracks,
          newTrackName: `Mixed: ${trackNames}`
        }
      });
    }
  };

  const handleAddLabel = () => {
    dispatch({
      type: 'ADD_TRACK',
      payload: {
        track: {
          name: 'Label Track',
          type: 'label'
        }
      }
    });
  };


  const handleReset = () => {
    dispatch({ type: 'RESET_TRACKS' });
  };

  const selectedCount = state.selectedTracks.length;
  const hasSelection = selectedCount > 0;
  const hasFocus = state.focusedTrack !== null;

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h3>Track Actions</h3>
        <button onClick={handleAddTrack} className="btn-primary">
          New Track
        </button>
        <button 
          onClick={handleDuplicateSelected}
          disabled={!hasSelection}
          className="btn-secondary"
        >
          Duplicate Selected ({selectedCount})
        </button>
        <button 
          onClick={handleMixAndRender}
          disabled={!hasSelection}
          className="btn-secondary"
        >
          Mix & Render Selected ({selectedCount})
        </button>
        <button onClick={handleAddLabel} className="btn-secondary">
          Add Label Track
        </button>
      </div>

      <div className="toolbar-section">
        <h3>Project</h3>
        <button onClick={handleReset} className="btn-tertiary">
          Reset All
        </button>
      </div>

      <div className="toolbar-section">
        <h3>Strategy Switcher</h3>
        <select 
          value={state.placementStrategy}
          onChange={(e) => dispatch({
            type: 'SET_PLACEMENT_STRATEGY',
            payload: { strategy: e.target.value as typeof state.placementStrategy }
          })}
          className="strategy-select"
        >
          <option value="focus-based">Focus-based</option>
          <option value="selection-based">Selection-based</option>
          <option value="context-aware">Context-aware</option>
        </select>
      </div>

      <div className="toolbar-section">
        <h3>Current State</h3>
        <div className="state-info">
          <p>Selected: {selectedCount} tracks</p>
          <p>Focused: {hasFocus ? 'Yes' : 'None'}</p>
          <p>Strategy: {state.placementStrategy}</p>
        </div>
      </div>
    </div>
  );
}
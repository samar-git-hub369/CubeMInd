import React from 'react';
import { Play, Shuffle, Edit3 } from 'lucide-react';

export function Controls({ onSolve, onShuffle, onEdit, solving }) {
  return (
    <div className="controls-panel glass-panel">
      <h2>CubeMind</h2>
      <p className="subtitle">High-Performance 3D Solver</p>
      
      <div className="action-buttons">
        <button className="primary-button" onClick={onSolve} disabled={solving}>
          <Play size={18} />
          <span>Solve Cube</span>
        </button>
        
        <button className="secondary-button" onClick={onShuffle} disabled={solving}>
          <Shuffle size={18} />
          <span>Shuffle</span>
        </button>
        
        <button className="secondary-button" onClick={onEdit} disabled={solving}>
          <Edit3 size={18} />
          <span>Manual Edit</span>
        </button>
      </div>

      <div className="status-indicator">
        <div className={`status-dot ${solving ? 'active' : ''}`}></div>
        <span>{solving ? 'Calculating <100ms...' : 'Ready'}</span>
      </div>
    </div>
  );
}

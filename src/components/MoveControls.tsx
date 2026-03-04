import type { Move } from '../cube/cubeLogic';

interface MoveControlsProps {
  onMove: (move: Move) => void;
  disabled?: boolean;
}

const MOVE_GROUPS: { label: string; moves: Move[] }[] = [
  { label: 'U', moves: ['U', "U'", 'U2'] },
  { label: 'D', moves: ['D', "D'", 'D2'] },
  { label: 'F', moves: ['F', "F'", 'F2'] },
  { label: 'B', moves: ['B', "B'", 'B2'] },
  { label: 'L', moves: ['L', "L'", 'L2'] },
  { label: 'R', moves: ['R', "R'", 'R2'] },
];

export default function MoveControls({ onMove, disabled }: MoveControlsProps) {
  return (
    <div className="move-controls">
      {MOVE_GROUPS.map(group => (
        <div key={group.label} className="move-group">
          <span className="move-group-label">{group.label}</span>
          {group.moves.map(move => (
            <button
              key={move}
              className="move-btn"
              onClick={() => onMove(move)}
              disabled={disabled}
            >
              {move}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

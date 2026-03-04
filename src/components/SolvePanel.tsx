import type { Move } from '../cube/cubeLogic';

interface SolvePanelProps {
  scramble: Move[];
  solution: Move[];
  solvingStep: number;
  isSolving: boolean;
  onStartSolve: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onStopSolve: () => void;
}

export default function SolvePanel({
  scramble,
  solution,
  solvingStep,
  isSolving,
  onStartSolve,
  onStepForward,
  onStepBack,
  onStopSolve,
}: SolvePanelProps) {
  return (
    <div className="solve-panel">
      {scramble.length > 0 && (
        <div className="scramble-display">
          <span className="panel-label">Scramble:</span>
          <div className="move-sequence">
            {scramble.map((m, i) => (
              <span key={i} className="move-chip scramble-chip">{m}</span>
            ))}
          </div>
        </div>
      )}

      {solution.length > 0 && (
        <div className="solution-display">
          <span className="panel-label">Solution ({solution.length} moves):</span>
          <div className="move-sequence">
            {solution.map((m, i) => (
              <span
                key={i}
                className={`move-chip ${i < solvingStep ? 'done' : i === solvingStep && isSolving ? 'current' : ''}`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="solve-controls">
        {!isSolving ? (
          <button className="btn btn-primary" onClick={onStartSolve}>
            Show Solution
          </button>
        ) : (
          <>
            <button className="btn" onClick={onStepBack} disabled={solvingStep === 0}>
              ← Back
            </button>
            <span className="step-counter">{solvingStep} / {solution.length}</span>
            <button className="btn" onClick={onStepForward} disabled={solvingStep >= solution.length}>
              Next →
            </button>
            <button className="btn btn-danger" onClick={onStopSolve}>
              Exit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

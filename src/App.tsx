import { useState, useCallback } from 'react';
import type { CubeState, Move } from './cube/cubeLogic';
import {
  createSolvedCube,
  applyMove,
  generateScramble,
  applyMoves,
  isSolved,
} from './cube/cubeLogic';
import { solve } from './cube/solver';
import CubeNet from './components/CubeNet';
import MoveControls from './components/MoveControls';
import Timer from './components/Timer';
import SolvePanel from './components/SolvePanel';
import './App.css';

type AppMode = 'idle' | 'scrambled' | 'solving' | 'solved';

export default function App() {
  const [cube, setCube] = useState<CubeState>(createSolvedCube());
  const [scramble, setScramble] = useState<Move[]>([]);
  const [solution, setSolution] = useState<Move[]>([]);
  const [solvingStep, setSolvingStep] = useState(0);
  const [mode, setMode] = useState<AppMode>('idle');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerReset, setTimerReset] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);

  const handleScramble = useCallback(() => {
    const moves = generateScramble(20);
    const scrambled = applyMoves(createSolvedCube(), moves);
    setScramble(moves);
    setCube(scrambled);
    setSolution([]);
    setSolvingStep(0);
    setMode('scrambled');
    setMoveCount(0);
    setTimerReset(true);
    setTimeout(() => {
      setTimerReset(false);
      setTimerRunning(true);
    }, 50);
  }, []);

  const handleMove = useCallback((move: Move) => {
    if (mode === 'solving') return;
    setCube(prev => {
      const next = applyMove(prev, move);
      if (isSolved(next) && mode === 'scrambled') {
        setTimerRunning(false);
        setMode('solved');
      }
      return next;
    });
    setMoveCount(prev => prev + 1);
  }, [mode]);

  const handleTimerStop = useCallback((ms: number) => {
    setLastTime(ms);
    setBestTime(prev => (prev === null || ms < prev) ? ms : prev);
  }, []);

  const handleShowSolution = useCallback(() => {
    setTimerRunning(false);
    const sol = solve(cube, scramble);
    setSolution(sol);
    setSolvingStep(0);
    setMode('solving');
  }, [cube, scramble]);

  const handleStepForward = useCallback(() => {
    setSolvingStep(prev => {
      if (prev >= solution.length) return prev;
      setCube(c => applyMove(c, solution[prev]));
      return prev + 1;
    });
  }, [solution]);

  const handleStepBack = useCallback(() => {
    setSolvingStep(prev => {
      if (prev === 0) return prev;
      const nextStep = prev - 1;
      const base = applyMoves(createSolvedCube(), scramble);
      const newCube = applyMoves(base, solution.slice(0, nextStep));
      setCube(newCube);
      return nextStep;
    });
  }, [solution, scramble]);

  const handleStopSolve = useCallback(() => {
    setMode('scrambled');
    setSolution([]);
    setSolvingStep(0);
    setCube(applyMoves(createSolvedCube(), scramble));
  }, [scramble]);

  const handleReset = useCallback(() => {
    setCube(createSolvedCube());
    setScramble([]);
    setSolution([]);
    setSolvingStep(0);
    setMode('idle');
    setMoveCount(0);
    setTimerRunning(false);
    setTimerReset(true);
    setTimeout(() => setTimerReset(false), 50);
  }, []);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${min > 0 ? min + ':' : ''}${String(sec).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>&#9632; Rubik's Cube</h1>
        <div className="header-actions">
          <button className="btn btn-scramble" onClick={handleScramble}>
            Scramble
          </button>
          <button className="btn btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <div className="timer-section">
            <Timer
              running={timerRunning}
              onStop={handleTimerStop}
              reset={timerReset}
            />
            {mode === 'solved' && (
              <div className="solved-banner">Solved!</div>
            )}
          </div>

          {(lastTime !== null || bestTime !== null) && (
            <div className="time-records">
              {lastTime !== null && (
                <div className="time-record">
                  <span>Last</span>
                  <strong>{formatTime(lastTime)}</strong>
                </div>
              )}
              {bestTime !== null && (
                <div className="time-record best">
                  <span>Best</span>
                  <strong>{formatTime(bestTime)}</strong>
                </div>
              )}
            </div>
          )}

          {moveCount > 0 && (
            <div className="move-count">
              <span>Moves</span>
              <strong>{moveCount}</strong>
            </div>
          )}
        </div>

        <div className="center-panel">
          <CubeNet cube={cube} />
        </div>

        <div className="right-panel">
          <MoveControls
            onMove={handleMove}
            disabled={mode === 'solving'}
          />

          {(mode === 'scrambled' || mode === 'solving') && (
            <SolvePanel
              scramble={scramble}
              solution={solution}
              solvingStep={solvingStep}
              isSolving={mode === 'solving'}
              onStartSolve={handleShowSolution}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onStopSolve={handleStopSolve}
            />
          )}
        </div>
      </main>
    </div>
  );
}

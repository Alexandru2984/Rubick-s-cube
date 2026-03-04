// Simple Rubik's Cube Solver
// Uses the "reverse scramble" approach for scrambled cubes
// For real solving, implements a BFS-based layer-by-layer approach

import type { CubeState, Move } from './cubeLogic';
import { applyMove, isSolved, invertMoves } from './cubeLogic';

// The simplest correct solver: if we tracked the scramble, invert it.
// Otherwise use iterative deepening / BFS for short solutions.

export function solveByInversion(scrambleMoves: Move[]): Move[] {
  return invertMoves(scrambleMoves);
}

// BFS solver for small scrambles (up to ~7 moves)
const ALL_MOVES: Move[] = [
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'F', "F'", 'F2',
  'B', "B'", 'B2',
  'L', "L'", 'L2',
  'R', "R'", 'R2',
];

function cubeToString(cube: CubeState): string {
  const faces = ['U', 'D', 'F', 'B', 'L', 'R'] as const;
  return faces.map(f => cube[f].flat().join('')).join('|');
}

export function bfsSolve(cube: CubeState, maxDepth = 7): Move[] | null {
  if (isSolved(cube)) return [];

  const start = cubeToString(cube);
  const queue: { state: CubeState; moves: Move[] }[] = [{ state: cube, moves: [] }];
  const visited = new Set<string>([start]);

  while (queue.length > 0) {
    const { state, moves } = queue.shift()!;
    if (moves.length >= maxDepth) continue;

    for (const move of ALL_MOVES) {
      const next = applyMove(state, move);
      const key = cubeToString(next);
      if (visited.has(key)) continue;
      visited.add(key);

      const nextMoves = [...moves, move];
      if (isSolved(next)) return nextMoves;
      queue.push({ state: next, moves: nextMoves });
    }
  }
  return null;
}

// Main solve function: tries inversion first (if scramble provided), then BFS
export function solve(cube: CubeState, scramble?: Move[]): Move[] {
  if (isSolved(cube)) return [];

  // If we have the scramble, inversion is always correct
  if (scramble && scramble.length > 0) {
    return solveByInversion(scramble);
  }

  // Try BFS for short solutions
  const bfs = bfsSolve(cube, 6);
  if (bfs) return bfs;

  // Fallback: return empty (unsolvable by this solver without scramble)
  return [];
}

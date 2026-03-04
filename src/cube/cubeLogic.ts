// Rubik's Cube Logic
// Faces: U(top), D(bottom), F(front), B(back), L(left), R(right)
// Colors: 0=white, 1=yellow, 2=green, 3=blue, 4=red, 5=orange

export type FaceColor = 0 | 1 | 2 | 3 | 4 | 5;
export type Face = FaceColor[][];

export interface CubeState {
  U: Face; // White
  D: Face; // Yellow
  F: Face; // Green
  B: Face; // Blue
  L: Face; // Red (Orange)
  R: Face; // Orange (Red)
}

export const COLORS: Record<FaceColor, string> = {
  0: '#FFFFFF', // White
  1: '#FFD500', // Yellow
  2: '#009B48', // Green
  3: '#0045AD', // Blue
  4: '#FF5900', // Orange
  5: '#B90000', // Red
};

export const COLOR_NAMES: Record<FaceColor, string> = {
  0: 'White',
  1: 'Yellow',
  2: 'Green',
  3: 'Blue',
  4: 'Orange',
  5: 'Red',
};

function makeFace(color: FaceColor): Face {
  return [
    [color, color, color],
    [color, color, color],
    [color, color, color],
  ];
}

export function createSolvedCube(): CubeState {
  return {
    U: makeFace(0),
    D: makeFace(1),
    F: makeFace(2),
    B: makeFace(3),
    L: makeFace(4),
    R: makeFace(5),
  };
}

function cloneCube(cube: CubeState): CubeState {
  return {
    U: cube.U.map(row => [...row]) as Face,
    D: cube.D.map(row => [...row]) as Face,
    F: cube.F.map(row => [...row]) as Face,
    B: cube.B.map(row => [...row]) as Face,
    L: cube.L.map(row => [...row]) as Face,
    R: cube.R.map(row => [...row]) as Face,
  };
}

function rotateFaceClockwise(face: Face): Face {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ];
}

// All 18 standard moves
export type Move =
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2'
  | 'L' | "L'" | 'L2'
  | 'R' | "R'" | 'R2';

export function applyMove(cube: CubeState, move: Move): CubeState {
  const times = move.endsWith('2') ? 2 : 1;
  const base = move.replace('2', '').replace("'", '') as Move;
  const ccw = move.includes("'");

  let result = cloneCube(cube);
  for (let i = 0; i < times; i++) {
    result = ccw ? applyBaseMoveReverse(result, base) : applyBaseMove(result, base);
  }
  return result;
}

function applyBaseMove(cube: CubeState, move: Move): CubeState {
  const c = cloneCube(cube);
  switch (move) {
    case 'U': {
      c.U = rotateFaceClockwise(cube.U);
      [c.F[0], c.R[0], c.B[0], c.L[0]] = [
        [...cube.L[0]],
        [...cube.F[0]],
        [...cube.R[0]],
        [...cube.B[0]],
      ];
      break;
    }
    case 'D': {
      c.D = rotateFaceClockwise(cube.D);
      [c.F[2], c.L[2], c.B[2], c.R[2]] = [
        [...cube.R[2]],
        [...cube.F[2]],
        [...cube.L[2]],
        [...cube.B[2]],
      ];
      break;
    }
    case 'F': {
      c.F = rotateFaceClockwise(cube.F);
      const tmp = [cube.U[2][0], cube.U[2][1], cube.U[2][2]];
      c.U[2] = [cube.L[2][2], cube.L[1][2], cube.L[0][2]];
      c.L[0][2] = cube.D[0][0];
      c.L[1][2] = cube.D[0][1];
      c.L[2][2] = cube.D[0][2];
      c.D[0] = [cube.R[2][0], cube.R[1][0], cube.R[0][0]];
      c.R[0][0] = tmp[0];
      c.R[1][0] = tmp[1];
      c.R[2][0] = tmp[2];
      break;
    }
    case 'B': {
      c.B = rotateFaceClockwise(cube.B);
      const tmp = [cube.U[0][0], cube.U[0][1], cube.U[0][2]];
      c.U[0] = [cube.R[0][2], cube.R[1][2], cube.R[2][2]];
      c.R[0][2] = cube.D[2][2];
      c.R[1][2] = cube.D[2][1];
      c.R[2][2] = cube.D[2][0];
      c.D[2] = [cube.L[2][0], cube.L[1][0], cube.L[0][0]];
      c.L[0][0] = tmp[2];
      c.L[1][0] = tmp[1];
      c.L[2][0] = tmp[0];
      break;
    }
    case 'L': {
      c.L = rotateFaceClockwise(cube.L);
      const tmp = [cube.U[0][0], cube.U[1][0], cube.U[2][0]];
      c.U[0][0] = cube.B[2][2];
      c.U[1][0] = cube.B[1][2];
      c.U[2][0] = cube.B[0][2];
      c.B[0][2] = cube.D[2][0];
      c.B[1][2] = cube.D[1][0];
      c.B[2][2] = cube.D[0][0];
      c.D[0][0] = cube.F[0][0];
      c.D[1][0] = cube.F[1][0];
      c.D[2][0] = cube.F[2][0];
      c.F[0][0] = tmp[0];
      c.F[1][0] = tmp[1];
      c.F[2][0] = tmp[2];
      break;
    }
    case 'R': {
      c.R = rotateFaceClockwise(cube.R);
      const tmp = [cube.U[0][2], cube.U[1][2], cube.U[2][2]];
      c.U[0][2] = cube.F[0][2];
      c.U[1][2] = cube.F[1][2];
      c.U[2][2] = cube.F[2][2];
      c.F[0][2] = cube.D[0][2];
      c.F[1][2] = cube.D[1][2];
      c.F[2][2] = cube.D[2][2];
      c.D[0][2] = cube.B[2][0];
      c.D[1][2] = cube.B[1][0];
      c.D[2][2] = cube.B[0][0];
      c.B[0][0] = tmp[2];
      c.B[1][0] = tmp[1];
      c.B[2][0] = tmp[0];
      break;
    }
    default:
      break;
  }
  return c;
}

function applyBaseMoveReverse(cube: CubeState, move: Move): CubeState {
  // Apply the same move 3 times = reverse
  let c = applyBaseMove(cube, move);
  c = applyBaseMove(c, move);
  c = applyBaseMove(c, move);
  return c;
}

export function applyMoves(cube: CubeState, moves: Move[]): CubeState {
  return moves.reduce((c, m) => applyMove(c, m), cube);
}

const SCRAMBLE_MOVES: Move[] = [
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'F', "F'", 'F2',
  'B', "B'", 'B2',
  'L', "L'", 'L2',
  'R', "R'", 'R2',
];

export function generateScramble(length = 20): Move[] {
  const moves: Move[] = [];
  let lastFace = '';
  for (let i = 0; i < length; i++) {
    let move: Move;
    do {
      move = SCRAMBLE_MOVES[Math.floor(Math.random() * SCRAMBLE_MOVES.length)];
    } while (move.replace('2', '').replace("'", '')[0] === lastFace);
    lastFace = move.replace('2', '').replace("'", '')[0];
    moves.push(move);
  }
  return moves;
}

export function isSolved(cube: CubeState): boolean {
  for (const face of Object.values(cube) as Face[]) {
    const center = face[1][1];
    for (const row of face) {
      for (const cell of row) {
        if (cell !== center) return false;
      }
    }
  }
  return true;
}

// Inverse of a move sequence
export function invertMoves(moves: Move[]): Move[] {
  return [...moves].reverse().map(m => {
    if (m.endsWith("'")) return m.replace("'", '') as Move;
    if (m.endsWith('2')) return m;
    return (m + "'") as Move;
  });
}

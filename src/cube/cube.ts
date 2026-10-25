/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Color, Face } from './types';

export const FACE_COLORS: Record<Face, Color> = {
  U: 'white',
  L: 'orange',
  F: 'green',
  R: 'red',
  B: 'blue',
  D: 'yellow',
};

export type CubeState = Record<Face, Color[]>;

export function createSolvedCube(): CubeState {
  return {
    U: Array(9).fill(FACE_COLORS.U),
    L: Array(9).fill(FACE_COLORS.L),
    F: Array(9).fill(FACE_COLORS.F),
    R: Array(9).fill(FACE_COLORS.R),
    B: Array(9).fill(FACE_COLORS.B),
    D: Array(9).fill(FACE_COLORS.D),
  };
}

export function cloneCube(cube: CubeState): CubeState {
  return {
    U: [...cube.U],
    L: [...cube.L],
    F: [...cube.F],
    R: [...cube.R],
    B: [...cube.B],
    D: [...cube.D],
  };
}

// Rotate a single face 90 degrees clockwise:
// 0 1 2     6 3 0
// 3 4 5 ->  7 4 1
// 6 7 8     8 5 2
function rotateFaceCW(face: Color[]): Color[] {
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2],
  ];
}

export function applyMove(cube: CubeState, move: string): CubeState {
  const c = cloneCube(cube);
  const base = move[0] as Face;
  const modifier = move.slice(1);

  const turns = modifier === '2' ? 2 : modifier === "'" ? 3 : 1;

  for (let t = 0; t < turns; t++) {
    applySingleCW(c, base);
  }

  return c;
}

function applySingleCW(c: CubeState, face: Face): void {
  c[face] = rotateFaceCW(c[face]);

  switch (face) {
    case 'U': {
      const temp = [c.F[0], c.F[1], c.F[2]];
      c.F[0] = c.R[0];
      c.F[1] = c.R[1];
      c.F[2] = c.R[2];

      c.R[0] = c.B[0];
      c.R[1] = c.B[1];
      c.R[2] = c.B[2];

      c.B[0] = c.L[0];
      c.B[1] = c.L[1];
      c.B[2] = c.L[2];

      c.L[0] = temp[0];
      c.L[1] = temp[1];
      c.L[2] = temp[2];
      break;
    }
    case 'D': {
      const temp = [c.F[6], c.F[7], c.F[8]];
      c.F[6] = c.L[6];
      c.F[7] = c.L[7];
      c.F[8] = c.L[8];

      c.L[6] = c.B[6];
      c.L[7] = c.B[7];
      c.L[8] = c.B[8];

      c.B[6] = c.R[6];
      c.B[7] = c.R[7];
      c.B[8] = c.R[8];

      c.R[6] = temp[0];
      c.R[7] = temp[1];
      c.R[8] = temp[2];
      break;
    }
    case 'L': {
      const temp = [c.U[0], c.U[3], c.U[6]];
      c.U[0] = c.B[8];
      c.U[3] = c.B[5];
      c.U[6] = c.B[2];

      c.B[8] = c.D[0];
      c.B[5] = c.D[3];
      c.B[2] = c.D[6];

      c.D[0] = c.F[0];
      c.D[3] = c.F[3];
      c.D[6] = c.F[6];

      c.F[0] = temp[0];
      c.F[3] = temp[1];
      c.F[6] = temp[2];
      break;
    }
    case 'R': {
      const temp = [c.U[2], c.U[5], c.U[8]];
      c.U[2] = c.F[2];
      c.U[5] = c.F[5];
      c.U[8] = c.F[8];

      c.F[2] = c.D[2];
      c.F[5] = c.D[5];
      c.F[8] = c.D[8];

      c.D[2] = c.B[6];
      c.D[5] = c.B[3];
      c.D[8] = c.B[0];

      c.B[6] = temp[0];
      c.B[3] = temp[1];
      c.B[0] = temp[2];
      break;
    }
    case 'F': {
      const temp = [c.U[6], c.U[7], c.U[8]];
      c.U[6] = c.L[8];
      c.U[7] = c.L[5];
      c.U[8] = c.L[2];

      c.L[2] = c.D[0];
      c.L[5] = c.D[1];
      c.L[8] = c.D[2];

      c.D[0] = c.R[6];
      c.D[1] = c.R[3];
      c.D[2] = c.R[0];

      c.R[0] = temp[0];
      c.R[3] = temp[1];
      c.R[6] = temp[2];
      break;
    }
    case 'B': {
      const temp = [c.U[0], c.U[1], c.U[2]];
      c.U[0] = c.R[2];
      c.U[1] = c.R[5];
      c.U[2] = c.R[8];

      c.R[2] = c.D[8];
      c.R[5] = c.D[7];
      c.R[8] = c.D[6];

      c.D[6] = c.L[0];
      c.D[7] = c.L[3];
      c.D[8] = c.L[6];

      c.L[0] = temp[2];
      c.L[3] = temp[1];
      c.L[6] = temp[0];
      break;
    }
  }
}

export function applyScramble(scramble: string): { cube: CubeState; error?: string } {
  let cube = createSolvedCube();
  const moves = scramble
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);

  const validMoveRegex = /^[ULFRBD][2']?$/;

  for (const move of moves) {
    if (!validMoveRegex.test(move)) {
      return { cube, error: `Invalid move token: "${move}"` };
    }
    cube = applyMove(cube, move);
  }

  return { cube };
}

// Generate WCA-compliant random 3x3 scramble (21 moves)
export function generateScramble(length: number = 21): string {
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  const modifiers = ['', "'", '2'];
  const oppositeFace: Record<Face, Face> = {
    U: 'D',
    D: 'U',
    L: 'R',
    R: 'L',
    F: 'B',
    B: 'F',
  };

  const moves: string[] = [];
  let lastFace: Face | null = null;
  let secondLastFace: Face | null = null;

  while (moves.length < length) {
    const candidateFace = faces[Math.floor(Math.random() * faces.length)];

    // Disallow same face consecutively (e.g. R R')
    if (candidateFace === lastFace) continue;

    // Disallow redundant parallel moves (e.g. R L R)
    if (
      secondLastFace &&
      candidateFace === secondLastFace &&
      oppositeFace[candidateFace] === lastFace
    ) {
      continue;
    }

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    moves.push(`${candidateFace}${modifier}`);

    secondLastFace = lastFace;
    lastFace = candidateFace;
  }

  return moves.join(' ');
}

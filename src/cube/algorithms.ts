/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CornerBuffer, EdgeBuffer } from './types';

export interface StepSolveDetail {
  stepIndex: number;
  letter: string;
  pieceName: string;
  setup: string;
  algorithm: string;
  undo: string;
  fullSequence: string;
  fullMoves: string;
  explanation: string;
  isCycleBreak?: boolean;
}

// Old Pochmann Corner Algorithm (Modified Y-Perm swapping ULB buffer and RDF target)
export const Y_PERM = "R U' R' U' R U R' F' R U R' U' R' F R";

// Old Pochmann Edge Algorithm (T-Perm swapping UR buffer and UL target)
export const T_PERM = "R U R' U' R' F R2 U' R' U' R U R' F'";

/**
 * Old Pochmann Corner Setups: Buffer = ULB (A), Target = RDF (P)
 * Constraint: ONLY moves from {R, D, F} (and ', 2 modifiers) are allowed.
 * No U, L, or B moves are permitted so the ULB buffer is never disturbed.
 */
export const OP_CORNER_DETAILS: Record<string, { piece: string; setup: string; undo: string }> = {
  A: { piece: 'UBL (ULB)', setup: 'Buffer Piece', undo: 'None' },
  B: { piece: 'UBR', setup: "R D'", undo: "D R'" },
  C: { piece: 'UFR', setup: "F", undo: "F'" },
  D: { piece: 'UFL', setup: "F R'", undo: "R F'" },
  E: { piece: 'LUB', setup: 'Buffer Piece', undo: 'None' },
  F: { piece: 'LUF', setup: "F2", undo: "F2" },
  G: { piece: 'LDF', setup: "D2 R", undo: "R' D2" },
  H: { piece: 'LDB', setup: "D2", undo: "D2" },
  I: { piece: 'FUL', setup: "F' D", undo: "D' F" },
  J: { piece: 'FUR', setup: "R2 D'", undo: "D R2" },
  K: { piece: 'FDR', setup: "R F", undo: "F' R'" },
  L: { piece: 'FDL', setup: "D", undo: "D'" },
  M: { piece: 'RUF', setup: "R'", undo: "R" },
  N: { piece: 'RUB', setup: "R2", undo: "R2" },
  O: { piece: 'RDB', setup: "R", undo: "R'" },
  P: { piece: 'RDF', setup: 'None', undo: 'None' }, // Direct swap target with Y-Perm
  Q: { piece: 'BUR', setup: "R' F", undo: "F' R" },
  R: { piece: 'BUL', setup: 'Buffer Piece', undo: 'None' },
  S: { piece: 'BDL', setup: "D' R", undo: "R' D" },
  T: { piece: 'BDR', setup: "D'", undo: "D" },
  U: { piece: 'DFL', setup: "F'", undo: "F" },
  V: { piece: 'DFR', setup: "R' D'", undo: "D R" },
  W: { piece: 'DBR', setup: "R2 F", undo: "F' R2" },
  X: { piece: 'DBL', setup: "D F'", undo: "F D'" },
};

/**
 * Old Pochmann Edge Setups: Buffer = UR (B), Target = UL (D)
 * Constraint: ONLY moves from {L, Lw, D, Dw} (and ', 2 modifiers) are allowed.
 * No U, R, F, or B moves are permitted so the UR buffer and UBR/UFR corners are never disturbed.
 */
export const OP_EDGE_DETAILS: Record<string, { piece: string; setup: string; undo: string }> = {
  A: { piece: 'UB', setup: "Lw2 D' L2", undo: "L2 D Lw2" },
  B: { piece: 'UR', setup: 'Buffer Piece', undo: 'None' },
  C: { piece: 'UF', setup: "Lw2 D L2", undo: "L2 D' Lw2" },
  D: { piece: 'UL', setup: 'None', undo: 'None' }, // Direct swap target with T-Perm
  E: { piece: 'LU', setup: "L Dw' L", undo: "L' Dw L'" },
  F: { piece: 'LF', setup: "Dw' L", undo: "L' Dw" },
  G: { piece: 'LD', setup: "L Dw L'", undo: "L Dw' L'" },
  H: { piece: 'LB', setup: "Dw L'", undo: "L Dw'" },
  I: { piece: 'FU', setup: "Lw D' L2", undo: "L2 D Lw'" },
  J: { piece: 'FR', setup: "Dw2 L", undo: "L' Dw2" },
  K: { piece: 'FD', setup: "Lw D L2", undo: "L2 D' Lw'" },
  L: { piece: 'FL', setup: "L'", undo: "L" },
  M: { piece: 'RU', setup: 'Buffer Piece', undo: 'None' },
  N: { piece: 'RB', setup: "Dw L", undo: "L' Dw'" },
  O: { piece: 'RD', setup: "D' Lw D L2", undo: "L2 D' Lw' D" },
  P: { piece: 'RF', setup: "Dw' L'", undo: "L Dw" },
  Q: { piece: 'BU', setup: "Lw' D L2", undo: "L2 D' Lw" },
  R: { piece: 'BL', setup: "L", undo: "L'" },
  S: { piece: 'BD', setup: "Lw' D' L2", undo: "L2 D Lw" },
  T: { piece: 'BR', setup: "Dw2 L'", undo: "L Dw2" },
  U: { piece: 'DF', setup: "D' L2", undo: "L2 D" },
  V: { piece: 'DR', setup: "D2 L2", undo: "L2 D2" },
  W: { piece: 'DB', setup: "D L2", undo: "L2 D'" },
  X: { piece: 'DL', setup: "L2", undo: "L2" },
};

export function getEdgeStepDetails(
  targets: string[],
  _buffer: EdgeBuffer = 'UR'
): StepSolveDetail[] {
  return targets.map((letter, idx) => {
    const info = OP_EDGE_DETAILS[letter] || {
      piece: letter,
      setup: 'None',
      undo: 'None',
    };

    const isDirect = info.setup === 'None';
    const isBuffer = info.setup === 'Buffer Piece';

    const setupStr = isDirect || isBuffer ? '' : `[Setup: ${info.setup}] `;
    const undoStr = isDirect || isBuffer ? '' : ` [Undo: ${info.undo}]`;
    const fullSequence = `${setupStr}[T-Perm]${undoStr}`.trim();

    const fullMoves = isDirect || isBuffer
      ? T_PERM
      : `${info.setup} ${T_PERM} ${info.undo}`;

    const explanation = isDirect
      ? `Direct T-Perm swap into ${info.piece} (UL)`
      : `Setup ${info.piece} (${letter}) to UL with ${info.setup}, swap with T-Perm, undo setup with ${info.undo}`;

    return {
      stepIndex: idx + 1,
      letter,
      pieceName: info.piece,
      setup: info.setup,
      algorithm: T_PERM,
      undo: info.undo,
      fullSequence,
      fullMoves,
      explanation,
    };
  });
}

export function getCornerStepDetails(
  targets: string[],
  _buffer: CornerBuffer = 'ULB'
): StepSolveDetail[] {
  return targets.map((letter, idx) => {
    const info = OP_CORNER_DETAILS[letter] || {
      piece: letter,
      setup: 'None',
      undo: 'None',
    };

    const isDirect = info.setup === 'None';
    const isBuffer = info.setup === 'Buffer Piece';

    const setupStr = isDirect || isBuffer ? '' : `[Setup: ${info.setup}] `;
    const undoStr = isDirect || isBuffer ? '' : ` [Undo: ${info.undo}]`;
    const fullSequence = `${setupStr}[Y-Perm]${undoStr}`.trim();

    const fullMoves = isDirect || isBuffer
      ? Y_PERM
      : `${info.setup} ${Y_PERM} ${info.undo}`;

    const explanation = isDirect
      ? `Direct Y-Perm swap into ${info.piece} (RDF)`
      : `Setup ${info.piece} (${letter}) to RDF with ${info.setup}, swap with Y-Perm, undo setup with ${info.undo}`;

    return {
      stepIndex: idx + 1,
      letter,
      pieceName: info.piece,
      setup: info.setup,
      algorithm: Y_PERM,
      undo: info.undo,
      fullSequence,
      fullMoves,
      explanation,
    };
  });
}

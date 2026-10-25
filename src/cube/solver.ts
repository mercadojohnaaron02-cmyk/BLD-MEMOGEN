/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { applyScramble, CubeState } from './cube';
import {
  CORNERS_DEF,
  EDGES_DEF,
} from './speffz';
import {
  BLDSolveResult,
  CornerBuffer,
  CycleGroup,
  EdgeBuffer,
  MemoResult,
} from './types';

interface CornerSlotState {
  pieceId: number;
  stickersAtSlot: [number, number, number]; // which sticker (0, 1, 2) of pieceId is at slot position 0, 1, 2
}

interface EdgeSlotState {
  pieceId: number;
  stickersAtSlot: [number, number]; // which sticker (0, 1) of pieceId is at slot position 0, 1
}

// Read corner slots from 3x3 cube facelets
export function getCornerSlots(cube: CubeState): CornerSlotState[] {
  return CORNERS_DEF.map((slotDef) => {
    const c0 = cube[slotDef.stickers[0].face][slotDef.stickers[0].index];
    const c1 = cube[slotDef.stickers[1].face][slotDef.stickers[1].index];
    const c2 = cube[slotDef.stickers[2].face][slotDef.stickers[2].index];

    // Find which corner piece has these 3 colors
    let foundPieceId = -1;
    let s0 = -1;
    let s1 = -1;
    let s2 = -1;

    for (const piece of CORNERS_DEF) {
      // Piece's solved colors
      const solvedC0 = cubeInitialColor(piece.stickers[0].face);
      const solvedC1 = cubeInitialColor(piece.stickers[1].face);
      const solvedC2 = cubeInitialColor(piece.stickers[2].face);

      const pieceColors = [solvedC0, solvedC1, solvedC2];

      if (
        pieceColors.includes(c0) &&
        pieceColors.includes(c1) &&
        pieceColors.includes(c2)
      ) {
        foundPieceId = piece.id;
        s0 = pieceColors.indexOf(c0);
        s1 = pieceColors.indexOf(c1);
        s2 = pieceColors.indexOf(c2);
        break;
      }
    }

    if (foundPieceId === -1) {
      throw new Error(`Invalid corner piece at slot ${slotDef.name}`);
    }

    return {
      pieceId: foundPieceId,
      stickersAtSlot: [s0, s1, s2],
    };
  });
}

// Read edge slots from 3x3 cube facelets
export function getEdgeSlots(cube: CubeState): EdgeSlotState[] {
  return EDGES_DEF.map((slotDef) => {
    const c0 = cube[slotDef.stickers[0].face][slotDef.stickers[0].index];
    const c1 = cube[slotDef.stickers[1].face][slotDef.stickers[1].index];

    let foundPieceId = -1;
    let s0 = -1;
    let s1 = -1;

    for (const piece of EDGES_DEF) {
      const solvedC0 = cubeInitialColor(piece.stickers[0].face);
      const solvedC1 = cubeInitialColor(piece.stickers[1].face);

      if (
        (c0 === solvedC0 && c1 === solvedC1) ||
        (c0 === solvedC1 && c1 === solvedC0)
      ) {
        foundPieceId = piece.id;
        s0 = c0 === solvedC0 ? 0 : 1;
        s1 = c1 === solvedC1 ? 1 : 0;
        break;
      }
    }

    if (foundPieceId === -1) {
      throw new Error(`Invalid edge piece at slot ${slotDef.name}`);
    }

    return {
      pieceId: foundPieceId,
      stickersAtSlot: [s0, s1],
    };
  });
}

function cubeInitialColor(face: string): string {
  switch (face) {
    case 'U':
      return 'white';
    case 'L':
      return 'orange';
    case 'F':
      return 'green';
    case 'R':
      return 'red';
    case 'B':
      return 'blue';
    case 'D':
      return 'yellow';
    default:
      return '';
  }
}

// Format an array of targets into parentheses and 2-letter pairs
export function formatMemoCycles(cycles: CycleGroup[]): string {
  if (cycles.length === 0) return 'Solved';

  return cycles
    .map((cycle) => {
      const letters = cycle.letters;
      if (letters.length === 0) return '';
      const pairs: string[] = [];
      for (let i = 0; i < letters.length; i += 2) {
        if (i + 1 < letters.length) {
          pairs.push(`${letters[i]}${letters[i + 1]}`);
        } else {
          pairs.push(letters[i]);
        }
      }
      return `(${pairs.join(' ')})`;
    })
    .filter(Boolean)
    .join('');
}

// Solve Corners using Old Pochmann (Buffer: ULB, letter A, piece 0)
export function solveCorners(cube: CubeState, _bufferName: CornerBuffer = 'ULB'): MemoResult {
  const slots: CornerSlotState[] = getCornerSlots(cube).map((s) => ({
    pieceId: s.pieceId,
    stickersAtSlot: [...s.stickersAtSlot] as [number, number, number],
  }));

  const bufferSlotId = 0; // ULB is slot 0
  const cycles: CycleGroup[] = [];
  let currentCycle: string[] = [];
  const rawTargets: string[] = [];
  const visitedSlots = new Set<number>();

  const isSlotSolved = (slotId: number) => {
    return (
      slots[slotId].pieceId === slotId &&
      slots[slotId].stickersAtSlot[0] === 0 &&
      slots[slotId].stickersAtSlot[1] === 1 &&
      slots[slotId].stickersAtSlot[2] === 2
    );
  };

  const getUnsolvedSlot = (): { slotId: number; stickerIdx: number } | null => {
    // Find lowest alphabetical letter among unsolved pieces
    let bestSlot = -1;
    let bestStickerIdx = -1;
    let bestLetter = 'Z';

    for (let slotId = 1; slotId < 8; slotId++) {
      if (!isSlotSolved(slotId) && !visitedSlots.has(slotId)) {
        // Evaluate all 3 stickers of this slot
        for (let stIdx = 0; stIdx < 3; stIdx++) {
          const letter = CORNERS_DEF[slotId].stickers[stIdx].letter;
          if (letter < bestLetter) {
            bestLetter = letter;
            bestSlot = slotId;
            bestStickerIdx = stIdx;
          }
        }
      }
    }

    if (bestSlot !== -1) {
      return { slotId: bestSlot, stickerIdx: bestStickerIdx };
    }

    // Secondary check if visitedSlots had non-solved pieces (e.g. twisted in place)
    for (let slotId = 1; slotId < 8; slotId++) {
      if (!isSlotSolved(slotId)) {
        for (let stIdx = 0; stIdx < 3; stIdx++) {
          const letter = CORNERS_DEF[slotId].stickers[stIdx].letter;
          if (letter < bestLetter) {
            bestLetter = letter;
            bestSlot = slotId;
            bestStickerIdx = stIdx;
          }
        }
      }
    }

    if (bestSlot !== -1) {
      return { slotId: bestSlot, stickerIdx: bestStickerIdx };
    }

    return null;
  };

  let maxIterations = 60;
  while (maxIterations-- > 0) {
    const curPieceId = slots[bufferSlotId].pieceId;

    if (curPieceId !== bufferSlotId) {
      // Buffer contains another piece -> shoot to target
      visitedSlots.add(curPieceId);
      const targetSlotId = curPieceId;
      const targetStickerIdx = slots[bufferSlotId].stickersAtSlot[0];
      const targetLetter = CORNERS_DEF[targetSlotId].stickers[targetStickerIdx].letter;

      currentCycle.push(targetLetter);
      rawTargets.push(targetLetter);

      // Perform swap: buffer <-> targetSlotId
      // The incoming piece at targetSlotId is now oriented with targetStickerIdx at targetStickerIdx
      const pieceAtTarget = slots[targetSlotId];
      const pieceAtBuffer = slots[bufferSlotId];

      // Piece leaving buffer lands at targetSlotId
      // Since targetStickerIdx was at buffer pos 0, it aligns with target pos targetStickerIdx
      slots[targetSlotId] = {
        pieceId: pieceAtBuffer.pieceId,
        stickersAtSlot: [0, 1, 2], // solved at this slot
      };

      // Piece leaving targetSlot moves to buffer
      // The sticker that was at targetSlot's targetStickerIdx now goes to buffer pos 0
      const s0 = pieceAtTarget.stickersAtSlot[targetStickerIdx];
      const s1 = pieceAtTarget.stickersAtSlot[(targetStickerIdx + 1) % 3];
      const s2 = pieceAtTarget.stickersAtSlot[(targetStickerIdx + 2) % 3];

      slots[bufferSlotId] = {
        pieceId: pieceAtTarget.pieceId,
        stickersAtSlot: [s0, s1, s2],
      };
    } else {
      // Buffer piece is at buffer slot
      if (currentCycle.length > 0) {
        cycles.push({ letters: [...currentCycle], isBreak: false });
        currentCycle = [];
      }

      // Check if all other 7 slots are solved
      const nextUnsolved = getUnsolvedSlot();
      if (!nextUnsolved) {
        // All corners are solved!
        break;
      }

      // Break into new cycle
      const breakLetter = CORNERS_DEF[nextUnsolved.slotId].stickers[nextUnsolved.stickerIdx].letter;
      currentCycle.push(breakLetter);
      rawTargets.push(breakLetter);
      visitedSlots.add(nextUnsolved.slotId);

      // Swap buffer with break target
      const pieceAtTarget = slots[nextUnsolved.slotId];
      const pieceAtBuffer = slots[bufferSlotId];

      slots[nextUnsolved.slotId] = {
        pieceId: pieceAtBuffer.pieceId,
        stickersAtSlot: [0, 1, 2],
      };

      const stIdx = nextUnsolved.stickerIdx;
      slots[bufferSlotId] = {
        pieceId: pieceAtTarget.pieceId,
        stickersAtSlot: [
          pieceAtTarget.stickersAtSlot[stIdx],
          pieceAtTarget.stickersAtSlot[(stIdx + 1) % 3],
          pieceAtTarget.stickersAtSlot[(stIdx + 2) % 3],
        ],
      };
    }
  }

  if (currentCycle.length > 0) {
    cycles.push({ letters: currentCycle, isBreak: false });
  }

  // Count solved pieces
  let solvedCount = 0;
  for (let i = 0; i < 8; i++) {
    if (isSlotSolved(i)) solvedCount++;
  }

  return {
    rawTargets,
    groupedCycles: cycles,
    formattedMemo: formatMemoCycles(cycles),
    targetCount: rawTargets.length,
    solvedPiecesCount: solvedCount,
    unsolvedPiecesCount: 8 - solvedCount,
  };
}

// Solve Edges (Buffer: UR, slot 1, Speffz letter B)
export function solveEdges(cube: CubeState, _bufferName: EdgeBuffer = 'UR'): MemoResult {
  const slots: EdgeSlotState[] = getEdgeSlots(cube).map((s) => ({
    pieceId: s.pieceId,
    stickersAtSlot: [...s.stickersAtSlot] as [number, number],
  }));

  // Edge Buffer is strictly UR (slot 1, Speffz letter B)
  const bufferSlotId = 1;
  const cycles: CycleGroup[] = [];
  let currentCycle: string[] = [];
  const rawTargets: string[] = [];
  const visitedSlots = new Set<number>();

  const isSlotSolved = (slotId: number) => {
    return (
      slots[slotId].pieceId === slotId &&
      slots[slotId].stickersAtSlot[0] === 0 &&
      slots[slotId].stickersAtSlot[1] === 1
    );
  };

  const getUnsolvedSlot = (): { slotId: number; stickerIdx: number } | null => {
    let bestSlot = -1;
    let bestStickerIdx = -1;
    let bestLetter = 'Z';

    for (let slotId = 0; slotId < 12; slotId++) {
      if (slotId === bufferSlotId) continue;
      if (!isSlotSolved(slotId) && !visitedSlots.has(slotId)) {
        for (let stIdx = 0; stIdx < 2; stIdx++) {
          const letter = EDGES_DEF[slotId].stickers[stIdx].letter;
          if (letter < bestLetter) {
            bestLetter = letter;
            bestSlot = slotId;
            bestStickerIdx = stIdx;
          }
        }
      }
    }

    if (bestSlot !== -1) {
      return { slotId: bestSlot, stickerIdx: bestStickerIdx };
    }

    for (let slotId = 0; slotId < 12; slotId++) {
      if (slotId === bufferSlotId) continue;
      if (!isSlotSolved(slotId)) {
        for (let stIdx = 0; stIdx < 2; stIdx++) {
          const letter = EDGES_DEF[slotId].stickers[stIdx].letter;
          if (letter < bestLetter) {
            bestLetter = letter;
            bestSlot = slotId;
            bestStickerIdx = stIdx;
          }
        }
      }
    }

    if (bestSlot !== -1) {
      return { slotId: bestSlot, stickerIdx: bestStickerIdx };
    }

    return null;
  };

  let maxIterations = 60;
  while (maxIterations-- > 0) {
    const curPieceId = slots[bufferSlotId].pieceId;

    if (curPieceId !== bufferSlotId) {
      visitedSlots.add(curPieceId);
      const targetSlotId = curPieceId;
      const targetStickerIdx = slots[bufferSlotId].stickersAtSlot[0];
      const targetLetter = EDGES_DEF[targetSlotId].stickers[targetStickerIdx].letter;

      currentCycle.push(targetLetter);
      rawTargets.push(targetLetter);

      // Swap buffer <-> targetSlotId
      const pieceAtTarget = slots[targetSlotId];
      const pieceAtBuffer = slots[bufferSlotId];

      slots[targetSlotId] = {
        pieceId: pieceAtBuffer.pieceId,
        stickersAtSlot: [0, 1],
      };

      const s0 = pieceAtTarget.stickersAtSlot[targetStickerIdx];
      const s1 = pieceAtTarget.stickersAtSlot[(targetStickerIdx + 1) % 2];

      slots[bufferSlotId] = {
        pieceId: pieceAtTarget.pieceId,
        stickersAtSlot: [s0, s1],
      };
    } else {
      if (currentCycle.length > 0) {
        cycles.push({ letters: [...currentCycle], isBreak: false });
        currentCycle = [];
      }

      const nextUnsolved = getUnsolvedSlot();
      if (!nextUnsolved) {
        break;
      }

      const breakLetter = EDGES_DEF[nextUnsolved.slotId].stickers[nextUnsolved.stickerIdx].letter;
      currentCycle.push(breakLetter);
      rawTargets.push(breakLetter);
      visitedSlots.add(nextUnsolved.slotId);

      const pieceAtTarget = slots[nextUnsolved.slotId];
      const pieceAtBuffer = slots[bufferSlotId];

      slots[nextUnsolved.slotId] = {
        pieceId: pieceAtBuffer.pieceId,
        stickersAtSlot: [0, 1],
      };

      const stIdx = nextUnsolved.stickerIdx;
      slots[bufferSlotId] = {
        pieceId: pieceAtTarget.pieceId,
        stickersAtSlot: [
          pieceAtTarget.stickersAtSlot[stIdx],
          pieceAtTarget.stickersAtSlot[(stIdx + 1) % 2],
        ],
      };
    }
  }

  if (currentCycle.length > 0) {
    cycles.push({ letters: currentCycle, isBreak: false });
  }

  let solvedCount = 0;
  for (let i = 0; i < 12; i++) {
    if (isSlotSolved(i)) solvedCount++;
  }

  return {
    rawTargets,
    groupedCycles: cycles,
    formattedMemo: formatMemoCycles(cycles),
    targetCount: rawTargets.length,
    solvedPiecesCount: solvedCount,
    unsolvedPiecesCount: 12 - solvedCount,
  };
}

export function solveBlindfolded(
  scrambleOrCube: string | CubeState,
  edgeBuffer: EdgeBuffer = 'UR',
  cornerBuffer: CornerBuffer = 'ULB'
): BLDSolveResult {
  let cube: CubeState;

  if (typeof scrambleOrCube === 'string') {
    const res = applyScramble(scrambleOrCube);
    if (res.error) {
      return {
        edges: { rawTargets: [], groupedCycles: [], formattedMemo: '', targetCount: 0, solvedPiecesCount: 0, unsolvedPiecesCount: 0 },
        corners: { rawTargets: [], groupedCycles: [], formattedMemo: '', targetCount: 0, solvedPiecesCount: 0, unsolvedPiecesCount: 0 },
        hasParity: false,
        isValid: false,
        errorMessage: res.error,
      };
    }
    cube = res.cube;
  } else {
    cube = scrambleOrCube;
  }

  try {
    const edges = solveEdges(cube, edgeBuffer);
    const corners = solveCorners(cube, cornerBuffer);

    // Parity occurs when edge target count is odd
    const hasParity = edges.targetCount % 2 !== 0;

    return {
      edges,
      corners,
      hasParity,
      isValid: true,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      edges: { rawTargets: [], groupedCycles: [], formattedMemo: '', targetCount: 0, solvedPiecesCount: 0, unsolvedPiecesCount: 0 },
      corners: { rawTargets: [], groupedCycles: [], formattedMemo: '', targetCount: 0, solvedPiecesCount: 0, unsolvedPiecesCount: 0 },
      hasParity: false,
      isValid: false,
      errorMessage: msg,
    };
  }
}

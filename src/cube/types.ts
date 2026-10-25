/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Face = 'U' | 'L' | 'F' | 'R' | 'B' | 'D';

export type Color = 'white' | 'orange' | 'green' | 'red' | 'blue' | 'yellow';

export interface StickerPos {
  face: Face;
  index: number; // 0 to 8
}

export interface CornerDefinition {
  id: number; // 0 to 7
  name: string;
  stickers: {
    letter: string;
    face: Face;
    index: number;
    posName: string;
  }[];
}

export interface EdgeDefinition {
  id: number; // 0 to 11
  name: string;
  stickers: {
    letter: string;
    face: Face;
    index: number;
    posName: string;
  }[];
}

export interface CycleGroup {
  letters: string[];
  isBreak: boolean;
}

export interface MemoResult {
  rawTargets: string[];
  groupedCycles: CycleGroup[];
  formattedMemo: string; // e.g. "(BT JK)(AE WX A)(C OS I)"
  targetCount: number;
  solvedPiecesCount: number;
  unsolvedPiecesCount: number;
}

export interface BLDSolveResult {
  edges: MemoResult;
  corners: MemoResult;
  hasParity: boolean;
  isValid: boolean;
  errorMessage?: string;
}

export type EdgeBuffer = 'UR';
export type CornerBuffer = 'ULB';

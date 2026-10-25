/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CornerDefinition, EdgeDefinition, Face } from './types';

export const EDGES_DEF: EdgeDefinition[] = [
  {
    id: 0,
    name: 'UB',
    stickers: [
      { letter: 'A', face: 'U', index: 1, posName: 'UB' },
      { letter: 'Q', face: 'B', index: 1, posName: 'BU' },
    ],
  },
  {
    id: 1,
    name: 'UR',
    stickers: [
      { letter: 'B', face: 'U', index: 5, posName: 'UR' },
      { letter: 'M', face: 'R', index: 1, posName: 'RU' },
    ],
  },
  {
    id: 2,
    name: 'UF',
    stickers: [
      { letter: 'C', face: 'U', index: 7, posName: 'UF' },
      { letter: 'I', face: 'F', index: 1, posName: 'FU' },
    ],
  },
  {
    id: 3,
    name: 'UL',
    stickers: [
      { letter: 'D', face: 'U', index: 3, posName: 'UL' },
      { letter: 'E', face: 'L', index: 1, posName: 'LU' },
    ],
  },
  {
    id: 4,
    name: 'LF',
    stickers: [
      { letter: 'F', face: 'L', index: 5, posName: 'LF' },
      { letter: 'L', face: 'F', index: 3, posName: 'FL' },
    ],
  },
  {
    id: 5,
    name: 'FR',
    stickers: [
      { letter: 'J', face: 'F', index: 5, posName: 'FR' },
      { letter: 'P', face: 'R', index: 3, posName: 'RF' },
    ],
  },
  {
    id: 6,
    name: 'RB',
    stickers: [
      { letter: 'N', face: 'R', index: 5, posName: 'RB' },
      { letter: 'T', face: 'B', index: 3, posName: 'BR' },
    ],
  },
  {
    id: 7,
    name: 'BL',
    stickers: [
      { letter: 'R', face: 'B', index: 5, posName: 'BL' },
      { letter: 'H', face: 'L', index: 3, posName: 'LB' },
    ],
  },
  {
    id: 8,
    name: 'DF',
    stickers: [
      { letter: 'U', face: 'D', index: 1, posName: 'DF' },
      { letter: 'K', face: 'F', index: 7, posName: 'FD' },
    ],
  },
  {
    id: 9,
    name: 'DR',
    stickers: [
      { letter: 'V', face: 'D', index: 5, posName: 'DR' },
      { letter: 'O', face: 'R', index: 7, posName: 'RD' },
    ],
  },
  {
    id: 10,
    name: 'DB',
    stickers: [
      { letter: 'W', face: 'D', index: 7, posName: 'DB' },
      { letter: 'S', face: 'B', index: 7, posName: 'BD' },
    ],
  },
  {
    id: 11,
    name: 'DL',
    stickers: [
      { letter: 'X', face: 'D', index: 3, posName: 'DL' },
      { letter: 'G', face: 'L', index: 7, posName: 'LD' },
    ],
  },
];

export const CORNERS_DEF: CornerDefinition[] = [
  {
    id: 0,
    name: 'UBL',
    stickers: [
      { letter: 'A', face: 'U', index: 0, posName: 'UBL' },
      { letter: 'E', face: 'L', index: 0, posName: 'LUB' },
      { letter: 'R', face: 'B', index: 2, posName: 'BUL' },
    ],
  },
  {
    id: 1,
    name: 'UBR',
    stickers: [
      { letter: 'B', face: 'U', index: 2, posName: 'UBR' },
      { letter: 'N', face: 'R', index: 2, posName: 'RUB' },
      { letter: 'Q', face: 'B', index: 0, posName: 'BUR' },
    ],
  },
  {
    id: 2,
    name: 'UFR',
    stickers: [
      { letter: 'C', face: 'U', index: 8, posName: 'UFR' },
      { letter: 'J', face: 'F', index: 2, posName: 'FUR' },
      { letter: 'M', face: 'R', index: 0, posName: 'RUF' },
    ],
  },
  {
    id: 3,
    name: 'UFL',
    stickers: [
      { letter: 'D', face: 'U', index: 6, posName: 'UFL' },
      { letter: 'F', face: 'L', index: 2, posName: 'LUF' },
      { letter: 'I', face: 'F', index: 0, posName: 'FUL' },
    ],
  },
  {
    id: 4,
    name: 'DFL',
    stickers: [
      { letter: 'U', face: 'D', index: 0, posName: 'DFL' },
      { letter: 'G', face: 'L', index: 8, posName: 'LDF' },
      { letter: 'L', face: 'F', index: 6, posName: 'FDL' },
    ],
  },
  {
    id: 5,
    name: 'DFR',
    stickers: [
      { letter: 'V', face: 'D', index: 2, posName: 'DFR' },
      { letter: 'K', face: 'F', index: 8, posName: 'FDR' },
      { letter: 'P', face: 'R', index: 6, posName: 'RDF' },
    ],
  },
  {
    id: 6,
    name: 'DBR',
    stickers: [
      { letter: 'W', face: 'D', index: 8, posName: 'DBR' },
      { letter: 'O', face: 'R', index: 8, posName: 'RDB' },
      { letter: 'T', face: 'B', index: 6, posName: 'BDR' },
    ],
  },
  {
    id: 7,
    name: 'DBL',
    stickers: [
      { letter: 'X', face: 'D', index: 6, posName: 'DBL' },
      { letter: 'S', face: 'B', index: 8, posName: 'BDL' },
      { letter: 'H', face: 'L', index: 6, posName: 'LDB' },
    ],
  },
];

// Helper maps for lookup
export const EDGE_STICKER_BY_LETTER = new Map<string, { pieceId: number; stickerIndex: number }>();
export const CORNER_STICKER_BY_LETTER = new Map<string, { pieceId: number; stickerIndex: number }>();

EDGES_DEF.forEach((piece) => {
  piece.stickers.forEach((s, idx) => {
    EDGE_STICKER_BY_LETTER.set(s.letter, { pieceId: piece.id, stickerIndex: idx });
  });
});

CORNERS_DEF.forEach((piece) => {
  piece.stickers.forEach((s, idx) => {
    CORNER_STICKER_BY_LETTER.set(s.letter, { pieceId: piece.id, stickerIndex: idx });
  });
});

export function getLetterForFacelet(face: Face, index: number, isEdge: boolean): string | null {
  if (isEdge) {
    for (const piece of EDGES_DEF) {
      for (const st of piece.stickers) {
        if (st.face === face && st.index === index) return st.letter;
      }
    }
  } else {
    for (const piece of CORNERS_DEF) {
      for (const st of piece.stickers) {
        if (st.face === face && st.index === index) return st.letter;
      }
    }
  }
  return null;
}

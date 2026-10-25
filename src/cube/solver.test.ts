/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'node:assert/strict';
import test from 'node:test';
import { applyScramble, createSolvedCube, generateScramble } from './cube';
import { CORNERS_DEF, EDGES_DEF } from './speffz';
import { solveBlindfolded } from './solver';

test('Speffz definitions cover all 24 corner and 24 edge stickers', () => {
  assert.equal(CORNERS_DEF.length, 8, 'Must have 8 corner pieces');
  assert.equal(EDGES_DEF.length, 12, 'Must have 12 edge pieces');

  const cornerLetters = CORNERS_DEF.flatMap((c) => c.stickers.map((s) => s.letter)).sort();
  const edgeLetters = EDGES_DEF.flatMap((e) => e.stickers.map((s) => s.letter)).sort();

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWX'.split('');
  assert.deepEqual(cornerLetters, alphabet, 'Corners must cover Speffz A to X');
  assert.deepEqual(edgeLetters, alphabet, 'Edges must cover Speffz A to X');

  // Verify Buffer locations
  // Corner Buffer: ULB (A)
  const ulbCorner = CORNERS_DEF.find((c) => c.name === 'UBL');
  assert.ok(ulbCorner);
  assert.equal(ulbCorner.stickers[0].letter, 'A');

  // Edge Buffer: UR (B)
  const urEdge = EDGES_DEF.find((e) => e.name === 'UR');
  assert.ok(urEdge);
  assert.equal(urEdge.stickers[0].letter, 'B');
});

test('Solved cube produces empty memo and no parity', () => {
  const solved = createSolvedCube();
  const res = solveBlindfolded(solved);

  assert.equal(res.isValid, true);
  assert.equal(res.hasParity, false);
  assert.equal(res.edges.targetCount, 0);
  assert.equal(res.corners.targetCount, 0);
  assert.equal(res.edges.formattedMemo, 'Solved');
  assert.equal(res.corners.formattedMemo, 'Solved');
});

test('T-Perm produces parity (odd edge/corner targets)', () => {
  // Standard T-Perm: R U R' U' R' F R2 U' R' U' R U R' F'
  // Swaps 2 edges (UR & UL) and 2 corners (UBR & UFR)
  const tPerm = "R U R' U' R' F R2 U' R' U' R U R' F'";
  const res = solveBlindfolded(tPerm);

  assert.equal(res.isValid, true);
  assert.equal(res.hasParity, true, 'T-Perm must have parity');
  assert.ok(res.edges.targetCount % 2 !== 0, 'Edges must have odd target count');
});

test('Known scramble "R U R\' U\'" solves correctly and produces valid memo', () => {
  const scramble = "R U R' U'";
  const res = solveBlindfolded(scramble);

  assert.equal(res.isValid, true);
  assert.ok(res.edges.targetCount > 0, 'Edge target count should be > 0');
  assert.ok(res.corners.targetCount > 0, 'Corner target count should be > 0');
  // Check formatted string contains parentheses
  assert.ok(res.edges.formattedMemo.startsWith('('));
  assert.ok(res.corners.formattedMemo.startsWith('('));
});

test('Random scramble generator produces valid WCA scrambles', () => {
  for (let i = 0; i < 5; i++) {
    const scramble = generateScramble(21);
    const tokens = scramble.split(' ');
    assert.equal(tokens.length, 21, 'Must have 21 moves');

    const res = applyScramble(scramble);
    assert.equal(res.error, undefined, 'Scramble must be valid');

    const solveRes = solveBlindfolded(scramble);
    assert.equal(solveRes.isValid, true, 'Blindfolded solver must solve random scramble');
  }
});

test('Mnemonic word pairs dictionary contains 552+ words and covers all Speffz pairs', async () => {
  const { DEFAULT_WORD_PAIRS, getMnemonicWord } = await import('./wordPairs');
  const totalEntries = Object.keys(DEFAULT_WORD_PAIRS).length;
  assert.ok(
    totalEntries >= 552,
    `Must have at least 552 word pairs, currently has ${totalEntries}`
  );

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWX'.split('');
  // Check that all 24x23 = 552 distinct pairs have a word
  let foundCount = 0;
  for (const l1 of letters) {
    for (const l2 of letters) {
      if (l1 !== l2) {
        const pair = `${l1}${l2}`;
        const word = getMnemonicWord(pair);
        assert.ok(word, `Pair ${pair} must have a mnemonic word`);
        foundCount++;
      }
    }
  }
  assert.equal(foundCount, 552, 'All 552 distinct Speffz pairs must have mnemonic words');
});

test('Step-by-step solve details generate correctly for edges and corners with strict move constraints', async () => {
  const { getEdgeStepDetails, getCornerStepDetails, OP_EDGE_DETAILS, OP_CORNER_DETAILS, T_PERM, Y_PERM } =
    await import('./algorithms');

  // Verify that ALL edge setups ONLY use L, Lw, D, Dw
  const allowedEdgeMovesRegex = /^(L|Lw|D|Dw)[2']?$/;
  for (const [letter, info] of Object.entries(OP_EDGE_DETAILS)) {
    if (info.setup !== 'None' && info.setup !== 'Buffer Piece') {
      const tokens = info.setup.split(/\s+/);
      for (const tok of tokens) {
        assert.ok(
          allowedEdgeMovesRegex.test(tok),
          `Edge setup for ${letter} contains illegal move "${tok}". Only L, Lw, D, Dw allowed!`
        );
      }
      const undoTokens = info.undo.split(/\s+/);
      for (const tok of undoTokens) {
        assert.ok(
          allowedEdgeMovesRegex.test(tok),
          `Edge undo for ${letter} contains illegal move "${tok}". Only L, Lw, D, Dw allowed!`
        );
      }
    }
  }

  // Specifically verify R lettering scheme for edges brings BL to UL with move L
  assert.equal(OP_EDGE_DETAILS['R'].setup, 'L');
  assert.equal(OP_EDGE_DETAILS['R'].undo, "L'");

  // Verify that ALL corner setups ONLY use R, D, F
  const allowedCornerMovesRegex = /^(R|D|F)[2']?$/;
  for (const [letter, info] of Object.entries(OP_CORNER_DETAILS)) {
    if (info.setup !== 'None' && info.setup !== 'Buffer Piece') {
      const tokens = info.setup.split(/\s+/);
      for (const tok of tokens) {
        assert.ok(
          allowedCornerMovesRegex.test(tok),
          `Corner setup for ${letter} contains illegal move "${tok}". Only R, D, F allowed!`
        );
      }
      const undoTokens = info.undo.split(/\s+/);
      for (const tok of undoTokens) {
        assert.ok(
          allowedCornerMovesRegex.test(tok),
          `Corner undo for ${letter} contains illegal move "${tok}". Only R, D, F allowed!`
        );
      }
    }
  }

  // Verify corner target slot RDF (P) is direct (setup: None)
  assert.equal(OP_CORNER_DETAILS['P'].setup, 'None');

  // Verify edge step sequence and full execution moves
  const edgeTargets = ['D', 'R', 'A'];
  const edgeSteps = getEdgeStepDetails(edgeTargets, 'UR');
  assert.equal(edgeSteps.length, 3);
  assert.equal(edgeSteps[0].letter, 'D');
  assert.equal(edgeSteps[0].setup, 'None');
  assert.equal(edgeSteps[0].fullSequence, '[T-Perm]');
  assert.equal(edgeSteps[0].fullMoves, T_PERM);

  assert.equal(edgeSteps[1].letter, 'R');
  assert.equal(edgeSteps[1].setup, 'L');
  assert.equal(edgeSteps[1].undo, "L'");
  assert.equal(edgeSteps[1].fullSequence, "[Setup: L] [T-Perm] [Undo: L']");
  assert.equal(edgeSteps[1].fullMoves, `L ${T_PERM} L'`);

  // Verify corner step sequence and full execution moves
  const cornerTargets = ['P', 'B', 'C'];
  const cornerSteps = getCornerStepDetails(cornerTargets, 'ULB');
  assert.equal(cornerSteps.length, 3);
  assert.equal(cornerSteps[0].letter, 'P');
  assert.equal(cornerSteps[0].setup, 'None');
  assert.equal(cornerSteps[0].fullSequence, '[Y-Perm]');
  assert.equal(cornerSteps[0].fullMoves, Y_PERM);

  assert.equal(cornerSteps[1].letter, 'B');
  assert.equal(cornerSteps[1].setup, "R D'");
  assert.equal(cornerSteps[1].undo, "D R'");
  assert.equal(cornerSteps[1].fullSequence, "[Setup: R D'] [Y-Perm] [Undo: D R']");
  assert.equal(cornerSteps[1].fullMoves, `R D' ${Y_PERM} D R'`);
});




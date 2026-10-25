/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppBar } from './components/AppBar';
import { ScrambleCard } from './components/ScrambleCard';
import { ActionButtons } from './components/ActionButtons';
import { MemoCard } from './components/MemoCard';
import { ParityCard } from './components/ParityCard';
import { CubeNetVisualizer } from './components/CubeNetVisualizer';
import { SettingsModal } from './components/SettingsModal';
import { InfoModal } from './components/InfoModal';
import { EditScrambleModal } from './components/EditScrambleModal';
import { generateScramble, applyScramble, CubeState, createSolvedCube } from './cube/cube';
import { solveBlindfolded } from './cube/solver';
import { BLDSolveResult, EdgeBuffer } from './cube/types';

const STORAGE_KEYS = {
  SCRAMBLE: 'bld_memogen_scramble',
  EDGE_BUFFER: 'bld_memogen_edge_buffer',
  SCRAMBLE_LEN: 'bld_memogen_scramble_len',
  HIDE_NO_PARITY: 'bld_memogen_hide_no_parity',
};

const DEFAULT_SAMPLE_SCRAMBLE =
  "U' L' B2 U' F2 U B U2 R L F D' R2 L U' L2 U2 F2 R L2 F' D' U B2 D2";

export default function App() {
  // Saved states from localStorage or defaults
  const [scramble, setScramble] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SCRAMBLE) || DEFAULT_SAMPLE_SCRAMBLE;
  });

  // Edge Buffer is strictly UR (Old Pochmann)
  const edgeBuffer: EdgeBuffer = 'UR';

  const [scrambleLength, setScrambleLength] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCRAMBLE_LEN);
    return saved ? Number(saved) : 21;
  });

  const [hideWhenNoParity, setHideWhenNoParity] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.HIDE_NO_PARITY) === 'true';
  });

  // Independent memo reveal states: clicking reveal on edge only reveals edge, on corner only reveals corner
  const [isEdgeRevealed, setIsEdgeRevealed] = useState<boolean>(false);
  const [isCornerRevealed, setIsCornerRevealed] = useState<boolean>(false);

  // Modal dialog states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isEditScrambleOpen, setIsEditScrambleOpen] = useState(false);

  // Solving states
  const [cubeState, setCubeState] = useState<CubeState>(createSolvedCube);
  const [solveResult, setSolveResult] = useState<BLDSolveResult>(() =>
    solveBlindfolded(DEFAULT_SAMPLE_SCRAMBLE, 'UR', 'ULB')
  );
  const [toastMessage, setToastMessage] = useState<{ text: string; isParity?: boolean } | null>(
    null
  );

  const showToast = (text: string, isParity: boolean = false) => {
    setToastMessage({ text, isParity });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run solve on current scramble and buffer configuration
  const runSolve = useCallback(
    (targetScramble: string, buffer: EdgeBuffer): BLDSolveResult | null => {
      const applyRes = applyScramble(targetScramble);
      if (applyRes.error) {
        showToast(applyRes.error, false);
        return null;
      }

      setCubeState(applyRes.cube);
      const res = solveBlindfolded(applyRes.cube, buffer, 'ULB');

      if (!res.isValid && res.errorMessage) {
        showToast(res.errorMessage, false);
        return null;
      } else {
        setSolveResult(res);
        return res;
      }
    },
    []
  );

  // Initial solve on mount to determine parity and initial state
  useEffect(() => {
    runSolve(scramble, edgeBuffer);
  }, [scramble, edgeBuffer, runSolve]);

  // Handle generating a new random scramble:
  // Clears old memo, leaves it empty with "Click SOLVE to see the memo", and checks/alerts parity!
  const handleScramble = () => {
    const newScramble = generateScramble(scrambleLength);
    setScramble(newScramble);
    localStorage.setItem(STORAGE_KEYS.SCRAMBLE, newScramble);

    // Hide old memos independently
    setIsEdgeRevealed(false);
    setIsCornerRevealed(false);

    // Compute new cube state & detect parity
    const res = runSolve(newScramble, edgeBuffer);

    if (res) {
      if (res.hasParity) {
        showToast('⚠️ Parity Detected (Odd Targets)!', true);
      } else {
        showToast('Cube Scrambled • No Parity', false);
      }
    }
  };

  // Handle solve button click: reveals both edge memo and corner memo
  const handleSolve = () => {
    runSolve(scramble, edgeBuffer);
    setIsEdgeRevealed(true);
    setIsCornerRevealed(true);
    showToast('Memo revealed!');
  };

  // Save custom scramble from modal
  const handleSaveCustomScramble = (newScramble: string) => {
    setScramble(newScramble);
    localStorage.setItem(STORAGE_KEYS.SCRAMBLE, newScramble);
    setIsEdgeRevealed(false);
    setIsCornerRevealed(false);
    const res = runSolve(newScramble, edgeBuffer);
    if (res) {
      if (res.hasParity) {
        showToast('⚠️ Parity Detected (Odd Targets)!', true);
      } else {
        showToast('Custom Scramble Applied • No Parity', false);
      }
    }
  };

  const handleToggleHideNoParity = () => {
    const val = !hideWhenNoParity;
    setHideWhenNoParity(val);
    localStorage.setItem(STORAGE_KEYS.HIDE_NO_PARITY, String(val));
  };

  const handleScrambleLengthChange = (len: number) => {
    setScrambleLength(len);
    localStorage.setItem(STORAGE_KEYS.SCRAMBLE_LEN, String(len));
  };

  return (
    <div className="min-h-screen bg-[#ECEFF1] text-neutral-900 font-sans flex flex-col items-center">
      {/* Android Device Container */}
      <div className="w-full max-w-lg min-h-screen bg-[#F5F5F5] flex flex-col shadow-2xl relative">
        {/* Android simulated status bar for authentic mobile look */}
        <div className="bg-[#303F9F] text-white/90 text-[11px] px-4 py-1 flex items-center justify-between select-none">
          <span className="font-semibold tracking-wider">12:00</span>
          <div className="flex items-center space-x-2 text-xs">
            <span>LTE</span>
            <span>100%</span>
          </div>
        </div>

        {/* Material AppBar: Solid Blue #3F51B5 with title MemoGenerator */}
        <AppBar
          title="MemoGenerator"
          onOpenInfo={() => setIsInfoOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-3.5 pb-8">
          {/* Scramble Display Card */}
          <ScrambleCard
            scramble={scramble}
            onEditScramble={() => setIsEditScrambleOpen(true)}
          />

          {/* Action Buttons: [ SOLVE ] [ SCRAMBLE ] */}
          <ActionButtons
            onSolve={handleSolve}
            onScramble={handleScramble}
          />

          {/* Edge Memo Section - Independent reveal */}
          <MemoCard
            title="Edge-Memo"
            subtitle="Old Pochmann, Buffer: UR"
            memo={solveResult.edges}
            isRevealed={isEdgeRevealed}
            onReveal={() => {
              setIsEdgeRevealed(true);
              showToast('Edge memo revealed!');
            }}
            onHide={() => setIsEdgeRevealed(false)}
            isEdge={true}
            bufferType={edgeBuffer}
          />

          {/* Corner Memo Section - Independent reveal */}
          <MemoCard
            title="Corner-Memo"
            subtitle="Old Pochmann, Buffer: ULB"
            memo={solveResult.corners}
            isRevealed={isCornerRevealed}
            onReveal={() => {
              setIsCornerRevealed(true);
              showToast('Corner memo revealed!');
            }}
            onHide={() => setIsCornerRevealed(false)}
            isEdge={false}
          />

          {/* Parity Section: evaluates parity immediately on scramble */}
          <ParityCard
            hasParity={solveResult.hasParity}
            hideWhenNoParity={hideWhenNoParity}
          />

          {/* Interactive Cube Net Visualizer with Speffz Mapping */}
          <CubeNetVisualizer
            cube={cubeState}
            edgeBufferName={edgeBuffer}
            cornerBufferName="ULB"
          />
        </main>

        {/* Footer info */}
        <footer className="text-center py-3 text-[11px] text-neutral-400 select-none">
          Speffz Standard Lettering (ULFRBD) • Fully Offline
        </footer>

        {/* Floating Toast Message */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-xs px-4 py-2.5 rounded-full shadow-lg backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center space-x-2 ${
              toastMessage.isParity
                ? 'bg-rose-900 text-white border border-rose-600 ring-2 ring-rose-400/30'
                : 'bg-neutral-900/90 text-white'
            }`}
          >
            <span>{toastMessage.text}</span>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        scrambleLength={scrambleLength}
        onChangeScrambleLength={handleScrambleLengthChange}
        hideWhenNoParity={hideWhenNoParity}
        onToggleHideNoParity={handleToggleHideNoParity}
      />

      {/* Info Dialog */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Edit Scramble Dialog */}
      <EditScrambleModal
        isOpen={isEditScrambleOpen}
        onClose={() => setIsEditScrambleOpen(false)}
        currentScramble={scramble}
        onSaveScramble={handleSaveCustomScramble}
      />
    </div>
  );
}

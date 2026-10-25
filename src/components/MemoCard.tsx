/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Sparkles, Eye, EyeOff, Lock, ListOrdered } from 'lucide-react';
import { EdgeBuffer, MemoResult } from '../cube/types';
import { getMnemonicWord } from '../cube/wordPairs';
import { getCornerStepDetails, getEdgeStepDetails, StepSolveDetail } from '../cube/algorithms';

interface MemoCardProps {
  title: string; // e.g. "Edge-Memo" or "Corner-Memo"
  subtitle: string; // e.g. "M2, Buffer: DF" or "Old Pochmann, Buffer: ULB"
  memo: MemoResult;
  isRevealed: boolean;
  onReveal?: () => void;
  onHide?: () => void;
  isEdge?: boolean;
  bufferType?: EdgeBuffer;
}

export const MemoCard: React.FC<MemoCardProps> = ({
  title,
  subtitle,
  memo,
  isRevealed,
  onReveal,
  onHide,
  isEdge = false,
  bufferType = 'UR',
}) => {
  const [copied, setCopied] = useState(false);
  const [showMnemonics, setShowMnemonics] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const handleCopy = async () => {
    if (!isRevealed) return;
    try {
      await navigator.clipboard.writeText(memo.formattedMemo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCopyStep = async (text: string, stepIdx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(stepIdx);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch {
      setCopiedStep(null);
    }
  };

  // Extract letter pairs for mnemonic breakdown
  const pairsList: { pair: string; word: string | null }[] = [];
  if (isRevealed) {
    memo.groupedCycles.forEach((c) => {
      for (let i = 0; i < c.letters.length; i += 2) {
        if (i + 1 < c.letters.length) {
          const pair = `${c.letters[i]}${c.letters[i + 1]}`;
          pairsList.push({ pair, word: getMnemonicWord(pair) });
        } else {
          pairsList.push({ pair: c.letters[i], word: getMnemonicWord(c.letters[i]) });
        }
      }
    });
  }

  // Compute step-by-step solve instructions for this specific memo (Edges or Corners)
  const stepDetails: StepSolveDetail[] = isRevealed
    ? isEdge
      ? getEdgeStepDetails(memo.rawTargets, bufferType)
      : getCornerStepDetails(memo.rawTargets, 'ULB')
    : [];

  return (
    <div className="bg-white rounded-md shadow-sm border border-neutral-200/80 p-4 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-medium text-black tracking-tight">{title}</h2>
          <p className="text-xs text-neutral-500 font-normal">{subtitle}</p>
        </div>

        {isRevealed ? (
          <div className="flex items-center space-x-1">
            {onHide && (
              <button
                type="button"
                onClick={onHide}
                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                title="Hide memo"
                aria-label={`Hide ${title}`}
              >
                <EyeOff className="w-4 h-4" />
              </button>
            )}

            {/* Step-by-Step Solve Guide button (separated for Edge and Corner) */}
            <button
              type="button"
              onClick={() => setShowSteps(!showSteps)}
              className={`p-1.5 rounded hover:bg-neutral-100 transition-colors ${
                showSteps
                  ? 'text-indigo-600 bg-indigo-50 ring-1 ring-indigo-200'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="How to solve step-by-step"
              aria-label={`View step-by-step solve instructions for ${title}`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            {/* Mnemonic word helper */}
            <button
              type="button"
              onClick={() => setShowMnemonics(!showMnemonics)}
              className={`p-1.5 rounded hover:bg-neutral-100 transition-colors ${
                showMnemonics
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Toggle mnemonic helper words"
              aria-label={`Toggle mnemonic helper words for ${title}`}
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
              title="Copy memo"
              aria-label={`Copy ${title} text`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <span className="inline-flex items-center space-x-1 text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
              <Lock className="w-3 h-3" />
              <span>Hidden</span>
            </span>
          </div>
        )}
      </div>

      {/* Main Memo Display */}
      <div className="mt-3">
        {isRevealed ? (
          <div>
            {/* Bold Blue Text (#0000FF) when revealed */}
            <div
              data-testid={`${title.toLowerCase()}-output`}
              className="font-bold text-xl sm:text-2xl text-[#0000FF] tracking-wider select-all break-words leading-tight"
            >
              {memo.formattedMemo}
            </div>

            {memo.targetCount > 0 && (
              <div className="mt-1 flex items-center space-x-3 text-xs text-neutral-500">
                <span>
                  {memo.targetCount} target{memo.targetCount === 1 ? '' : 's'}
                </span>
                <span>•</span>
                <span>
                  {memo.groupedCycles.length} cycle{memo.groupedCycles.length === 1 ? '' : 's'}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Placeholder when scrambled or unrevealed */
          <button
            type="button"
            onClick={onReveal}
            aria-label={`Click to solve and see ${title}`}
            className="w-full text-left py-3 px-3.5 rounded-sm bg-neutral-50 hover:bg-neutral-100/80 border border-dashed border-neutral-300 text-neutral-500 flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-neutral-600 italic group-hover:text-neutral-900 transition-colors">
                Click SOLVE to see the memo
              </span>
            </div>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-1 bg-white group-hover:bg-neutral-200 text-neutral-700 rounded shadow-2xs border border-neutral-200 transition-colors">
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal</span>
            </span>
          </button>
        )}
      </div>

      {/* Step-by-Step Solve Guide (Separated per card) */}
      {isRevealed && showSteps && (
        <div className="mt-3 pt-3 border-t border-neutral-100 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <ListOrdered className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  {isEdge ? 'Edge Steps (Buffer: UR → Target: UL)' : 'Corner Steps (Buffer: ULB → Target: RDF)'}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">
                  {isEdge ? 'Moves allowed: L, Lw, D, Dw only' : 'Moves allowed: R, D, F only'}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">
              {stepDetails.length} step{stepDetails.length === 1 ? '' : 's'}
            </span>
          </div>

          {stepDetails.length === 0 ? (
            <p className="text-xs text-neutral-500 italic py-1">Already solved! No steps required.</p>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {stepDetails.map((step) => (
                <div
                  key={step.stepIndex}
                  className="p-2.5 rounded bg-neutral-50 border border-neutral-200/90 hover:bg-neutral-100/70 transition-colors text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[10px] font-bold">
                        {step.stepIndex}
                      </span>
                      <span>
                        Target: <span className="text-blue-700 text-sm font-black">{step.letter}</span>{' '}
                        <span className="text-neutral-500 font-normal">({step.pieceName})</span>
                      </span>
                    </span>

                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-neutral-200/80 text-neutral-700 font-mono">
                      {step.setup !== 'None' && step.setup !== 'Buffer Piece' ? `Setup: ${step.setup}` : 'Direct'}
                    </span>
                  </div>

                  {/* Structured Sequence */}
                  <div className="bg-white p-2 rounded border border-neutral-200 font-mono text-[11px] text-neutral-800 flex items-center justify-between shadow-2xs">
                    <span className="font-semibold text-neutral-900 select-all break-all">
                      {step.fullSequence}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyStep(step.fullSequence, step.stepIndex)}
                      className="ml-2 text-neutral-400 hover:text-indigo-600 shrink-0 p-1 rounded hover:bg-neutral-100 transition-colors"
                      title="Copy structured algorithm sequence"
                      aria-label={`Copy structured algorithm for step ${step.stepIndex}`}
                    >
                      {copiedStep === step.stepIndex ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Full Execution Moves */}
                  <div className="bg-indigo-50/50 p-2 rounded border border-indigo-100/80 font-mono text-[10px] text-indigo-950 flex items-center justify-between">
                    <div className="select-all break-all pr-2">
                      <span className="font-semibold text-indigo-700 mr-1.5 uppercase text-[9px] tracking-wider block sm:inline">
                        Full Moves:
                      </span>
                      <span className="text-neutral-800">{step.fullMoves}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyStep(step.fullMoves, step.stepIndex + 1000)}
                      className="text-neutral-400 hover:text-indigo-600 shrink-0 p-1 rounded hover:bg-indigo-100/60 transition-colors"
                      title="Copy full move string"
                      aria-label={`Copy full move string for step ${step.stepIndex}`}
                    >
                      {copiedStep === step.stepIndex + 1000 ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-neutral-500 leading-tight">
                    {step.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mnemonic pair cards (if expanded and revealed) */}
      {isRevealed && showMnemonics && pairsList.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-100">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
            Mnemonic Word Helper
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pairsList.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 text-xs bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200"
              >
                <span className="font-bold text-blue-700">{item.pair}</span>
                {item.word && <span className="text-neutral-600">→ {item.word}</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

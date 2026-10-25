/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check } from 'lucide-react';
import { EdgeBuffer } from '../cube/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scrambleLength: number;
  onChangeScrambleLength: (len: number) => void;
  hideWhenNoParity: boolean;
  onToggleHideNoParity: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  scrambleLength,
  onChangeScrambleLength,
  hideWhenNoParity,
  onToggleHideNoParity,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-neutral-200">
        <div className="bg-[#3F51B5] text-white px-5 py-4 flex items-center justify-between">
          <h2 id="settings-title" className="text-lg font-bold tracking-wide">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/15 text-white transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-sm text-neutral-800 max-h-[75vh] overflow-y-auto">
          {/* Edge Solving Buffer */}
          <div>
            <label className="block font-semibold text-neutral-900 mb-1">
              Edge Method & Buffer
            </label>
            <div className="p-3 rounded border border-neutral-200 bg-neutral-50 text-neutral-700">
              <div className="font-semibold">Old Pochmann (UR)</div>
              <div className="text-xs text-neutral-500">
                Buffer: UR (Sticker B). T-Perm swap with UL (D).
              </div>
            </div>
          </div>

          {/* Corner Buffer */}
          <div>
            <label className="block font-semibold text-neutral-900 mb-1">
              Corner Method & Buffer
            </label>
            <div className="p-3 rounded border border-neutral-200 bg-neutral-50 text-neutral-700">
              <div className="font-semibold">Old Pochmann (ULB)</div>
              <div className="text-xs text-neutral-500">
                Buffer: ULB (Sticker A). Standard Y-perm corner swap.
              </div>
            </div>
          </div>

          {/* Scramble Length */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="scramble-length-input" className="font-semibold text-neutral-900">
                Scramble Move Count
              </label>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {scrambleLength} moves
              </span>
            </div>
            <input
              id="scramble-length-input"
              type="range"
              min="15"
              max="25"
              value={scrambleLength}
              onChange={(e) => onChangeScrambleLength(Number(e.target.value))}
              className="w-full accent-[#3F51B5] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>15 (Short)</span>
              <span>21 (Standard WCA)</span>
              <span>25 (Thorough)</span>
            </div>
          </div>

          {/* Parity Section Preference */}
          <div className="pt-2 border-t border-neutral-100">
            <label className="flex items-center space-x-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hideWhenNoParity}
                onChange={onToggleHideNoParity}
                className="w-4 h-4 text-indigo-600 rounded border-neutral-300 focus:ring-indigo-500"
              />
              <span className="text-neutral-800">
                Hide Parity card when there is no parity
              </span>
            </label>
          </div>
        </div>

        <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#3F51B5] text-white font-medium rounded hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

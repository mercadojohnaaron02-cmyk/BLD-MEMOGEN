/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { applyScramble } from '../cube/cube';

interface EditScrambleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScramble: string;
  onSaveScramble: (newScramble: string) => void;
}

export const EditScrambleModal: React.FC<EditScrambleModalProps> = ({
  isOpen,
  onClose,
  currentScramble,
  onSaveScramble,
}) => {
  const [text, setText] = useState(currentScramble);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleValidateAndSave = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setValidationError('Please enter at least one move (e.g. R U R\' U\')');
      return;
    }

    const res = applyScramble(trimmed);
    if (res.error) {
      setValidationError(res.error);
      return;
    }

    setValidationError(null);
    onSaveScramble(trimmed);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-scramble-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-neutral-200">
        <div className="bg-[#3F51B5] text-white px-5 py-4 flex items-center justify-between">
          <h2 id="edit-scramble-title" className="text-lg font-bold tracking-wide">
            Custom Scramble
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/15 text-white transition-colors"
            aria-label="Cancel editing scramble"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <label htmlFor="custom-scramble-textarea" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider">
            Enter 3x3 Moves (Standard Notation)
          </label>
          <textarea
            id="custom-scramble-textarea"
            rows={4}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setValidationError(null);
            }}
            placeholder="e.g. R U R' U' R' F R2 U' R' U' R U R' F'"
            className="w-full font-mono text-sm p-3 border border-neutral-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-neutral-50"
          />

          {validationError && (
            <p className="text-xs text-rose-600 font-medium">{validationError}</p>
          )}

          <div className="flex flex-wrap gap-1 text-[11px] text-neutral-500">
            <span>Presets:</span>
            <button
              type="button"
              onClick={() => setText("R U R' U'")}
              className="px-1.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700"
            >
              Sexy Move
            </button>
            <button
              type="button"
              onClick={() => setText("R U R' U' R' F R2 U' R' U' R U R' F'")}
              className="px-1.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700"
            >
              T-Perm
            </button>
            <button
              type="button"
              onClick={() => setText("F R U' R' U' R U R' F' R U R' U' R' F R F'")}
              className="px-1.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700"
            >
              Y-Perm
            </button>
          </div>
        </div>

        <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleValidateAndSave}
            className="px-4 py-2 bg-[#3F51B5] text-white rounded hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer text-sm font-medium inline-flex items-center space-x-1"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Apply Scramble</span>
          </button>
        </div>
      </div>
    </div>
  );
};

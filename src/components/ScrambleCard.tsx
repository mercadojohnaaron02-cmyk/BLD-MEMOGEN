/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Edit3 } from 'lucide-react';

interface ScrambleCardProps {
  scramble: string;
  onEditScramble: () => void;
}

export const ScrambleCard: React.FC<ScrambleCardProps> = ({
  scramble,
  onEditScramble,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scramble);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const moveCount = scramble.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section className="bg-white rounded-md shadow-sm border border-neutral-200/80 p-4 transition-all hover:shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Scramble ({moveCount} moves)
        </span>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={onEditScramble}
            className="inline-flex items-center space-x-1 text-xs text-neutral-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors"
            title="Custom scramble"
            aria-label="Edit scramble notation"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 text-xs text-neutral-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-neutral-100 transition-colors"
            title="Copy scramble"
            aria-label="Copy scramble to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="font-mono text-[15px] sm:text-base leading-relaxed text-neutral-900 tracking-wide break-words select-all bg-[#FAFAFA] p-3 rounded border border-neutral-100">
        {scramble}
      </div>
    </section>
  );
};

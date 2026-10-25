/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Shuffle } from 'lucide-react';

interface ActionButtonsProps {
  onSolve: () => void;
  onScramble: () => void;
  isSolving?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSolve,
  onScramble,
  isSolving = false,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 my-2">
      <button
        type="button"
        onClick={onSolve}
        aria-label="Solve scramble and generate memo"
        className="w-full h-11 sm:h-12 bg-[#E0E0E0] hover:bg-[#D6D6D6] active:bg-[#BDBDBD] text-black font-bold uppercase tracking-wider text-sm sm:text-base rounded shadow-sm hover:shadow active:shadow-inner transition-all flex items-center justify-center space-x-2 border border-neutral-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <Play className="w-4 h-4 fill-black text-black" />
        <span>SOLVE</span>
      </button>

      <button
        type="button"
        onClick={onScramble}
        aria-label="Generate new random scramble"
        className="w-full h-11 sm:h-12 bg-[#E0E0E0] hover:bg-[#D6D6D6] active:bg-[#BDBDBD] text-black font-bold uppercase tracking-wider text-sm sm:text-base rounded shadow-sm hover:shadow active:shadow-inner transition-all flex items-center justify-center space-x-2 border border-neutral-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <Shuffle className={`w-4 h-4 text-black ${isSolving ? 'animate-spin' : ''}`} />
        <span>SCRAMBLE</span>
      </button>
    </div>
  );
};

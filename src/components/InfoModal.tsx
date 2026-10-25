/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-neutral-200">
        <div className="bg-[#3F51B5] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <h2 id="info-modal-title" className="text-lg font-bold tracking-wide">
              BLD MemoGen Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/15 text-white transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs sm:text-sm text-neutral-700 max-h-[75vh] overflow-y-auto leading-relaxed">
          {/* Section 1: Speffz Scheme */}
          <div>
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
              1. Speffz Lettering Scheme
            </h3>
            <p className="mb-2">
              Speffz assigns letters <strong>A through X</strong> to the 24 edge stickers and 24
              corner stickers in face order <strong>U, L, F, R, B, D</strong> in a clockwise spiral.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 p-3 rounded border border-neutral-200">
              <div>
                <span className="font-semibold text-neutral-900 block">U Face:</span> A, B, C, D
                <span className="font-semibold text-neutral-900 block mt-1">L Face:</span> E, F, G, H
                <span className="font-semibold text-neutral-900 block mt-1">F Face:</span> I, J, K, L
              </div>
              <div>
                <span className="font-semibold text-neutral-900 block">R Face:</span> M, N, O, P
                <span className="font-semibold text-neutral-900 block mt-1">B Face:</span> Q, R, S, T
                <span className="font-semibold text-neutral-900 block mt-1">D Face:</span> U, V, W, X
              </div>
            </div>
          </div>

          {/* Section 2: Buffers and Solving Methods */}
          <div>
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
              2. Solving Methods & Buffers
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Corner Solving:</strong> Old Pochmann using the <strong>ULB buffer (A)</strong> swapped with the <strong>RDF target (P)</strong> using a modified <strong>Y-perm</strong>. Only moves <code>R, D, F</code> are allowed for corner setups.
              </li>
              <li>
                <strong>Edge Solving:</strong> Old Pochmann using the <strong>UR buffer (B)</strong> swapped with the <strong>UL target (D)</strong> using <strong>T-perms</strong>. Only moves <code>L, Lw, D, Dw</code> are allowed for edge setups.
              </li>
            </ul>
          </div>

          {/* Section 3: Cycle Breaking */}
          <div>
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
              3. Cycle Breaking & Twisted Pieces
            </h3>
            <p className="mb-1.5">
              When the buffer piece returns to its home slot but other pieces remain unsolved, the
              solver automatically <strong>breaks into a new cycle</strong> using the lowest
              alphabetical unsolved letter.
            </p>
            <p className="text-neutral-600">
              Flipped edges and twisted corners are also solved by shooting to an unsolved sticker
              and letting the natural cycle return.
            </p>
          </div>

          {/* Section 4: Parity */}
          <div>
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
              4. Parity Detection
            </h3>
            <p>
              Parity occurs when there is an odd number of edge targets (which also means an odd
              number of corner targets). It is solved at the end with a parity algorithm such as a
              modified <strong>R-perm</strong> or <strong>D&apos; L2 D M2 D&apos; L2 D</strong>.
            </p>
          </div>
        </div>

        <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#3F51B5] text-white font-medium rounded hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

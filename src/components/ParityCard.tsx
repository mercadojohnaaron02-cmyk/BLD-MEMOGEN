/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ParityCardProps {
  hasParity: boolean;
  hideWhenNoParity?: boolean;
}

export const ParityCard: React.FC<ParityCardProps> = ({
  hasParity,
  hideWhenNoParity = false,
}) => {
  if (!hasParity && hideWhenNoParity) {
    return null;
  }

  if (hasParity) {
    return (
      <div
        data-testid="parity-warning"
        className="bg-white rounded-md shadow-sm border-l-4 border-l-[#D32F2F] border border-neutral-200/80 p-4 transition-all"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#D32F2F] tracking-tight flex items-center space-x-1.5">
              <AlertTriangle className="w-5 h-5 text-[#D32F2F]" />
              <span>Parity</span>
            </h2>
            <p className="text-xs text-neutral-500 font-normal">Letter scheme: Speffz</p>
          </div>

          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700">
            Odd Targets
          </span>
        </div>

        <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
          Odd number of edge targets detected. Execute an Old Pochmann parity algorithm (e.g.
          modified Ra-perm or D&apos; L2 D F2 D&apos; L2 D) to swap the buffer pieces.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm border border-neutral-200/80 p-3 flex items-center justify-between text-neutral-600 transition-all">
      <div className="flex items-center space-x-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <div>
          <span className="text-sm font-medium text-neutral-700">No Parity</span>
          <span className="text-xs text-neutral-400 ml-2">Letter scheme: Speffz</span>
        </div>
      </div>
      <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
        Even Targets
      </span>
    </div>
  );
};

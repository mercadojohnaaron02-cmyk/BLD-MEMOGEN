/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Info, Settings } from 'lucide-react';

interface AppBarProps {
  onOpenInfo: () => void;
  onOpenSettings: () => void;
  title?: string;
}

export const AppBar: React.FC<AppBarProps> = ({
  onOpenInfo,
  onOpenSettings,
  title = 'MemoGenerator',
}) => {
  return (
    <header className="w-full bg-[#3F51B5] text-white shadow-md select-none sticky top-0 z-20">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold tracking-wide text-white drop-shadow-sm">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={onOpenInfo}
            aria-label="Application info and Speffz guide"
            className="p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            title="Info & BLD Guide"
          >
            <Info className="w-5 h-5 text-white" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Solver and scramble settings"
            className="p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

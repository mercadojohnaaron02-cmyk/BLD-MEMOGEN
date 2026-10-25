/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CubeState } from '../cube/cube';
import { Face } from '../cube/types';
import { getLetterForFacelet } from '../cube/speffz';
import { Eye, EyeOff } from 'lucide-react';

interface CubeNetVisualizerProps {
  cube: CubeState;
  edgeBufferName?: string;
  cornerBufferName?: string;
}

export const CubeNetVisualizer: React.FC<CubeNetVisualizerProps> = ({
  cube,
  edgeBufferName = 'UR',
  cornerBufferName = 'ULB',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<{
    letter: string;
    face: Face;
    idx: number;
    color: string;
  } | null>(null);

  // Map facelet color name to Tailwind CSS color
  const getColorClass = (colorName: string): string => {
    switch (colorName) {
      case 'white':
        return 'bg-white text-neutral-900 border-neutral-300';
      case 'yellow':
        return 'bg-amber-300 text-neutral-900 border-amber-400';
      case 'green':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'blue':
        return 'bg-blue-600 text-white border-blue-700';
      case 'red':
        return 'bg-rose-600 text-white border-rose-700';
      case 'orange':
        return 'bg-orange-500 text-white border-orange-600';
      default:
        return 'bg-neutral-200 text-neutral-900 border-neutral-300';
    }
  };

  const renderFace = (face: Face, label: string) => {
    const facelets = cube[face];

    return (
      <div className="flex flex-col items-center">
        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5 select-none">
          {label} ({face})
        </span>
        <div className="grid grid-cols-3 gap-0.5 bg-neutral-900 p-0.5 sm:p-1 rounded shadow-inner">
          {facelets.map((color, idx) => {
            const isCenter = idx === 4;
            const isEdge = [1, 3, 5, 7].includes(idx);

            const letter = isCenter ? null : getLetterForFacelet(face, idx, isEdge);

            // Buffer highlights: UR is U face index 5, ULB is U face index 0
            const isEdgeBuffer =
              edgeBufferName === 'UR' && face === 'U' && idx === 5;
            const isCornerBuffer =
              cornerBufferName === 'ULB' && face === 'U' && idx === 0;

            const isSelected = selectedSticker?.letter === letter;

            return (
              <button
                type="button"
                key={idx}
                onClick={() =>
                  letter && setSelectedSticker({ letter, face, idx, color })
                }
                title={
                  isCenter
                    ? `${face} Center`
                    : `Speffz: ${letter || ''} (${isEdge ? 'Edge' : 'Corner'})`
                }
                className={`w-[22px] h-[22px] min-[370px]:w-[25px] min-[370px]:h-[25px] sm:w-7 sm:h-7 flex flex-col items-center justify-center font-bold text-[10px] rounded-[1.5px] transition-transform select-none ${getColorClass(
                  color
                )} ${
                  isEdgeBuffer
                    ? 'ring-2 ring-emerald-500 ring-offset-1 z-10'
                    : isCornerBuffer
                    ? 'ring-2 ring-purple-500 ring-offset-1 z-10'
                    : isSelected
                    ? 'ring-2 ring-yellow-400 z-10'
                    : ''
                }`}
              >
                {isCenter ? (
                  <span className="text-[9px] font-semibold opacity-75">{face}</span>
                ) : (
                  <span className="text-[10px] min-[370px]:text-[11px] font-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                    {letter}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-neutral-200/80 p-3 sm:p-4 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neutral-800 tracking-tight">
            Cube Net & Speffz Map
          </h2>
          <p className="text-xs text-neutral-500">
            Buffers: UR (Edge), ULB (Corner)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2.5 py-1.5 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
          aria-label={isOpen ? 'Hide cube net visualizer' : 'Show cube net visualizer'}
        >
          {isOpen ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Show Net</span>
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-col items-center w-full animate-in fade-in duration-150">
          {/* Unfolded Net Grid - Responsive container that never overflows mobile viewports */}
          <div className="w-full flex justify-center overflow-x-auto py-1">
            <div className="grid grid-cols-4 gap-1 min-[370px]:gap-1.5 sm:gap-2 items-center justify-center max-w-full">
              {/* Row 1: Up face */}
              <div className="col-start-2">{renderFace('U', 'Up')}</div>

              {/* Row 2: Left, Front, Right, Back */}
              <div className="col-start-1 row-start-2">{renderFace('L', 'Left')}</div>
              <div className="col-start-2 row-start-2">{renderFace('F', 'Front')}</div>
              <div className="col-start-3 row-start-2">{renderFace('R', 'Right')}</div>
              <div className="col-start-4 row-start-2">{renderFace('B', 'Back')}</div>

              {/* Row 3: Down face */}
              <div className="col-start-2 row-start-3">{renderFace('D', 'Down')}</div>
            </div>
          </div>

          {/* Legend and Selected Sticker info */}
          <div className="mt-3 w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-neutral-600 border-t border-neutral-100 pt-2.5">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full ring-2 ring-emerald-500 bg-emerald-100 inline-block shrink-0" />
              <span className="font-medium text-emerald-800">UR Buffer (B)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full ring-2 ring-purple-500 bg-purple-100 inline-block shrink-0" />
              <span className="font-medium text-purple-800">ULB Buffer (A)</span>
            </span>
            {selectedSticker && (
              <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Selected: {selectedSticker.letter} ({selectedSticker.face} face)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

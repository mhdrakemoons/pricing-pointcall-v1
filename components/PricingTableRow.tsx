'use client';

import { PricingRow } from '@/data/pricing-data';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface PricingTableRowProps {
  row: PricingRow;
  formatCurrency: (value: number | null | undefined) => string;
  onRowClick: (row: PricingRow) => void;
  rowRef: (el: HTMLDivElement | null) => void;
  rowNumber: number;
}

export default function PricingTableRow({
  row,
  formatCurrency,
  onRowClick,
  rowRef,
  rowNumber,
}: PricingTableRowProps) {
  return (
    <div
      ref={rowRef}
      data-row-id={row.id}
      className="group relative border-b border-white/15 hover:border-white/30 row-hover transition-all"
    >
      {/* Main Row */}
      <div
        className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-4 sm:px-5 md:px-6 lg:px-8 py-8 cursor-pointer transition-all hover:bg-white/20 hover:shadow-2xl hover:shadow-blue-500/20 border-l-4 border-l-transparent hover:border-l-blue-500/80 hover:scale-[1.01]"
        onClick={() => row.details && onRowClick(row)}
        data-row-content
      >
        <div className="col-span-5 min-w-0 overflow-visible relative">
          <div className="flex items-start gap-5" style={{ paddingLeft: '20px' }}>
            <div className="mt-2 text-white/30 group-hover:text-blue-300 group-hover:font-semibold transition-all flex-shrink-0 text-sm font-medium tabular-nums w-8 text-right">
              {rowNumber}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white/90 group-hover:text-white group-hover:font-semibold transition-all text-[15px] leading-relaxed mb-2 break-words">
                {row.app.split('\n')[0]}
              </div>
              {row.notes && (
                <div className="text-xs text-white/40 group-hover:text-white/80 mt-3 line-clamp-1 flex items-center gap-1.5 min-w-0 transition-all">
                  <InformationCircleIcon className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                  <span className="truncate">{row.notes.split('\n')[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2 text-right flex items-center justify-end">
          <span className="text-white/80 font-light text-lg group-hover:text-white group-hover:font-semibold group-hover:text-xl transition-all">
            {formatCurrency(row.cost100)}
          </span>
        </div>
        <div className="col-span-2 text-right flex items-center justify-end">
          <span className="text-white/80 font-light text-lg group-hover:text-white group-hover:font-semibold group-hover:text-xl transition-all">
            {formatCurrency(row.cost1000)}
          </span>
        </div>
        <div className="col-span-2 text-right flex items-center justify-end">
          <span className="text-white/80 font-light text-lg group-hover:text-white group-hover:font-semibold group-hover:text-xl transition-all">
            {formatCurrency(row.cost10000)}
          </span>
        </div>
        <div className="col-span-1 flex items-center justify-end p-2">
          {row.details && (
            <div className="details-button rounded-lg bg-blue-500/20 border border-blue-400/40 text-xs font-semibold text-blue-300 uppercase tracking-[0.1em] whitespace-nowrap group-hover:bg-blue-500/50 group-hover:text-white group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all cursor-pointer shadow-sm hover:shadow-md">
              Details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


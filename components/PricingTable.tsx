'use client';

import { useState, useEffect, useRef } from 'react';
import { PricingRow } from '@/data/pricing-data';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PricingTableProps {
  data: PricingRow[];
}

interface CumulativeTotals {
  cost100: number;
  cost1000: number;
  cost1000AWS: number; // AWS-only total for 1,000 users
  cost10000: number;
}

export default function PricingTable({ data }: PricingTableProps) {
  const [selectedRow, setSelectedRow] = useState<PricingRow | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const [cumulativeTotals, setCumulativeTotals] = useState<CumulativeTotals>({
    cost100: 0,
    cost1000: 0,
    cost1000AWS: 0,
    cost10000: 0,
  });
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = (row: PricingRow) => {
    setSelectedRow(row);
  };

  const closeModal = () => {
    setSelectedRow(null);
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    // Close modal on Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedRow) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedRow]);

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return '—';
    const numValue = Number(value);
    if (isNaN(numValue)) return '—';
    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(2)}M`;
    }
    if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(1)}K`;
    }
    return `$${numValue.toLocaleString()}`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const rowId = entry.target.getAttribute('data-row-id');
          if (!rowId) return;

          setVisibleRows((prev) => {
            const next = new Set(prev);
            if (entry.isIntersecting) {
              next.add(rowId);
            } else {
              next.delete(rowId);
            }
            return next;
          });
        });
      },
      {
        threshold: [0, 0.1, 0.5],
        rootMargin: '-120px 0px 0px 0px',
      }
    );

    // Set up observer after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const refs = Array.from(rowRefs.current.values());
      if (refs.length > 0) {
        refs.forEach((ref) => {
          if (ref) observer.observe(ref);
        });
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      const refs = Array.from(rowRefs.current.values());
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [data]);

  useEffect(() => {
    const visibleArray = Array.from(visibleRows);
    
    // Calculate totals based on visible rows
    let totals: CumulativeTotals = {
      cost100: 0,
      cost1000: 0,
      cost1000AWS: 0,
      cost10000: 0,
    };

    // EXCLUSION RULES:
    // For "Supabase + Netlify/Vercel + Render" total: EXCLUDE 'aws' row
    // For "AWS Only" total: EXCLUDE 'database' (Supabase), 'frontend' (Netlify/Vercel), 'backend' (Render)
    
    // Rows to exclude from AWS-only calculation
    const EXCLUDE_FROM_AWS_TOTAL = ['database', 'frontend', 'backend'];
    const EXCLUDE_FROM_SUPABASE_TOTAL = ['aws'];
    
    if (visibleArray.length === 0) {
      // Initial state: calculate totals for first visible rows (top of table)
      // This ensures we show something immediately
      for (let i = 0; i < Math.min(5, data.length); i++) {
        const row = data[i];
        if (row) {
          if (row.cost100 !== null && row.cost100 !== undefined) totals.cost100 += row.cost100;
          if (row.cost10000 !== null && row.cost10000 !== undefined) totals.cost10000 += row.cost10000;
        }
      }
    } else {
      // Calculate based on visible rows
      const visibleIndices = data
        .map((row, index) => ({ row, index }))
        .filter(({ row }) => visibleArray.includes(row.id))
        .map(({ index }) => index);

      if (visibleIndices.length > 0) {
        const maxVisibleIndex = Math.max(...visibleIndices);
        
        for (let i = 0; i <= maxVisibleIndex; i++) {
          const row = data[i];
          if (row) {
            if (row.cost100 !== null && row.cost100 !== undefined) totals.cost100 += row.cost100;
            if (row.cost10000 !== null && row.cost10000 !== undefined) totals.cost10000 += row.cost10000;
          }
        }
      }
    }

    // Calculate both 1000-user totals for ALL rows (not just visible)
    // 1. Supabase + Netlify/Vercel + Render total: ALL rows EXCEPT 'aws'
    let supabaseTotal = 0;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row && row.cost1000 !== null && row.cost1000 !== undefined && typeof row.cost1000 === 'number') {
        if (!EXCLUDE_FROM_SUPABASE_TOTAL.includes(row.id)) {
          supabaseTotal += row.cost1000;
        }
      }
    }
    totals.cost1000 = supabaseTotal;

    // 2. AWS Only total: ALL rows EXCEPT 'database', 'frontend', 'backend'
    let awsTotal = 0;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row && row.cost1000 !== null && row.cost1000 !== undefined && typeof row.cost1000 === 'number') {
        if (!EXCLUDE_FROM_AWS_TOTAL.includes(row.id)) {
          awsTotal += row.cost1000;
        }
      }
    }
    totals.cost1000AWS = awsTotal;

    setCumulativeTotals(totals);
  }, [visibleRows, data]);

  return (
    <div className="w-full">
      {/* Cumulative Total Bar - Sticky at Top - Apple Style */}
      <div className="sticky top-0 z-30 glass-header shadow-apple">
        <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-4 sm:px-5 md:px-6 lg:px-8 py-6">
          <div className="col-span-5 min-w-0 overflow-visible">
            <div className="mb-2">
              <h2 className="text-[11px] font-medium text-white/40 uppercase" style={{ paddingLeft: '20px', letterSpacing: '0.05em', display: 'block' }}>
                SERVICE / APPLICATION
              </h2>
            </div>
            <div className="flex items-center gap-3" style={{ paddingLeft: '20px' }}>
              <div className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0"></div>
              <span className="text-[13px] font-medium text-white/60 uppercase" style={{ letterSpacing: '0.05em' }}>
                Cumulative Total
              </span>
            </div>
          </div>
          <div className="col-span-2 text-right">
            <div className="mb-2">
              <h2 className="text-[11px] font-medium text-white/40 uppercase tracking-[0.2em]">
                100 Users
              </h2>
            </div>
            <span className="text-3xl font-light text-white tracking-tight">
              {formatCurrency(cumulativeTotals.cost100)}
            </span>
          </div>
          <div className="col-span-2 text-right">
            <div className="mb-2">
              <h2 className="text-[11px] font-medium text-white/40 uppercase tracking-[0.2em]">
                1,000 Users
              </h2>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-[9px] font-medium text-white/35 uppercase tracking-[0.1em] mb-1">
                  Supabase + Netlify/Vercel + Render
                </div>
                <span className="text-3xl font-light text-white tracking-tight block">
                  {formatCurrency(cumulativeTotals.cost1000 || 0)}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="text-[9px] font-medium text-white/35 uppercase tracking-[0.1em] mb-1">
                  AWS Only
                </div>
                <span className="text-3xl font-light text-white tracking-tight block">
                  {formatCurrency(cumulativeTotals.cost1000AWS || 0)}
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-2 text-right">
            <div className="mb-2">
              <h2 className="text-[11px] font-medium text-white/40 uppercase tracking-[0.2em]">
                10,000 Users
              </h2>
            </div>
            <span className="text-3xl font-light text-white tracking-tight">
              {formatCurrency(cumulativeTotals.cost10000)}
            </span>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Table Rows - Apple Style */}
      <div className="pb-4 sm:pb-6">
        {data.map((row, index) => {
          const rowRef = (el: HTMLDivElement | null) => {
            if (el) {
              rowRefs.current.set(row.id, el);
            } else {
              rowRefs.current.delete(row.id);
            }
          };

          return (
            <div
              key={row.id}
              ref={rowRef}
              data-row-id={row.id}
              className="group relative border-b border-white/5 row-hover transition-colors"
            >
              {/* Main Row */}
              <div
                className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-4 sm:px-5 md:px-6 lg:px-8 py-8 cursor-pointer transition-all hover:bg-white/[0.015]"
                onClick={() => row.details && openModal(row)}
                data-row-content
              >
                <div className="col-span-5 min-w-0 overflow-visible relative">
                  <div className="flex items-start gap-5" style={{ paddingLeft: '20px' }}>
                    <div className="mt-2 w-0.5 h-0.5 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white/90 group-hover:text-white transition-colors text-[15px] leading-relaxed mb-2 break-words">
                        {row.app.split('\n')[0]}
                      </div>
                      {row.notes && (
                        <div className="text-xs text-white/40 mt-3 line-clamp-1 flex items-center gap-1.5 min-w-0">
                          <InformationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{row.notes.split('\n')[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-right flex items-center justify-end">
                  <span className="text-white/80 font-light text-lg group-hover:text-white transition-colors">
                    {formatCurrency(row.cost100)}
                  </span>
                </div>
                <div className="col-span-2 text-right flex items-center justify-end">
                  <span className="text-white/80 font-light text-lg group-hover:text-white transition-colors">
                    {formatCurrency(row.cost1000)}
                  </span>
                </div>
                <div className="col-span-2 text-right flex items-center justify-end">
                  <span className="text-white/80 font-light text-lg group-hover:text-white transition-colors">
                    {formatCurrency(row.cost10000)}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  {row.details && (
                    <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-[9px] font-medium text-white/50 uppercase tracking-[0.1em] whitespace-nowrap group-hover:bg-white/8 group-hover:text-white/60 transition-all">
                      Details
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedRow && selectedRow.details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/85 to-black/90 backdrop-blur-2xl transition-opacity animate-fadeIn"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div 
            ref={modalRef}
            className="relative w-full max-w-6xl max-h-[96vh] overflow-y-auto rounded-3xl glass-premium border border-white/10 shadow-premium-lg animate-scaleIn"
            style={{ 
              scrollbarWidth: 'thin', 
              scrollbarColor: 'rgba(255,255,255,0.15) transparent',
              background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(20, 15, 35, 0.98) 100%)',
            }}
          >
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-10 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group backdrop-blur-sm border border-white/5"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6 text-white/50 group-hover:text-white transition-all duration-300" />
            </button>

            {/* Header */}
            <div className="px-10 sm:px-14 md:px-16 pt-16 pb-12 border-b border-white/10">
              <div className="pr-16">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.05] tracking-tight mb-6">
                  {selectedRow.app.split('\n')[0]}
                </h1>
                {selectedRow.notes && (
                  <p className="text-xl sm:text-2xl text-white/60 leading-relaxed max-w-4xl font-light">
                    {selectedRow.notes.split('\n')[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Pricing Stats */}
            <div className="px-10 sm:px-14 md:px-16 py-12 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
                {selectedRow.cost100 !== null && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/50 uppercase tracking-[0.15em] mb-3">100 Users</div>
                    <div className="text-4xl sm:text-5xl font-light text-white tracking-tight">{formatCurrency(selectedRow.cost100)}</div>
                  </div>
                )}
                {selectedRow.cost1000 !== null && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/50 uppercase tracking-[0.15em] mb-3">1,000 Users</div>
                    <div className="text-4xl sm:text-5xl font-light text-white tracking-tight">{formatCurrency(selectedRow.cost1000)}</div>
                  </div>
                )}
                {selectedRow.cost10000 !== null && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-white/50 uppercase tracking-[0.15em] mb-3">10,000 Users</div>
                    <div className="text-4xl sm:text-5xl font-light text-white tracking-tight">{formatCurrency(selectedRow.cost10000)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-10 sm:px-14 md:px-16 py-14 space-y-14">
              {/* Why, How, Where */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                <div className="space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400/60 to-purple-600/60 rounded-full"></div>
                    <div className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Why</div>
                  </div>
                  <p className="text-lg text-white/80 leading-relaxed font-light">
                    {selectedRow.details.why}
                  </p>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-400/60 to-blue-600/60 rounded-full"></div>
                    <div className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">How</div>
                  </div>
                  <p className="text-lg text-white/80 leading-relaxed whitespace-pre-wrap font-light">
                    {selectedRow.details.how}
                  </p>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-pink-400/60 to-pink-600/60 rounded-full"></div>
                    <div className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Where</div>
                  </div>
                  <p className="text-lg text-white/80 leading-relaxed font-light">
                    {selectedRow.details.where}
                  </p>
                </div>
              </div>

              {/* Cost Breakdown */}
              {selectedRow.details.breakdown && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-cyan-400/60 to-cyan-600/60 rounded-full"></div>
                    <div className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Cost Breakdown</div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-white/8 to-white/3 p-8 md:p-10 border border-white/10 backdrop-blur-sm shadow-lg">
                    <pre className="text-base text-white/90 leading-relaxed whitespace-pre-wrap font-mono break-words">
                      {selectedRow.details.breakdown}
                    </pre>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {selectedRow.notes && (
                <div className="space-y-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-amber-400/60 to-amber-600/60 rounded-full"></div>
                    <div className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Additional Notes</div>
                  </div>
                  <p className="text-lg text-white/80 leading-relaxed whitespace-pre-wrap font-light">
                    {selectedRow.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

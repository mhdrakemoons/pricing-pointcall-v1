'use client';

import { useState, useEffect, useRef } from 'react';
import { PricingRow } from '@/data/pricing-data';
import PricingTableRow from './PricingTableRow';
import PricingModal from './PricingModal';

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

  const openModal = (row: PricingRow) => {
    setSelectedRow(row);
  };

  const closeModal = () => {
    setSelectedRow(null);
  };

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return '—';
    const numValue = Number(value);
    if (isNaN(numValue)) return '—';
    return `$${numValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
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
            <PricingTableRow
              key={row.id}
              row={row}
              formatCurrency={formatCurrency}
              onRowClick={openModal}
              rowRef={rowRef}
              rowNumber={index + 1}
            />
          );
        })}
      </div>

      {/* Modal */}
      {selectedRow && selectedRow.details && (
        <PricingModal
          selectedRow={selectedRow}
          formatCurrency={formatCurrency}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

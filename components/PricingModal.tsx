'use client';

import { PricingRow } from '@/data/pricing-data';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';

interface PricingModalProps {
  selectedRow: PricingRow;
  formatCurrency: (value: number | null | undefined) => string;
  onClose: () => void;
}

interface BreakdownTableProps {
  breakdown: string;
}

function BreakdownTable({ breakdown }: BreakdownTableProps) {
  const parseBreakdown = (text: string) => {
    const sections: Array<{ title: string; rows: Array<{ service: string; configuration: string; cost: string }>; totals: Array<{ label: string; value: string }> }> = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentSection: { title: string; rows: Array<{ service: string; configuration: string; cost: string }>; totals: Array<{ label: string; value: string }> } | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if it's a section title (contains "Users")
      if (line.includes('Users')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { title: line, rows: [], totals: [] };
        continue;
      }
      
      // Skip separator lines (dashes or Unicode dash)
      if (line.match(/^[─\-]+$/)) {
        continue;
      }
      
      // Check if it's a header row
      if (line.includes('Service') && line.includes('Configuration') && line.includes('Cost')) {
        continue;
      }
      
      if (!currentSection) continue;
      
      // Check if it's a totals row (TOTAL, Per user, Per call)
      if (line.startsWith('TOTAL') || line.startsWith('Per user') || line.startsWith('Per call')) {
        const parts = line.split(/\s{2,}/).filter(p => p.trim());
        if (parts.length >= 2) {
          currentSection.totals.push({
            label: parts[0],
            value: parts[parts.length - 1]
          });
        }
        continue;
      }
      
      // Parse data rows
      // Split by multiple spaces (at least 2) to separate columns
      const parts = line.split(/\s{2,}/).filter(p => p.trim());
      if (parts.length >= 3) {
        // Service, Configuration(s), Cost
        currentSection.rows.push({
          service: parts[0],
          configuration: parts.slice(1, -1).join(' '),
          cost: parts[parts.length - 1]
        });
      } else if (parts.length === 2) {
        // Some rows might have service and cost only (no configuration)
        currentSection.rows.push({
          service: parts[0],
          configuration: '',
          cost: parts[1]
        });
      } else if (parts.length === 1 && line.trim()) {
        // Single column - might be a continuation or special row
        // Skip for now or handle as needed
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };
  
  const sections = parseBreakdown(breakdown);
  
  return (
    <div className="space-y-8">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-xs font-bold text-white/70 uppercase tracking-wider">Service</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-white/70 uppercase tracking-wider">Configuration</th>
                  <th className="text-right py-3 px-4 text-xs font-bold text-white/70 uppercase tracking-wider">Monthly Cost</th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-sm text-white/90 font-medium">{row.service}</td>
                    <td className="py-3 px-4 text-sm text-white/70">{row.configuration}</td>
                    <td className="py-3 px-4 text-sm text-white/90 font-semibold text-right">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
              {section.totals.length > 0 && (
                <tfoot>
                  {section.totals.map((total, totalIndex) => (
                    <tr key={totalIndex} className="border-t-2 border-white/30 bg-white/5">
                      <td colSpan={2} className="py-3 px-4 text-sm font-semibold text-white/90">
                        {total.label}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-white text-right">
                        {total.value}
                      </td>
                    </tr>
                  ))}
                </tfoot>
              )}
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PricingModal({
  selectedRow,
  formatCurrency,
  onClose,
}: PricingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Close modal on Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-container">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/85 to-black/90 backdrop-blur-2xl transition-opacity animate-fadeIn"
        onClick={onClose}
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent z-20"></div>
        
        {/* Sticky Header Container */}
        <div className="sticky top-0 z-20 bg-gradient-to-b from-[rgba(15,15,25,0.98)] via-[rgba(20,15,35,0.98)] to-[rgba(15,15,25,0.98)] backdrop-blur-xl border-b border-white/10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute modal-close-button z-30 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 group backdrop-blur-sm border border-white/5"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6 text-white/50 group-hover:text-white transition-all duration-300" />
          </button>

          {/* Header */}
          <div className="modal-header !pt-4 !pb-4 sm:!pt-6 sm:!pb-5 md:!pt-8 md:!pb-6">
            <div className="pr-12 sm:pr-16 md:pr-20">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-[1.05] tracking-tight mb-3">
                {selectedRow.app.split('\n')[0]}
              </h1>
              {selectedRow.notes && (
                <p className="text-sm sm:text-base md:text-lg text-white/60 leading-relaxed max-w-4xl font-light">
                  {selectedRow.notes.split('\n')[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Stats */}
        <div className="modal-section border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent !pt-4 !pb-4 sm:!pt-6 sm:!pb-5 md:!pt-8 md:!pb-6">
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
        <div className="modal-content !pt-4 !px-4 sm:!pt-6 sm:!px-6 md:!pt-8 md:!px-8 pb-16 sm:pb-20 md:pb-24">
          {/* Why, How, Where, Cost Breakdown - 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Why */}
            {selectedRow.details?.why && (
              <div className="modal-category-container !p-4 sm:!p-5 md:!p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-400/60 to-purple-600/60 rounded-full"></div>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Why</div>
                </div>
                <p className="text-lg text-white/80 leading-relaxed font-light">
                  {selectedRow.details.why}
                </p>
              </div>
            )}

            {/* How */}
            {selectedRow.details?.how && (
              <div className="modal-category-container !p-4 sm:!p-5 md:!p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-400/60 to-blue-600/60 rounded-full"></div>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">How</div>
                </div>
                <p className="text-lg text-white/80 leading-relaxed whitespace-pre-wrap font-light">
                  {selectedRow.details.how}
                </p>
              </div>
            )}

            {/* Where */}
            {selectedRow.details?.where && (
              <div className="modal-category-container !p-4 sm:!p-5 md:!p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-pink-400/60 to-pink-600/60 rounded-full"></div>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Where</div>
                </div>
                <p className="text-lg text-white/80 leading-relaxed font-light">
                  {selectedRow.details.where}
                </p>
              </div>
            )}

            {/* Cost Breakdown */}
            {selectedRow.details?.breakdown && (
              <div className="modal-category-container !p-4 sm:!p-5 md:!p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-cyan-400/60 to-cyan-600/60 rounded-full"></div>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Cost Breakdown</div>
                </div>
                <div className="overflow-x-auto">
                  <BreakdownTable breakdown={selectedRow.details.breakdown} />
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          {selectedRow.notes && (
            <div className="modal-category-container notes-spacing !p-4 sm:!p-5 md:!p-6">
              <div className="flex items-center gap-3 mb-6">
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
  );
}


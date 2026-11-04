import React, { useEffect, useState } from 'react';

interface PageTransitionOverlayProps {
  isTransitioning: boolean;
  pageName: string;
}

export const PageTransitionOverlay: React.FC<PageTransitionOverlayProps> = ({
  isTransitioning,
  pageName,
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-500 flex flex-col items-center justify-center bg-[#070e0a] ${
        isTransitioning ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Antique Gold Framing & Title Reveal */}
      <div className="relative text-center space-y-3 px-6">
        <div className="inline-block h-[1px] w-24 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent animate-pulse" />
        <div className="text-xs uppercase tracking-[0.3em] font-semibold text-[#c5a059]">
          SANSKRITI ARCHIVE
        </div>
        <div className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f7f3eb] tracking-wider uppercase">
          {pageName}
        </div>
        <div className="inline-block h-[1px] w-24 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent animate-pulse" />
      </div>

      {/* Decorative Corner Ornaments */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-[#c5a059]/40" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-[#c5a059]/40" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-[#c5a059]/40" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-[#c5a059]/40" />
    </div>
  );
};

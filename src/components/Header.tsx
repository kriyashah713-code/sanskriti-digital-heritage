import React, { useState } from 'react';
import { Menu, X, Compass, Box, MapPin, Sparkles, FolderArchive } from 'lucide-react';

export type PageId = 'home' | 'explore' | 'monument' | 'archive' | 'research' | 'map' | '3d-gallery';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId, monumentId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: PageId; label: string }> = [
    { id: 'explore', label: 'Explore' },
    { id: 'map', label: 'Heritage Map' },
    { id: '3d-gallery', label: '3D Gallery' },
    { id: 'archive', label: 'Archive' },
    { id: 'research', label: 'AI Scholar' },
  ];

  const handleNav = (id: PageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#09110d]/90 backdrop-blur-md border-b border-[#c5a059]/15 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNav('home')}
          className="text-xl md:text-2xl font-cinzel tracking-widest text-[#f7f3eb] hover:text-[#c5a059] transition-colors whitespace-nowrap shrink-0 text-left font-bold"
        >
          SANSKRITI
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#c5cfc8]">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#c5a059] font-semibold'
                    : 'text-[#c5cfc8] hover:text-[#f7f3eb]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059] transition-all" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNav('explore')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#09110d] bg-[#c5a059] hover:bg-[#d8b56d] transition-all duration-200 rounded-sm shadow-[0_2px_12px_rgba(197,160,89,0.25)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Monuments</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#c5cfc8] hover:text-[#f7f3eb] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1410] border-b border-[#c5a059]/20 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleNav('home')}
              className={`text-left py-2 px-3 text-base rounded transition-colors ${
                currentPage === 'home'
                  ? 'text-[#c5a059] bg-[#16251e] font-semibold'
                  : 'text-[#c5cfc8] hover:text-[#f7f3eb]'
              }`}
            >
              Home
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-left py-2 px-3 text-base rounded transition-colors flex items-center justify-between ${
                  currentPage === item.id
                    ? 'text-[#c5a059] bg-[#16251e] font-semibold'
                    : 'text-[#c5cfc8] hover:text-[#f7f3eb]'
                }`}
              >
                <span>{item.label}</span>
                {item.id === '3d-gallery' && <Box className="w-4 h-4 text-[#c5a059]" />}
                {item.id === 'map' && <MapPin className="w-4 h-4 text-[#c5a059]" />}
                {item.id === 'research' && <Sparkles className="w-4 h-4 text-[#c5a059]" />}
                {item.id === 'archive' && <FolderArchive className="w-4 h-4 text-[#c5a059]" />}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#c5a059]/15">
            <button
              onClick={() => handleNav('research')}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-wider font-semibold bg-[#c5a059] text-[#09110d] rounded-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Scholar</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

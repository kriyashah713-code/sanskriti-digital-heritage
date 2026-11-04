import React, { useState, useMemo } from 'react';
import { MONUMENTS, Monument } from '../data/monuments';
import { PageId } from '../components/Header';
import { Search, MapPin, ArrowRight, LayoutGrid, List, Sparkles, Filter, X } from 'lucide-react';

interface ExplorePageProps {
  onNavigate: (page: PageId, monumentId?: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const regions = ['All', 'West', 'North', 'South', 'East'];
  const styles = [
    'All',
    'Maru-Gurjara',
    'Dravidian',
    'Kalinga',
    'Mughal',
    'Buddhist Rock-Cut',
  ];

  const filteredMonuments = useMemo(() => {
    return MONUMENTS.filter((m) => {
      const matchesSearch =
        searchQuery === '' ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.hindiName.includes(searchQuery) ||
        m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.dynasty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === 'All' || m.region === selectedRegion;

      const matchesStyle =
        selectedStyle === 'All' ||
        m.architecturalStyle.toLowerCase().includes(selectedStyle.toLowerCase());

      return matchesSearch && matchesRegion && matchesStyle;
    });
  }, [searchQuery, selectedRegion, selectedStyle]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('All');
    setSelectedStyle('All');
  };

  return (
    <div className="min-h-screen bg-[#09110d] text-[#f7f3eb] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="space-y-3 border-b border-[#c5a059]/15 pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
            <span>Heritage Catalog</span>
            <span aria-hidden="true">·</span>
            <span>6 Primary Monument Studies</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-[#f7f3eb]">
            Explore India’s Heritage Architecture
          </h1>
          <p className="text-base font-editorial text-[#b8c7be] max-w-3xl">
            Filter by geographic region, century, and classical architectural orders. Each monument profile features verified Wikimedia Commons documentation, structural analysis, and coordinates.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#101b15] border border-[#c5a059]/20 p-5 rounded-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9eb0a5] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by monument name, state, dynasty, stone material..."
                className="w-full bg-[#09110d] border border-[#c5a059]/25 focus:border-[#c5a059] text-sm text-[#f7f3eb] placeholder-[#77887e] pl-10 pr-4 py-2.5 rounded-sm outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77887e] hover:text-[#f7f3eb]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#09110d] border border-[#c5a059]/20 p-1 rounded-sm shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#c5a059] text-[#09110d]'
                    : 'text-[#9eb0a5] hover:text-[#f7f3eb]'
                }`}
                title="Grid View"
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#c5a059] text-[#09110d]'
                    : 'text-[#9eb0a5] hover:text-[#f7f3eb]'
                }`}
                title="List View"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Region and Style Filters (Segmented Functional Controls) */}
          <div className="pt-3 border-t border-[#c5a059]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#9eb0a5] mr-1">Region:</span>
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`text-xs px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium ${
                    selectedRegion === region
                      ? 'bg-[#c5a059] text-[#09110d]'
                      : 'bg-[#09110d] text-[#c7d5cd] hover:bg-[#16251e] border border-[#c5a059]/15'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#9eb0a5] mr-1">Style:</span>
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`text-xs px-3 py-1.5 rounded-xs transition-colors cursor-pointer font-medium ${
                    selectedStyle === style
                      ? 'bg-[#c5a059] text-[#09110d]'
                      : 'bg-[#09110d] text-[#c7d5cd] hover:bg-[#16251e] border border-[#c5a059]/15'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {(searchQuery || selectedRegion !== 'All' || selectedStyle !== 'All') && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#c5a059] hover:underline cursor-pointer flex items-center gap-1 ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#9eb0a5] font-mono-tabular">
          <span>Showing {filteredMonuments.length} of {MONUMENTS.length} monuments</span>
          <span>Verified Archaeological Data</span>
        </div>

        {/* Monuments Display */}
        {filteredMonuments.length === 0 ? (
          <div className="p-12 text-center bg-[#101b15] border border-[#c5a059]/20 rounded-sm space-y-4">
            <p className="text-lg font-cinzel text-[#f7f3eb]">No monuments matched your search filters.</p>
            <p className="text-xs text-[#9eb0a5]">Try searching for 'stepwell', 'chariot', 'Gujarat', or reset filters.</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-semibold uppercase bg-[#c5a059] text-[#09110d] rounded-xs cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMonuments.map((monument) => (
              <div
                key={monument.id}
                onClick={() => onNavigate('monument', monument.id)}
                className="group bg-[#0e1712] border border-[#c5a059]/20 hover:border-[#c5a059] rounded-sm overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(197,160,89,0.15)] hover-trigger cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#16231c]">
                  <img
                    src={monument.heroImage.url}
                    alt={monument.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      if (monument.heroImage.fallbackUrl && e.currentTarget.src !== monument.heroImage.fallbackUrl) {
                        e.currentTarget.src = monument.heroImage.fallbackUrl;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1712] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 bg-[#09110d]/90 text-[#c5a059] text-[11px] font-semibold px-2.5 py-1 rounded-xs border border-[#c5a059]/30">
                    {monument.state}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#09110d]/90 text-[#f7f3eb] text-[11px] px-2.5 py-1 rounded-xs border border-white/10 font-mono-tabular">
                    {monument.century}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs text-[#9eb0a5] flex items-center gap-2">
                      <span>{monument.dynasty}</span>
                      <span aria-hidden="true">·</span>
                      <span>{monument.architecturalStyle.split(' ')[0]}</span>
                    </div>
                    <h3 className="text-xl font-cinzel font-bold text-[#f7f3eb] group-hover:text-[#c5a059] transition-colors">
                      {monument.name}
                    </h3>
                    <p className="text-xs text-[#c7d5cd] line-clamp-3 leading-relaxed">
                      {monument.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#c5a059]/15 flex items-center justify-between">
                    <div className="text-[11px] text-[#7e9085]">
                      Photo: {monument.heroImage.photographer}
                    </div>
                    <button
                      onClick={() => onNavigate('monument', monument.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c5a059] hover:text-[#d8b56d] transition-colors cursor-pointer"
                    >
                      <span>Study Monograph</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View (Editorial horizontal strips) */
          <div className="space-y-4">
            {filteredMonuments.map((monument) => (
              <div
                key={monument.id}
                onClick={() => onNavigate('monument', monument.id)}
                className="group bg-[#0e1712] border border-[#c5a059]/20 hover:border-[#c5a059]/60 rounded-sm overflow-hidden flex flex-col md:flex-row transition-all duration-300 cursor-pointer"
              >
                <div className="md:w-72 h-48 md:h-auto overflow-hidden bg-[#16231c] shrink-0 relative">
                  <img
                    src={monument.heroImage.url}
                    alt={monument.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      if (monument.heroImage.fallbackUrl && e.currentTarget.src !== monument.heroImage.fallbackUrl) {
                        e.currentTarget.src = monument.heroImage.fallbackUrl;
                      }
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-[#09110d]/90 text-[#c5a059] text-[10px] font-semibold px-2 py-0.5 rounded-xs border border-[#c5a059]/30">
                    {monument.state}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="text-xs text-[#9eb0a5] flex items-center gap-2">
                      <span>{monument.century}</span>
                      <span aria-hidden="true">·</span>
                      <span>{monument.dynasty}</span>
                      <span aria-hidden="true">·</span>
                      <span>{monument.material}</span>
                    </div>
                    <h3 className="text-xl font-cinzel font-bold text-[#f7f3eb] group-hover:text-[#c5a059] transition-colors">
                      {monument.name} <span className="font-editorial text-sm font-normal text-[#c5a059] ml-2">({monument.hindiName})</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#c7d5cd] leading-relaxed line-clamp-2">
                      {monument.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#c5a059]/15 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-[11px] text-[#7e9085] flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>{monument.location} ({monument.coordinates.lat.toFixed(4)}° N, {monument.coordinates.lng.toFixed(4)}° E)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('map');
                        }}
                        className="text-xs text-[#9eb0a5] hover:text-[#f7f3eb] cursor-pointer"
                      >
                        Locate on Map
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('monument', monument.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#c5a059] hover:text-[#d8b56d] transition-colors cursor-pointer"
                      >
                        <span>Full Monograph</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

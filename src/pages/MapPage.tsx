import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MONUMENTS, Monument } from '../data/monuments';
import { PageId } from '../components/Header';
import {
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
  ArrowRight,
  Layers,
  Info,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

interface MapPageProps {
  onNavigate: (page: PageId, monumentId?: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onNavigate }) => {
  const [selectedMonument, setSelectedMonument] = useState<Monument>(MONUMENTS[0]);
  const [apiKey, setApiKey] = useState<string>('');
  const [mapType, setMapType] = useState<'google' | 'cartographic'>('cartographic');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Fetch Maps API key from secure server-side endpoint
    fetch('/api/maps-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.apiKey) {
          setApiKey(data.apiKey);
          setMapType('google');
        }
      })
      .catch((err) => {
        console.error('Error fetching maps config:', err);
      });
  }, []);

  // Center on India (approximate centroid of the monuments)
  const defaultCenter = { lat: 21.5, lng: 78.0 };

  const getDirectionsUrl = (m: Monument) =>
    `https://www.google.com/maps/dir/?api=1&destination=${m.coordinates.lat},${m.coordinates.lng}`;

  return (
    <div className="min-h-screen bg-[#09110d] text-[#f7f3eb] py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c5a059]/15 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
              <span>Geospatial Heritage Explorer</span>
              <span aria-hidden="true">·</span>
              <span>Google Maps Platform Grounded</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-[#f7f3eb]">
              Interactive Heritage Map of India
            </h1>
            <p className="text-xs sm:text-sm text-[#b8c7be] font-editorial max-w-2xl">
              Discover all six architectural monuments positioned at their exact satellite coordinates across Gujarat, Uttar Pradesh, Karnataka, Odisha, and Maharashtra.
            </p>
          </div>

          {/* Map View Toggle */}
          <div className="flex items-center gap-2 bg-[#101b15] border border-[#c5a059]/20 p-1 rounded-sm shrink-0">
            <button
              onClick={() => setMapType('google')}
              className={`px-3 py-1.5 text-xs rounded-xs font-medium transition-colors cursor-pointer ${
                mapType === 'google'
                  ? 'bg-[#c5a059] text-[#09110d] font-semibold'
                  : 'text-[#9eb0a5] hover:text-[#f7f3eb]'
              }`}
            >
              Google Maps View
            </button>
            <button
              onClick={() => setMapType('cartographic')}
              className={`px-3 py-1.5 text-xs rounded-xs font-medium transition-colors cursor-pointer ${
                mapType === 'cartographic'
                  ? 'bg-[#c5a059] text-[#09110d] font-semibold'
                  : 'text-[#9eb0a5] hover:text-[#f7f3eb]'
              }`}
            >
              Cartographic India Matrix
            </button>
          </div>
        </div>

        {/* Main Map + Side Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Viewport Area */}
          <div data-lenis-prevent className="lg:col-span-8 bg-[#0d1611] border border-[#c5a059]/25 rounded-sm overflow-hidden relative shadow-2xl">
            {mapType === 'google' ? (
              <div className="w-full h-[600px] relative bg-[#0a120e]">
                {apiKey ? (
                  <>
                    <APIProvider
                      apiKey={apiKey}
                      libraries={['marker']}
                    >
                      <Map
                        defaultCenter={defaultCenter}
                        defaultZoom={5}
                        mapId="DEMO_MAP_ID"
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                        style={{ width: '100%', height: '100%' }}
                        gestureHandling={'greedy'}
                        disableDefaultUI={false}
                        onTilesLoaded={() => setIsMapLoaded(true)}
                      >
                        {MONUMENTS.map((monument) => {
                          const isSelected = selectedMonument.id === monument.id;
                          return (
                            <AdvancedMarker
                              key={monument.id}
                              position={{
                                lat: monument.coordinates.lat,
                                lng: monument.coordinates.lng,
                              }}
                              onClick={() => setSelectedMonument(monument)}
                              title={monument.name}
                            >
                              <Pin
                                background={isSelected ? '#c5a059' : '#15241c'}
                                borderColor={isSelected ? '#ffffff' : '#c5a059'}
                                glyphColor={isSelected ? '#09110d' : '#f7f3eb'}
                                scale={isSelected ? 1.3 : 1.0}
                              />
                            </AdvancedMarker>
                          );
                        })}
                      </Map>
                    </APIProvider>

                    {/* Subtle Map Legend Overlay */}
                    <div className="absolute top-4 left-4 bg-[#09110d]/90 backdrop-blur-md border border-[#c5a059]/30 p-2.5 rounded-sm text-xs space-y-1 pointer-events-auto shadow-md">
                      <div className="flex items-center gap-2 text-[#c5a059] font-semibold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>6 Heritage Markers Active</span>
                      </div>
                      <p className="text-[11px] text-[#9eb0a5]">Click any marker to inspect monument briefing</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#09110d] space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5 max-w-md">
                      <h3 className="text-lg font-cinzel font-bold text-[#f7f3eb]">
                        Google Maps API Key Not Detected
                      </h3>
                      <p className="text-xs text-[#9eb0a5] leading-relaxed">
                        To enable satellite imagery and Google Maps vectors, specify <code className="text-[#c5a059]">GOOGLE_MAPS_API_KEY</code> in your server environment or <code className="text-[#c5a059]">.env</code> file.
                      </p>
                    </div>
                    <button
                      onClick={() => setMapType('cartographic')}
                      className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d8b56d] text-[#09110d] font-semibold text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors shadow-md"
                    >
                      Switch to Cartographic India Matrix
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* High-Fidelity Cartographic India Matrix with Visual Coordinates Plot */
              <div className="w-full h-[600px] p-6 bg-[#09110d] flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10 space-y-1 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-[#c5a059]">
                      Archaeological Survey Coordinates Plot
                    </span>
                    <h3 className="text-lg font-cinzel font-bold text-[#f7f3eb]">
                      Geodetic India Coordinate Grid (WGS 84)
                    </h3>
                  </div>
                  <div className="text-[11px] text-[#9eb0a5] bg-[#101b15] px-3 py-1 rounded-xs border border-[#c5a059]/20">
                    Click pin or card to inspect
                  </div>
                </div>

                {/* Visual Cartographic Coordinate Plot with Interactive Pins */}
                <div className="relative z-10 w-full h-[280px] my-2 bg-[#0c1611]/80 rounded-sm border border-[#c5a059]/25 p-4 relative overflow-hidden">
                  {/* Subtle Coordinate Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between opacity-15 pointer-events-none p-4">
                    <div className="border-b border-[#c5a059] w-full flex justify-end text-[10px] text-[#c5a059]">28° N</div>
                    <div className="border-b border-[#c5a059] w-full flex justify-end text-[10px] text-[#c5a059]">24° N</div>
                    <div className="border-b border-[#c5a059] w-full flex justify-end text-[10px] text-[#c5a059]">20° N</div>
                    <div className="border-b border-[#c5a059] w-full flex justify-end text-[10px] text-[#c5a059]">16° N</div>
                  </div>

                  <div className="absolute inset-0 flex justify-between opacity-15 pointer-events-none p-4">
                    <div className="border-r border-[#c5a059] h-full flex items-end text-[10px] text-[#c5a059]">72° E</div>
                    <div className="border-r border-[#c5a059] h-full flex items-end text-[10px] text-[#c5a059]">76° E</div>
                    <div className="border-r border-[#c5a059] h-full flex items-end text-[10px] text-[#c5a059]">80° E</div>
                    <div className="border-r border-[#c5a059] h-full flex items-end text-[10px] text-[#c5a059]">84° E</div>
                    <div className="border-r border-[#c5a059] h-full flex items-end text-[10px] text-[#c5a059]">88° E</div>
                  </div>

                  {/* Monument Coordinate Pins */}
                  {MONUMENTS.map((m) => {
                    const isSelected = selectedMonument.id === m.id;
                    // Project lat 14°N..29°N -> 90%..10% top, lng 70°E..88°E -> 10%..90% left
                    const leftPercent = Math.max(8, Math.min(92, ((m.coordinates.lng - 70) / 18) * 80 + 10));
                    const topPercent = Math.max(8, Math.min(90, ((29 - m.coordinates.lat) / 15) * 80 + 10));

                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMonument(m)}
                        style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                      >
                        <div className="relative flex items-center justify-center">
                          {isSelected && (
                            <span className="absolute w-8 h-8 rounded-full bg-[#c5a059]/30 animate-ping pointer-events-none" />
                          )}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
                              isSelected
                                ? 'bg-[#c5a059] text-[#09110d] scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#09110d]'
                                : 'bg-[#15241c] text-[#c5a059] border border-[#c5a059]/60 hover:scale-110'
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Interactive Tooltip Callout */}
                        <div
                          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap pointer-events-none transition-all duration-200 ${
                            isSelected
                              ? 'opacity-100 translate-y-0 z-30'
                              : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
                          }`}
                        >
                          <div className="bg-[#09110d]/95 text-xs text-[#f7f3eb] font-semibold px-2.5 py-1 rounded-xs border border-[#c5a059]/40 shadow-xl flex items-center gap-1.5">
                            <span className="text-[#c5a059]">{m.name.split(' ')[0]}</span>
                            <span className="text-[10px] text-[#9eb0a5]">({m.state})</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Geographic Cards Matrix */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {MONUMENTS.map((m) => {
                    const isSelected = selectedMonument.id === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMonument(m)}
                        className={`text-left p-2.5 rounded-sm border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#182920] border-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.25)]'
                            : 'bg-[#0d1611] border-[#c5a059]/20 hover:border-[#c5a059]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#9eb0a5]">
                          <span>{m.state}</span>
                          <span className="font-mono-tabular text-[#c5a059]">{m.coordinates.lat.toFixed(2)}°N</span>
                        </div>
                        <h4 className="text-xs font-cinzel font-bold text-[#f7f3eb] mt-0.5 truncate">
                          {m.name}
                        </h4>
                      </button>
                    );
                  })}
                </div>

                <div className="relative z-10 text-[11px] text-[#7e8f85] border-t border-[#c5a059]/15 pt-2 flex items-center justify-between">
                  <span>Geodetic Datum: WGS 84</span>
                  <span>Google Maps Platform Verified Coordinates</span>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel: Selected Monument Dossier */}
          <div className="lg:col-span-4 bg-[#101b15] border border-[#c5a059]/25 rounded-sm overflow-hidden flex flex-col space-y-0 shadow-xl">
            {/* Monument Thumbnail */}
            <div className="relative aspect-[16/10] bg-[#16231c] overflow-hidden">
              <img
                src={selectedMonument.heroImage.url}
                alt={selectedMonument.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (selectedMonument.heroImage.fallbackUrl && e.currentTarget.src !== selectedMonument.heroImage.fallbackUrl) {
                    e.currentTarget.src = selectedMonument.heroImage.fallbackUrl;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101b15] via-transparent to-transparent opacity-90" />
              <div className="absolute top-3 left-3 bg-[#09110d]/90 text-[#c5a059] text-[11px] font-semibold px-2.5 py-1 rounded-xs border border-[#c5a059]/30">
                {selectedMonument.state}
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-xs text-[#c5a059] font-mono-tabular">
                  {selectedMonument.coordinates.lat.toFixed(4)}° N, {selectedMonument.coordinates.lng.toFixed(4)}° E
                </span>
                <h3 className="text-xl font-cinzel font-bold text-[#f7f3eb]">
                  {selectedMonument.name}
                </h3>
              </div>
            </div>

            {/* Information Details */}
            <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs text-[#9eb0a5] flex items-center gap-2">
                  <span>{selectedMonument.century}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedMonument.dynasty}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#c7d5cd] font-editorial leading-relaxed">
                  {selectedMonument.summary}
                </p>

                <div className="p-3 bg-[#09110d] border border-[#c5a059]/20 rounded-xs text-xs space-y-1">
                  <div className="text-[#889a8f]">Lithic Material:</div>
                  <div className="text-[#f7f3eb] font-medium">{selectedMonument.material}</div>
                </div>

                <div className="text-[11px] text-[#7d8f84]">
                  Photo Credit: {selectedMonument.heroImage.photographer} ({selectedMonument.heroImage.license})
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-[#c5a059]/15">
                <a
                  href={getDirectionsUrl(selectedMonument)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#c5a059] hover:bg-[#d8b56d] text-[#09110d] font-semibold text-xs uppercase tracking-wider rounded-xs transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Directions in Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <button
                  onClick={() => onNavigate('monument', selectedMonument.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#16251e] hover:bg-[#1d3227] text-[#f7f3eb] border border-[#c5a059]/30 font-semibold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  <span>Examine Full Architectural Monograph</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c5a059]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Monument Coordinates Matrix Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MONUMENTS.map((m) => {
            const isSelected = selectedMonument.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMonument(m)}
                className={`p-3 text-left rounded-sm border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#15241c] border-[#c5a059] shadow-md'
                    : 'bg-[#101b15] border-[#c5a059]/15 hover:border-[#c5a059]/40'
                }`}
              >
                <div className="text-[10px] text-[#c5a059] uppercase font-semibold">
                  {m.state}
                </div>
                <div className="text-xs font-cinzel font-bold text-[#f7f3eb] truncate mt-0.5">
                  {m.name}
                </div>
                <div className="text-[10px] text-[#7d9084] font-mono-tabular mt-1">
                  {m.coordinates.lat.toFixed(2)}°, {m.coordinates.lng.toFixed(2)}°
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
